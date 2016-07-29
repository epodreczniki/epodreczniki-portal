# coding=utf-8
from __future__ import absolute_import

from surround.django.decorators import never_cache_headers
from django.conf import settings
from .storage import Storage
from django.http import HttpResponse
import json
from . import keys
from . import exceptions
from . import objects
from . import forms
from . import models
from editstore.decorators import wrap_edition_errors
from django.utils.functional import cached_property
import store.views
from store import files
from django.conf.urls import patterns, url
from auth.utils import epo_auth_required
from . import locks
import repo
from surround.django.utils import print_traceback
from surround.django.utils import ExtendedOrigin, get_arg_from_post_then_get
from surround.django.platform_cache import edge_side_cache
from editstore.decorators import space_method, driver_method
from django.shortcuts import render
from django.http import Http404
from . import history

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())




class EditStoreViews(store.views.Views):

    drivers = objects.drivers
    storage = Storage
    subdomain_keys = keys.subdomain
    subdomain_timeout = settings.EPO_EDITSTORE_SOURCE_CACHE_TIME

    def wrap_presentation_view(self, func):
        return super(EditStoreViews, self).wrap_presentation_view(wrap_edition_errors(func))


    def _wrap_api_post_view(self, func, *args, **kwargs):
        return super(EditStoreViews, self)._wrap_api_post_view(wrap_edition_errors(func), *args, **kwargs)


    @cached_property
    def touch_object(self):

        @self.wrap_api_post_view
        def view(request, category, identifier, version):
            self.drivers.bind(category, identifier, version, request.user).touch()
            return HttpResponse(status=201)

        return view


    @cached_property
    def create_space(self):

        @epo_auth_required(profile='default')
        @self.wrap_api_post_view(wizard=True)
        @self.form_api_view(form=forms.CreateSpaceForm)
        def view(request, form):

            import random
            label = form.cleaned_data["label"]

            identifier = 's%016x' % (random.getrandbits(64))
            space = models.Space(identifier=identifier, label=label)
            space.save()
            models.UserRoleInSpace(user=request.user, space=space, role='admin').save()
            space_driver = objects.SpaceDriver.bind_db_object(space, user=request.user)

            return render(request, 'editstore/create_space_success.html', { 'space': space, 'space_driver': space_driver }, status=201)

        return view

    @cached_property
    def modify_space(self):

        @epo_auth_required(profile='default')
        @self.wrap_api_post_view(wizard=True)
        @space_method()
        @self.form_api_view(form=forms.ModifySpaceForm, pass_view_args=True)
        def view(request, form, space_driver):

            space_driver.db_space.label = form.cleaned_data['label']
            space_driver.db_space.save()

            return render(request, 'editstore/response_success.html', { 'space': space_driver.db_space }, status=201)

        return view


    @cached_property
    def edit_space_permissions(self):

        @epo_auth_required(profile='default')
        @self.wrap_api_post_view(wizard=True)
        @space_method()
        @self.form_api_view(form=forms.EditSpacePermissionsForm)
        def view(request, form, space_driver):

            if models.UserRoleInSpace.ADMIN_ROLE not in space_driver.user_effective_roles:
                raise exceptions.InsufficientPermissionsException('has to be admin')

            from django.contrib.auth.models import User
            user = User.objects.get(username=form.cleaned_data['username'])

            roles_to_be_set = form.cleaned_data['roles']

            if request.user == user and models.UserRoleInSpace.ADMIN_ROLE not in roles_to_be_set:
                raise exceptions.InvalidOperationException('admin cannot remove his own admin permissions')

            for role_name, _ in models.UserRoleInSpace.ROLES:

                if role_name in roles_to_be_set:
                    _, created = space_driver.db_space.users.get_or_create(user=user, role=role_name)
                else:
                    deleted = space_driver.db_space.users.filter(user=user, role=role_name).delete()

            return render(request, 'editstore/edit_permissions_success.html', { 'space_driver': space_driver, 'user_driver': objects.UserInSpaceDriver.bind_from_object(space_driver, user, user=request.user)}, status=201)

        return view


    @cached_property
    def delete_space(self):

        @epo_auth_required(profile='default')
        @self.wrap_api_post_view(wizard=True)
        @space_method()
        @self.form_api_view(form=forms.DeleteObjectForm)
        def view(request, form, space_driver):

            if space_driver.db_space.content_objects.exists():
                raise exceptions.SpaceNotEmpty(space.identifier)

            space_driver.db_space.delete()

            return render(request, 'editstore/delete_space_success.html', status=201)

        return view


    @cached_property
    def start_object(self):

        @epo_auth_required(profile='default')
        @self.wrap_api_post_view(wizard=True)
        @space_method()
        @self.form_api_view(form=forms.CreateForm, pass_view_args=True)
        def view(request, form, space_driver, category):
            from editstore import utils
            driver = utils.start_object(request, space_driver.db_space, category, form.cleaned_data['repository_name'], form.cleaned_data['template_name'])

            driver.push_history_entry('object_created.html', style='new')

            return render(request, 'editstore/start_object_success.html', { 'driver': driver, 'api_response': json.dumps(driver.json_descriptor) }, status=201)

        return view


    @cached_property
    def upload_object(self):

        @self.wrap_api_post_view
        @driver_method(use_space=False, must_exist=True, must_have_write=True)
        def view(request, driver):

            driver.update(files.read_files_from_request(request.FILES.getlist(request.FILES.keys()[0]), trim_first_dir=False))

            return HttpResponse(status=201)

        return view


    @cached_property
    def push_object(self):

        @self.wrap_api_post_view
        @driver_method(use_space=False, must_exist=True, must_have_write=True)
        def view(request, driver):

            with driver.bind_lock_from_request(request).at_least(locks.ObjectLockManager.WRITE) as lock:
                driver.update(files.read_files_from_request(request.FILES.getlist(request.FILES.keys()[0]), trim_first_dir=False))

            return HttpResponse(status=201)

        return view


    @cached_property
    def pull_object(self):

        @never_cache_headers
        @self.wrap_presentation_view
        @driver_method(use_space=False, must_exist=True)
        def view(request, driver):
            filename = request.GET.get('filename')

            with driver.bind_lock_from_request(request).at_least(locks.ObjectLockManager.WATCH) as lock:
                return driver.bind_file_driver(filename).as_http_response()

        return view


    def form_api_view(self, form, pass_view_args=False):

        def wrapper(func):

            def wrapped(request, *args, **kwargs):
                if request.POST:
                    if pass_view_args:
                        form_instance = form(request, request.POST, *args, **kwargs)
                    else:
                        form_instance = form(request, request.POST)

                    if form_instance.is_valid():
                        result = func(request, form_instance, *args, **kwargs)
                        return result

                    else:
                        status = 400
                else:
                    status = 200
                    if pass_view_args:
                        form_instance = form(request, request.GET, *args, **kwargs)
                    else:
                        form_instance = form(request, request.GET)

                return render(request, "editres/cascade_form.html", { 'form': form_instance }, status=status)


            return history.aggregate_history_entries(wrapped)

        return wrapper

    @cached_property
    def import_object(self):

        @self.wrap_api_post_view(wizard=True)
        @space_method()
        @self.form_api_view(form=forms.ImportWizardForm)
        def view(request, form, space_driver, category):

            import repo.objects
            identifier = form.cleaned_data['identifier']
            version = form.cleaned_data['version']
            if version is None:
                try:
                    import editsearch.utils
                    version = editsearch.utils.find_latest_version(category, identifier, only_sealed=True).version
                except Http404 as e:
                    raise exceptions.ObjectDoesNotExistInRepository('%s line %s does not exist in repository' % (category, identifier))

            source = repo.objects.drivers.bind(category, identifier, version, request.user)

            if form.cleaned_data['new_line']:
                try:
                    imported = source.repository.generate_new_object_line(category, user=request.user)
                except:
                    if category == 'womi':
                        raise exceptions.OperationNotSupportedYet('Operation not supported')
                    else:
                        raise Exception
            else:
                imported = self.drivers.convert(source.bind_next_version_driver())

            try:
                imported.space = space_driver.db_space
                imported.create_from_repository(source)

            except Http404 as e:
                raise exceptions.ObjectDoesNotExistInRepository('%s line %s does not exist in repository' % (category, identifier))

            imported.push_history_entry('object_imported.html', style='import')

            return render(request, 'editstore/import_object_success.html', { 'driver': imported, 'api_response': json.dumps(imported.json_descriptor) }, status=201)

        return view


    @cached_property
    def seal_object(self):

        @self.wrap_api_post_view(wizard=True)
        @driver_method(must_exist=True, must_have_write=True)
        @self.form_api_view(form=forms.SealWizardForm)
        def view(request, form, driver):


            with driver.bind_lock_from_request(request).at_least(locks.ObjectLockManager.WRITE, provide=True) as lock:
                driver.push_history_entry('object_sealed.html', style='seal')
                sealed_driver = driver.seal()

            # import time ; time.sleep(8)

            return render(request, 'editstore/seal_object_success.html', { 'driver': driver }, status=201)

        return view


    @cached_property
    def clone_object(self):

        @self.wrap_api_post_view(wizard=True)
        @driver_method(use_space=True, must_exist=True, must_have_write=True)
        @self.form_api_view(form=forms.CloneObjectForm)
        def view(request, form, driver):

            cloned = driver.repository.generate_new_object_line(driver.category, user=request.user)
            cloned.space = driver.space
            cloned.create_from_edition(driver)

            return render(request, 'editstore/clone_object_success.html', { 'driver': cloned, 'api_response': json.dumps(cloned.json_descriptor) }, status=201)

        return view

    @cached_property
    def delete_object(self):

        @self.wrap_api_post_view(wizard=True)
        @driver_method(must_exist=True, must_have_write=True)
        @self.form_api_view(form=forms.DeleteObjectForm)
        def view(request, form, driver):

            with driver.bind_lock_from_request(request).at_least(locks.ObjectLockManager.WRITE, provide=True) as lock:
                driver.push_history_entry('object_deleted.html', style='delete')
                driver.delete()

            return render(request, 'editstore/delete_object_success.html', { 'space': driver.space }, status=201)

        return view


    @cached_property
    def rename_object(self):

        @self.wrap_api_post_view(wizard=True)
        @driver_method(must_exist=True, must_have_write=True)
        @self.form_api_view(form=forms.RenameWizardForm, pass_view_args=True)
        def view(request, form, driver):

            new_repository = repo.repositories[form.cleaned_data['repository_name']]

            new_driver = new_repository.generate_new_object_line(driver.category, request.user)
            new_driver.rename_from_edition(driver)
            # driver.push_history_entry('object_sealed.html', style='seal')

            driver.delete()

            return render(request, 'editstore/rename_object_success.html', { 'driver': new_driver, 'api_response': json.dumps(new_driver.json_descriptor) }, status=201)


        return view



    # @cached_property
    # def validate_object(self):

    #     @self.wrap_api_post_view
    #     @driver_method(must_exist=True, must_have_write=True)
    #     def view(request, driver):

    #         with driver.bind_lock_from_request(request).at_least(locks.ObjectLockManager.WRITE) as lock:
    #             driver.update(files.read_files_from_request(request.FILES.getlist(request.FILES.keys()[0]), trim_first_dir=False))

    #         return HttpResponse(status=201)

    #     return view



    @cached_property
    def lock_object(self):

        @self.wrap_api_post_view
        @driver_method(use_space=False, must_exist=True)
        def view(request, driver):

            result = driver.bind_lock_from_request(request).set_mode_catching(get_arg_from_post_then_get(request, 'mode'))

            return HttpResponse(json.dumps(result), content_type='application/json')

        return view


    @cached_property
    def lock_app(self):

        @self.wrap_api_post_view
        # @print_traceback
        def view(request, appid):

            lock = locks.AppLockManager(lockid=get_arg_from_post_then_get(request, 'lockid'), user=request.user, origin=ExtendedOrigin.from_request(request), appid=appid)
            result = lock.set_mode_catching(get_arg_from_post_then_get(request, 'mode'))

            return HttpResponse(json.dumps(result), content_type='application/json')

        return view


    def bind_www_urlpattens(self):
        return (super(EditStoreViews, self).bind_www_urlpattens() +
            patterns('',

                url(r'^api/touch/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.touch_object),

                url(r'^api/lock/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.lock_object),
                url(r'^api/pull/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.pull_object),
                url(r'^api/push/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.push_object),
                url(r'^api/seal/(?P<spaceid>\w+)/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.seal_object, name='editstore_seal_object'),
                url(r'^api/rename/(?P<spaceid>\w+)/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.rename_object, name='editstore_rename_object'),
                url(r'^api/clone/(?P<spaceid>\w+)/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.clone_object, name='editstore_clone_object'),
                url(r'^api/delete/(?P<spaceid>\w+)/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.delete_object, name='editstore_delete_object'),
                url(r'^api/start/(?P<spaceid>\w+)/(?P<category>collection|module|womi)$', self.start_object, name='editstore_start_object'),
                url(r'^api/app/lock/(?P<appid>\w+)$', self.lock_app),
                url(r'^api/space/create$', self.create_space, name='editstore_create_space'),
                url(r'^api/space/modify/(?P<spaceid>\w+)$', self.modify_space, name='editstore_modify_space'),
                url(r'^api/space/permissions/(?P<spaceid>\w+)$', self.edit_space_permissions, name='editstore_edit_space_permissions'),
                url(r'^api/space/delete/(?P<spaceid>\w+)$', self.delete_space, name='editstore_delete_space'),


                url(r'^api/import/(?P<spaceid>\w+)/(?P<category>collection|module|womi)', self.import_object, name='editstore_import_object'),
                url(r'^api/upload/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.upload_object),
            ))


bound_views = EditStoreViews()

