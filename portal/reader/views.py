# coding=utf-8
import json
from common.endpoint import endpoint_string_pattern
from common.url_providers import get_womi_file_url
from django.conf import settings
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.http import JsonResponse
from django.shortcuts import render, redirect
from reader.utils import engine_dependency, IMPORTS_SPLIT_CHAR
from common.forms import ReaderContactForm
from surround.django.basic.templatetags.common_ext import make_schemeless
from surround.django.utils import absolute_url
from surround.django.decorators import legacy_cache_page
from django.views.decorators.cache import never_cache
from common import models
from common import presentations
from django.utils.functional import cached_property, SimpleLazyObject
from . import womireader
from django.views.generic import View
from . import keys
from common.model_mixins import FIRST_VARIANT
import functools
from surround.django.esi import render_with_esi

from surround.django import platform_cache

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


class CollectionReader(View):
    endpoints = {}
    use_test = False
    template_name = 'reader.html'

    def get(self, request, presentation, module_id):

        module_presentation = presentation.bind_module_or_404(module_id)

        return render_with_esi(request, self.template_name, {
            'presentation': presentation,
            'collection': presentation.collection,
            'module': module_presentation.module_occurrence.module,
            'module_occurrence': module_presentation.module_occurrence,
            'use_test': self.use_test,
            'endpoints': self.endpoints,
            'results_url_base': absolute_url(request, '')
        })



class PlatformOnlyOperation(Exception):
    pass


@never_cache
def emergency_reader(request, collection_id, version, variant):
    raise PlatformOnlyOperation()


@legacy_cache_page()
def av_rewrite(request, path):
    return platform_cache.internal_redirect(request, 'http://%s/RepositoryAccess/%s' % (settings.BACKEND_ADDRESS['av'], path))


class ReaderViews(object):

    name = 'reader'
    config = models.Config
    use_womi_version = False
    presentations = presentations
    womi_timeout = settings.EPO_PUBLISHED_CONTENT_CACHE
    collection_reader_timeout = settings.EPO_PUBLISHED_CONTENT_CACHE
    collection_details_template = 'front/details_root.html'
    reader_template = 'reader.html'
    keys = keys
    support_contact = True


    def cache_view(self, key, timeout):

        def wrapper(view):
            return legacy_cache_page(key=key, timeout=timeout)(view)

        return wrapper

    def wrap_collection_reader(self, not_ready_template, prefetch_modules=True, variant=None, pass_module=False):

        def wrapper(view):

            if pass_module:
                def wrapped(request, collection_id, version, variant, module_id, *args, **kwargs):
                    module_presentation = self.presentations.bind_module_occurrence_or_404(collection_id, version, variant, module_id, prefetch_modules=prefetch_modules)
                    return view(request, module_presentation, *args, **kwargs)
            else:
                def wrapped(request, collection_id, version, variant, *args, **kwargs):
                    presentation = self.presentations.bind_collection_or_404(collection_id, version, variant, prefetch_modules=prefetch_modules)
                    return view(request, presentation, *args, **kwargs)

            return functools.wraps(view)(wrapped)

        return wrapper


    @cached_property
    def reader(self):

        return self.cache_view(
            key=(self.keys.platform + 'reader:c:{collection_id}:v:{version}:t:{variant}:m:{module_id}'),
            timeout=self.collection_reader_timeout
        )(self.wrap_collection_reader('collection_not_ready.html', prefetch_modules=False)(CollectionReader.as_view(endpoints=self.endpoints,
                                                                                            template_name=self.reader_template)))


    @cached_property
    def collection_details(self):

        @self.cache_view(key=(self.keys.platform + 'reader:c:{collection_id}:v:{version}:details'), timeout=self.collection_reader_timeout)
        @self.wrap_collection_reader(self.collection_details_template, prefetch_modules=False)
        def view(request, presentation):
            return redirect(presentation.detail_url)

        return view


    @cached_property
    def variant_details(self):

        @self.cache_view(key=(self.keys.platform + 'reader:c:{collection_id}:v:{version}:t:{variant}:details'), timeout=self.collection_reader_timeout)
        @self.wrap_collection_reader(self.collection_details_template, prefetch_modules=True)
        def view(request, presentation):

            return render_with_esi(request, self.collection_details_template, {
                'presentation': presentation,
                'collection': presentation.collection,
                'resources_url': 'content.%s/resources/' % settings.TOP_DOMAIN
            })

        return view


    @cached_property
    def table_of_contents(self):

        @self.cache_view(key=(self.keys.platform + 'reader:c:{collection_id}:v:{version}:t:{variant}:toc'), timeout=self.collection_reader_timeout)
        @self.wrap_collection_reader(self.collection_details_template, prefetch_modules=True)
        def view(request, presentation):

            response = render(request, 'reader/table_of_contents_root.html', {
                'presentation': presentation,
            })
            return response

        return view



    @cached_property
    def volatile_module(self):

        @self.cache_view(key=(self.keys.platform + 'reader:c:{collection_id}:v:{version}:t:{variant}:volatile:{module_id}'), timeout=self.collection_reader_timeout)
        def view(request, collection_id, version, variant, module_id):

            raise NotImplementedError('volatile modules are switched off')

        return view

    @cached_property
    def license(self):

        @self.cache_view(key=(self.keys.platform + 'reader:c:{collection_id}:v:{version}:t:{variant}:m:{module_id}:license'), timeout=self.collection_reader_timeout)
        @self.wrap_collection_reader(self.collection_details_template, prefetch_modules=False, pass_module=True)
        def view(request, module_presentation):
            return render(request, 'license.html', {
                'collection': module_presentation.collection,
                'module': module_presentation.module,
            })

        return view


    @cached_property
    def curriculum(self):

        @self.cache_view(key=(self.keys.platform + 'reader:c:{collection_id}:v:{version}:t:{variant}:m:{module_id}:curriculum'), timeout=self.collection_reader_timeout)
        @self.wrap_collection_reader(self.collection_details_template, prefetch_modules=False, pass_module=True)
        def view(request, module_presentation):
            if module_presentation.collection.ep_environment_type == 'ee':
                lastSubtitle = None
                cc_list = []
                for entry in module_presentation.module.core_curriculum_entries:
                    if lastSubtitle != entry.subject.key:
                        cc_list.insert(0, [])
                    cc_list[0].append(entry)
                    lastSubtitle = entry.subject.key
                template = 'core_curriculum_ee.html'
                parameters = { 'cc_list': cc_list }
            else:
                template = 'core_curriculum.html'
                parameters = { 'collection': module_presentation.collection, 'module': module_presentation.module }
            return render(request, template, parameters)

        return view


    @cached_property
    def contact(self):

        @never_cache
        @self.wrap_collection_reader(self.collection_details_template, prefetch_modules=False, pass_module=True)
        def view(request, module_presentation):

            if request.POST:
                form = ReaderContactForm(request.POST, module_occurrence=module_presentation.module_occurrence)
                if form.is_valid():
                    if self.support_contact:
                        form.process(request)

                    return render(request, 'contact_form_success.html')
            else:
                form = ReaderContactForm(module_occurrence=module_presentation.module_occurrence)

            return render(request, 'module_contact_form.html', {'form': form, 'module': module_presentation.module})

        return view


    @cached_property
    def endpoints(self):
        return {
            'womi-url-pattern': make_schemeless(get_womi_file_url(self.config.SUBDOMAIN, '{womi_id}', '{version}', '{path}')),
            'module-url-pattern': SimpleLazyObject(lambda: endpoint_string_pattern('%s_module_reader' % self.name, True)),
            'variant-url-pattern': SimpleLazyObject(lambda: endpoint_string_pattern('reader_variant_details', True))
        }

    @cached_property
    def module_womis(self):

        @self.cache_view(key=(self.keys.platform + 'reader:m:{module_id}:v:{version}:womis'), timeout=self.collection_reader_timeout)
        def view(request, module_id, version):

            module = self.config.get_module_or_404(module_id, version)

            return render(request, 'module_details.html', {
                'module': module,
            })

        return view


    @cached_property
    def module_dependencies(self):

        @self.cache_view(key=(self.keys.platform + 'reader:m:{module_id}:v:{version}:dependencies'), timeout=self.collection_reader_timeout)
        def view(request, module_id, version):
            engines = []
            if module_id != 'title':
                module = self.config.get_module_or_404(module_id, version)
                engines = engine_dependency(module.ep_imports.split(IMPORTS_SPLIT_CHAR))
            if module.md_school is not None and module.md_school.md_education_level == 'I':
                engines = []
            return HttpResponse(json.dumps(engines), content_type='application/json')

        return view


    @cached_property
    def womi_show(self):

        @self.cache_view(key=(self.keys.platform + 'reader:w:{womi_id}:v:{version}:show'), timeout=self.womi_timeout)
        def view(request, womi_id, version):
            presentation = self.presentations.bind_womi_or_404(womi_id, version)

            return render(request, 'womi_show.html', {
                'presentation': presentation,
            })

        return view


    @cached_property
    def womi_embed(self):

        return self.cache_view(key=(self.keys.platform + 'reader:w:{womi_id}:v:{version}:embed'), timeout=self.womi_timeout)(
            womireader.WomiReader.as_view(template='womi_embed.html',
                                          use_version=self.use_womi_version,
                                          endpoints=self.endpoints,
                                          config=self.config))


    @cached_property
    def womi_technical(self):

        return self.cache_view(key=(self.keys.platform + 'reader:w:{womi_id}:v:{version}:technical'), timeout=self.womi_timeout)(
            womireader.WomiReader.as_view(template='womi_preview.html',
                                          use_version=self.use_womi_version,
                                          endpoints=self.endpoints,
                                          config=self.config))

    @cached_property
    def womi_aggregate(self):

        return self.cache_view(key=(self.keys.platform + 'reader:w:{womi_id}:v:{version}:aggregate'), timeout=self.womi_timeout)(
            womireader.WomiReader.as_view(template='aggregate_show.html',
                                          use_version=self.use_womi_version,
                                          endpoints=self.endpoints,
                                          config=self.config))

    @cached_property
    def collection_details_url(self):
        from django.conf.urls import url
        return url(r'^details/(?P<collection_id>\w+)/(?P<version>\w+)$', self.collection_details, name='%s_collection_details' % self.name, kwargs={ 'variant': FIRST_VARIANT })


    @cached_property
    def www_urlpattens(self):
        from django.conf.urls import patterns, url, include

        collection_patterns = patterns('',
            url(r'^$', self.variant_details, name='%s_variant_details' % self.name),
            url(r'^/toc$', self.table_of_contents, name='%s_table_of_contents' % self.name),
            url(r'^/m/(?P<module_id>\w+)$', self.reader, name='%s_module_reader' % self.name),
            url(r'^/m/(?P<module_id>\w+)/license$', self.license, name='%s_license' % self.name),
            url(r'^/m/(?P<module_id>\w+)/curriculum$', self.curriculum, name='%s_curriculum' % self.name),
            url(r'^/m/(?P<module_id>\w+)/contact$', self.contact, name='%s_contact' % self.name),
            url(r'^/m/(?P<module_id>\w+)/auto$', self.wrap_collection_reader('collection_not_ready.html')(womireader.AutonomicWomiReader.as_view(use_version=self.use_womi_version, config=self.config)), name='%s_autonomic_womi_reader' % self.name),
            url(r'^/volatile/(?P<module_id>\w+)$', self.volatile_module, name='%s_volatile_module' % self.name),
        )

        if settings.EPO_ENABLE_TESTS:
            collection_patterns += patterns('', url(r'^/m/(?P<module_id>\w+)/test$', self.wrap_collection_reader('collection_not_ready.html')(CollectionReader.as_view(endpoints=self.endpoints,
                                                                                            use_test=True, template_name=self.reader_template)), name='%s_module_reader_test' % self.name))

        return patterns('',
                url(r'^c/(?P<collection_id>\w+)/v/(?P<version>\w+)/t/(?P<variant>(\w|-)+)', include(collection_patterns)),

                url(r'^m/(?P<module_id>\w+)/v/(?P<version>\d+)', include(patterns('',
                    url(r'^/dependencies$', self.module_dependencies, name=self.config.view_name('module_dependencies')),
                    url(r'^/womis$', self.module_womis, name=self.config.view_name('module_womis')),
                ))),

                url(r'^w/(?P<womi_id>\w+)/v/(?P<version>\d+)', include(patterns('',
                    url('^/technical$', self.womi_technical, name='%s_womi_technical' % self.name),
                    url('^/embed$', self.womi_embed, name='%s_womi_embed' % self.name),
                    url('^/aggregate$', self.womi_aggregate, name='%s_womi_aggregate' % self.name),
                    url('^$', self.womi_show, name='%s_womi_show' % self.name),
                ))),
            )

bound_views = ReaderViews()


