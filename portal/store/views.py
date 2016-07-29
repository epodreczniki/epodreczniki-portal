from __future__ import absolute_import

from surround.django.decorators import never_cache_headers
from surround.django.simple_cors.decorators import cors_headers
from django.views.decorators.clickjacking import xframe_options_exempt
from django.http import HttpResponse
import json
from django.views.decorators.http import require_http_methods
from surround.django.platform_cache import edge_side_cache
from django.utils.functional import cached_property
from django.conf.urls import patterns, url
from . import objects
from . import files

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


class Views(object):

    drivers = objects.drivers


    def wrap_presentation_view(self, func):
        return never_cache_headers(cors_headers(profile='open')(func))


    def wrap_api_post_view(self, *args, **kwargs):
        from inspect import isfunction
        if len(args) == 1 and not kwargs and isfunction(args[0]):
            return self._wrap_api_post_view(args[0])
        else:
            def wrapper(func):
                return self._wrap_api_post_view(func, *args, **kwargs)
            return wrapper


    def _wrap_api_post_view(self, func, wizard=False):
        return never_cache_headers(cors_headers(profile='edition')(require_http_methods(["GET", "POST"] if wizard else ["POST"])(func)))


    @cached_property
    def present_collection_xml(self):

        @edge_side_cache(key=(self.subdomain_keys + 'c:{collection_id}:v:{version}'), timeout=self.subdomain_timeout)
        @self.wrap_presentation_view

        def view(request, collection_id, version):
            return self.drivers.collection.bind(collection_id, version).bind_file_driver('collection.xml').as_http_response()

        return view

    @cached_property
    def present_module_xml(self):

        @edge_side_cache(key=(self.subdomain_keys + 'm:{module_id}:v:{version}'), timeout=self.subdomain_timeout)
        @self.wrap_presentation_view
        def view(request, module_id, version):
            return self.drivers.module.bind(module_id, version).bind_file_driver('module.xml').as_http_response()

        return view

    @cached_property
    def present_womi_file(self):

        @edge_side_cache(key=(self.subdomain_keys + 'w:{womi_id}:v:{version}:p:{womi_path}'), timeout=self.subdomain_timeout)
        @self.wrap_presentation_view
        @xframe_options_exempt
        def view(request, womi_id, version, womi_path):
            return self.drivers.womi.bind(womi_id, version).bind_file_driver(womi_path).as_http_response()

        return view


    @cached_property
    def search_object(self):

        def view(request):
            s = self.storage.get()
            result = { "types": {}}

            for type_ in ('collection', 'module', 'womi'):
                objects = {}
                for d in self.drivers.list_all_existing_as_drivers(type_, list_all=True):
                    if not d.identifier in objects:
                        objects[d.identifier] = { "id": d.identifier, "versions": [] }
                    objects[d.identifier]["versions"].append({"version": d.version, "title": d.title})
                result["types"][type_] = { "objects": objects.values() }

            return HttpResponse(json.dumps(result), 'application/json')

        return view

    @cached_property
    def list_objects(self):

        def view(request, category):
            s = self.storage.get()

            objects = []
            for d in self.drivers.get(category).all_existing_as_drivers(list_all=True):
                objects.append({ 'category': category, 'identifier': d.identifier, 'version': d.version })

            return HttpResponse(json.dumps(objects), 'application/json')

        return view


    @cached_property
    def create_object(self):

        @self.wrap_api_post_view
        def view(request, category, identifier, version):
            self.drivers.bind(category, identifier, version, request.user).create(files.read_files_from_request(request.FILES.getlist(request.FILES.keys()[0]), trim_first_dir=False))
            return HttpResponse(status=201)

        return view


    @cached_property
    def delete_object(self):

        @self.wrap_api_post_view
        def view(request, category, identifier, version):
            self.drivers.bind(category, identifier, version, request.user).delete()
            return HttpResponse(status=204)

        return view

    @cached_property
    def descriptor_object(self):

        def view(request, category, identifier, version):
            driver = self.drivers.bind(category, identifier, version, request.user)
            driver.raise_for_exists()

            return HttpResponse(json.dumps(driver.json_descriptor), content_type='application/json')

        return view



    def bind_www_urlpattens(self):
        return patterns('',
            url(r'^api/search$', self.search_object),
            url(r'^api/list/(?P<category>collection|module|womi)$', self.list_objects),
            url(r'^api/create/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.create_object),
            url(r'^api/delete/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.delete_object),
            url(r'^api/descriptor/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', self.descriptor_object),
        )


    def bind_subdomain_urlpatterns(self):
        return patterns('',
            url(r'^content/womi/(?P<womi_id>\w+)/(?P<version>\d+)/(?P<womi_path>.*)$', self.present_womi_file),
            url(r'^content/collection/(?P<collection_id>\w+)/(?P<version>\d+)/collection.xml$', self.present_collection_xml),
            url(r'^content/module/(?P<module_id>\w+)/(?P<version>\d+)/module.xml$', self.present_module_xml),
        )


