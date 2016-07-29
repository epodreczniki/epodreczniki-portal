from __future__ import absolute_import

from django.conf import settings
from surround.django.decorators import never_cache_headers
from django.http import HttpResponseNotFound
from surround.django.simple_cors.decorators import cors_headers
from surround.django.platform_cache import edge_side_cache
from . import keys
from django.views.decorators.clickjacking import xframe_options_exempt
import repo

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

def process_request(method, request, category, identifier, version, *args):
    r = repo.repositories.match_repository_for_id(category, identifier)
    if not r.enabled:
        # warning('referring with to %s:%s:%s in disabled repository %s' % (category, identifier, version, r))
        return HttpResponseNotFound()
    return getattr(r, method)(request, identifier, version, *args)


@edge_side_cache(key=(keys.subdomain + 'c:{collection_id}:v:{version}'), timeout=settings.EPO_PREVIEW_SOURCE_CACHE_TIME)
@never_cache_headers
def present_collection_xml(request, collection_id, version):

    return process_request('present_collection_xml', request, 'collection', collection_id, version)


@edge_side_cache(key=(keys.subdomain + 'm:{module_id}:v:{version}'), timeout=settings.EPO_PREVIEW_SOURCE_CACHE_TIME)
@never_cache_headers
def present_module_xml(request, module_id, version):

    return process_request('present_module_xml', request, 'module', module_id, version)


@edge_side_cache(key=(keys.subdomain + 'w:{womi_id}:v:{version}:p:{womi_path}'), timeout=settings.EPO_PREVIEW_WOMI_CACHE_TIME)
@never_cache_headers
@cors_headers(profile='open')
@xframe_options_exempt
def present_womi_file(request, womi_id, version, womi_path):

    return process_request('present_womi_file', request, 'womi', womi_id, version, womi_path)

