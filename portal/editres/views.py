# coding=utf-8
from __future__ import absolute_import

from auth.utils import epo_auth_required, anonymous_required
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import redirect
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from editstore.utils import check_input_files
import editstore.objects
import repo.objects
from editstore import utils
from surround.django.decorators import never_cache_headers
from . import forms
from editstore import objects
from editstore.decorators import driver_method, space_method
from editcommon.decorators import must_revalidate_headers
import editcommon.objects
from common import messages
import repo
import store.exceptions
import editstore.exceptions
from editstore import exceptions
from editstore.decorators import wrap_edition_errors
from store import files
from editstore import models
from repository.utils import map_as_drivers
from editstore import locks
from django.core.urlresolvers import reverse
import editsearch.utils
from editres.utils import compare_dates
from django.http import Http404
from django.utils.functional import cached_property
from editcommon.decorators import cascade_forms_actions
from .templatetags.editres_general import new_old_template
import itertools
from surround.django.esi import render_with_esi


import editstore.keys
from editstore import history

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


@anonymous_required(redirect_view='editres.views.dashboard', profile='default')
@must_revalidate_headers
@wrap_edition_errors
def landing_page(request):
    return render_with_esi(request, 'editres/welcome.html', {})


@epo_auth_required(profile='default')
@must_revalidate_headers
@wrap_edition_errors
def dashboard(request):

    if request.user.is_superuser or request.user.is_staff:
        spaces = models.Space.objects.all()
    else:
        spaces = models.Space.objects.filter(users__user=request.user).distinct()

    return render_with_esi(request, new_old_template('dashboard.html'), {
        'presentation_driver': objects.RootPresentationDriver(),
        'space_drivers': [objects.SpaceDriver.bind_db_object(space, request.user) for space in spaces],
        'stream': objects.UserDriver.bind_from_object(request.user),
    })


@epo_auth_required(profile='default')
@must_revalidate_headers
@wrap_edition_errors
@space_method()
def space_main(request, space_driver):

    categories = []

    for c in [objects.CollectionDriver, objects.ModuleDriver, objects.WomiDriver]:
        drivers = list(space_driver.all_existing_in_category(c.category))
        categories.append({
            'description': c.template_description(),
            'count': len(drivers),
            'firsts': c.multi_parse_objects(drivers[:2]),
        })


    return render_with_esi(request, new_old_template('space_main.html'), {
        'space': space_driver.db_space,
        'categories': categories,
        'space_driver': space_driver,
        'stream': space_driver,
        'navbar_chosen': 'space',
    })


@epo_auth_required(profile='default')
@must_revalidate_headers
@wrap_edition_errors
@space_method()
def listing(request, space_driver, category):

    driver_class = objects.drivers.get(category)
    drivers = list(space_driver.all_existing_in_category(category))
    drivers.sort(cmp=compare_dates)
    driver_class.multi_parse_objects(drivers)
    category_listing_driver = objects.CategoryListingDriver.bind(space_driver, category, user=request.user)

    return render_with_esi(request, 'editres/listing.html', {
        'resource_name': category,
        'category_driver': category_listing_driver,
        'presentation_driver': category_listing_driver,
        'space': space_driver.db_space,
        'space_driver': space_driver,
        'stream': space_driver,
        'drivers': drivers,
        'navbar_chosen': 'listing',
    })


def find_next_broken_module_link(collection):

    for module in collection.modules:
        for reference in module.module_references:
            if reference.identifier != module.identifier:
                try:
                    referenced_module = collection.get_module_by_id(reference.identifier)
                except KeyError:
                    return (module.identifier, reference.identifier)

    return (None, None)



@require_http_methods(["POST"])
@epo_auth_required(profile='default')
@never_cache_headers
@wrap_edition_errors
@driver_method(must_exist=True)
def validate_object(request, driver):

    # messages.success(request, u'Obiekt poprawnie zwalidowano')


    # first we need to get to EO all out-modules, that need to have their
    # references fixed
    # execute_next_loop = True

    iterations = 0
    while True:

        out_broken_module, in_broken_identifier = find_next_broken_module_link(driver.parsed_object)

        if out_broken_module is None:
            break

        messages.info('Odwołanie z modułu %s nie znajduje modułu docelowego %s', out_broken_module.identifier, in_broken_identifier)


        # check whether out_broken module is available in edition
        # if not, import it, and use automatically in that collection

        out_broken_driver = editcommon.objects.drivers.bind('module', out_broken_module.identifier, out_broken_module.version, user=request.user)
        if out_broken_driver.is_repo_driver:
            messages.info('Moduł %s nie znajduje się w edycji online. Następuje import i przewiązanie.', out_broken_module.identifier)
            out_broken_imported = import_next_version_shared(request, driver.space, out_broken_driver)
            if out_broken_imported is None:
                messages.error('Automatyczny import modułu %s nie powiódł się. ', out_broken_module.identifier)

            # with driver.bind_lock.at_least(locks.)





        # search for new identifier for in_broken (it does not have to be in edition)
        # if it is not found - break with failure
        # if found, substitute all reference from out_broken
        in_fixed_new_driver = None
        for current_module in driver.parsed_object.modules:
            search_module = current_module

            while search_module is not None:
                search_module = search_module.origin
                if search_module.identifier == in_broken_identifier:
                    in_fixed_new_driver = current_module
                    break

            if in_fixed_new_driver is not None:
                break

        if in_fixed_new_driver is None:
            messages.error('Nie odnaleziono nowej wersji dla modułu %s', in_broken_identifier)
            break

        messages.info('Odnaleziono bieżący odpowiednik dla modułu %s w kolekcji: %s', out_broken_module.identifier, in_fixed_new_driver.identifier)



        iterations += 1

    if iterations == 0:
        messages.success('Kolekcja jest poprawna')
    else:
        messages.info('Kolekcja została poprawiona w %s iteracjach', iterations)


    return redirect(edit, driver.spaceid, driver.category, driver.identifier, driver.version)




@epo_auth_required(profile='default')
@must_revalidate_headers
@wrap_edition_errors
@driver_method(must_exist=True, category='module')
def preview_module_selection(request, driver):

    collection_drivers = list(driver.get_referencing_collections_drivers(list_all=False, with_dummy=True))
    if len(collection_drivers) == 1:
        c = collection_drivers[0]
        return redirect('preview_module_reader', c.identifier, c.version, 'student-canon', driver.identifier)

    return render_with_esi(request, 'editres/preview_module.html', {
        'driver': driver,
        'space': driver.space,
        'collection_drivers': collection_drivers,
    })


@epo_auth_required(profile='default')
@must_revalidate_headers
@wrap_edition_errors
@driver_method(must_exist=True, use_space=False)
def find_object(request, driver):

    return redirect(edit, driver.spaceid, driver.category, driver.identifier, driver.version)


@epo_auth_required(profile='default')
@must_revalidate_headers
@wrap_edition_errors
@driver_method(must_exist=True, redirect_missing=True)
def edit(request, driver):

    if request.method == 'POST' and request.POST.get('file_to_delete', None):
        path = request.POST.get('file_to_delete', None)
        if path:
            try:
                file_driver = driver.bind_file_driver(path)
                if not file_driver.is_removeable:
                    raise store.exceptions.FileNotRemoveable(file_driver.fullpath)
                file_driver.delete()
                messages.success(request, u'Plik %s poprawnie usunięto' % path)
            except Exception as e:
                messages.error(request, u'Problem z usunięciem pliku %s:\n%s' % (path, e), extra_tags='danger', exception=e)
        return redirect(edit, driver.spaceid, driver.category, driver.identifier, driver.version)
    elif request.method == 'POST':
        try:
            check_input_files(request.FILES.getlist('files'))
            driver.update(files.read_files_from_request(request.FILES.getlist('files')))
            messages.success(request, u'Poprawnie zaktualizowano plik(i)')
        except Exception as e:
            messages.error(request, u'Wystąpił problem z aktualizacją - %s' % e, extra_tags='danger', exception=e)
        return redirect(edit, driver.spaceid, driver.category, driver.identifier, driver.version)

    return render_with_esi(request, new_old_template('edit_%s.html' % driver.category), {
        'file_limit': settings.EDITRES_FILEUPLOAD_MAX_SIZE,
        'file_limit_user_friendly': settings.EDITRES_FILEUPLOAD_MAX_SIZE / (1024 * 1024),
        'presentation_driver': driver,
        'space_driver': driver.space_driver,
        'category_driver': driver.category_driver,
        'driver': driver,
        'space': driver.space,
        'navbar_chosen': 'object',
        'stream': driver,
    })


class Action(object):

    def __init__(self, view, args=[], kwargs={}, optional=False, checked=True, text='Wykonaj', form_class=forms.HiddenForm, initial=None, finish=True):
        self.view = view
        self.args = args
        self.kwargs = kwargs
        self.checked = checked
        self.optional = optional
        self.text = text
        self.form_class = form_class
        self.initial = initial if initial is not None else {}
        self.finish = finish

    @cached_property
    def url(self):
        return reverse(self.view, args=self.args, kwargs=self.kwargs)

    @cached_property
    def form(self):
        form = self.form_class(self.request, self.initial)
        form.description_text = self.text
        return form



def bind_seal_action(driver, **kwargs):
    from editstore.views import bound_views
    from editstore.forms import SealWizardForm
    return Action(
        view=bound_views.seal_object,
        args=[driver.space.identifier, driver.category, driver.identifier, driver.version],
        text=(u'Pieczętuj %s' % driver.title),
        form_class=SealWizardForm,
        **kwargs
    )

def bind_deletion_action(driver, **kwargs):
    from editstore.views import bound_views
    from editstore.forms import DeleteObjectForm
    return Action(
        view=bound_views.delete_object,
        args=[driver.space.identifier, driver.category, driver.identifier, driver.version],
        text=(u'Usuń %s' % driver.title),
        form_class=DeleteObjectForm,
        **kwargs
    )

@epo_auth_required(profile='default')
@never_cache_headers
@wrap_edition_errors
@space_method()
@cascade_forms_actions
def space_delete_wizard(request, space_driver):
    from editstore.views import bound_views
    from editstore.forms import DeleteSpaceForm

    for content_object in space_driver.db_space.content_objects.all():
        yield bind_deletion_action(content_object.driver, finish=False)

    yield Action(view=bound_views.delete_space, args=[space_driver.identifier], optional=True, text=u'Usuń przestrzeń', form_class=DeleteSpaceForm)


@epo_auth_required(profile='default')
@never_cache_headers
@wrap_edition_errors
@driver_method(must_exist=True, must_have_write=True)
@cascade_forms_actions
def seal_wizard(request, driver):

    from editstore.views import bound_views
    from editstore.forms import ImportWizardForm

    for dependency in map_as_drivers(editcommon.objects.drivers, driver.parsed_object.dependencies):
        if dependency is not None:
            if not dependency.is_repo_driver:
                yield bind_seal_action(dependency, finish=False)

    yield bind_seal_action(driver)

    yield Action(
        view=bound_views.import_object,
        args=[driver.space.identifier, driver.category],
        checked=False,
        optional=True,
        text='Kontynuuj edycję',
        initial={ 'identifier': driver.identifier, 'version': driver.version, 'mode': 'continue' },
        form_class=ImportWizardForm,
    )


@epo_auth_required(profile='default')
@never_cache_headers
def generate_package(request, category, identifier, version):
    driver = objects.drivers.bind(category, identifier, version, request.user)
    pack_obj = driver.generate_package()

    info('prepaing package: for %s %s:%s', category, identifier, version)

    response = HttpResponse(pack_obj, 'application/zip, application/octet-stream')
    response['Content-Disposition'] = 'attachment; filename="%s_%s_%s.zip"' % (driver.category, driver.identifier, driver.version)
    return response


# @epo_auth_required(profile='default')
@never_cache_headers
def stream_provider(request, stream_key):
    return render(request, 'editres/snippets/history_list.html', { 'entries': history.fetch_stream_history(stream_key) })


@epo_auth_required(profile='default')
@never_cache_headers
@wrap_edition_errors
@driver_method(must_exist=True, must_have_write=True)
def change_user_label(request, driver):
    driver.raise_for_write_perm()
    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        form = forms.ChangeLabelForm(request.POST)
        if form.is_valid():
            label = form.cleaned_data["label"]
            operation = int(form.cleaned_data["operation"])
            if operation == 0:
                driver.add_user_label(label)
            elif operation == 1:
                driver.remove_user_label(label)

    return redirect(edit, driver.spaceid, driver.category, driver.identifier, driver.version)


