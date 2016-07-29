# coding=utf-8
from __future__ import absolute_import

from preview.views import monitor_error_response
import requests
from surround.django.platform_cache import edge_side_cache
from surround.django import platform_cache
from surround.django.decorators import never_cache_headers
from django.conf import settings
from django.http import Http404
from . import keys
from django.views.decorators.clickjacking import xframe_options_exempt
from requests.exceptions import RequestException
from repo.exceptions import RepositoryNotFound
from surround.django.simple_cors.decorators import cors_headers
import repo.views
import editstore.views
from django.http.response import HttpResponse
from django.utils import encoding
from preview import utils

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())



def internal_redirect_with_precheck(request, url, monitor, error_template, context={}, status=202):
    try:
        r = requests.head(url, timeout=60, headers={ "X-HEAD": "1" })
        r.raise_for_status()
        monitor.mark_success()
        return platform_cache.internal_redirect(request, url)
    except RequestException as e:
        return monitor_error_response(request, monitor, error_template, status=status, context=context)


@edge_side_cache(
    key=(keys.platform + 'reader:c:{collection_id}:v:{version}:t:{variant}:f:{emission_format}'),
    #Testing if not caching the emission formats will help in breaking the download
    timeout=0)
    #timeout=settings.EPO_PREVIEW_SK_TIMEOUT)
@never_cache_headers
def collection_emission_format(request, collection_id, version, variant, emission_format):
    return internal_redirect_with_precheck(request,
        url='http://%s/content/%s/%s/%s/%s' % (settings.BACKEND_ADDRESS['coding_server'], collection_id, version, variant, emission_format),
        monitor=utils.CollectionXMLReferenceMonitor(collection_id, version),
        error_template='collection_emission_format_not_ready.html',
        status=404,
        context={'collection_id': collection_id, 'version': version})


@edge_side_cache(
    key=(keys.platform + 'reader:c:{collection_id}:v:{version}:t:{variant}:f:collection.xml'),
    timeout=settings.EPO_PREVIEW_SK_TIMEOUT)
@never_cache_headers
def preview_transformed_collection_xml(request, collection_id, version, variant):

    return platform_cache.internal_redirect(request, 'http://%s/content/%s/%s/%s/collection.xml' % (
        settings.BACKEND_ADDRESS['coding_server'], collection_id, version, variant))


@edge_side_cache(key=keys.subdomain + 'c:{collection_id}:v:{version}:metadata', timeout=settings.EPO_PREVIEW_SK_TIMEOUT)
@never_cache_headers
def collection_metadata_xml(request, collection_id, version):

    return platform_cache.internal_redirect(request, 'http://%s/content/%s/%s/metadata.xml' % (
        settings.BACKEND_ADDRESS['coding_server'], collection_id, version))


@edge_side_cache(
    key=(keys.platform + 'reader:c:{collection_id}:v:{version}:t:{variant}:m:{module_id}:html'),
    timeout=settings.EPO_PREVIEW_HTML_CACHE_TIME)
@cors_headers(profile='open')
@xframe_options_exempt
def preview_module_html(request, collection_id, version, variant, module_id):

    module_url = ('http://' + settings.BACKEND_ADDRESS['coding_server'] + '/content/' +
                  collection_id + '/' + version + '/' + variant + '/' + module_id + '.html')
    # debug('requesting: ' + module_url)

    r = requests.get(module_url)
    r.encoding = 'utf-8'
    if r.status_code == 200:
        return HttpResponse(encoding.smart_unicode(r.text), content_type=r.headers['Content-Type'])
    else:
        response = platform_cache.pass_forced_ttl_timeout(
            HttpResponse(u"<h1>Podgląd modułu nie jest jeszcze dostępny. Spróbuj ponownie później.</h1>",
                         content_type='text/html'), 5)
        response['X-EPO-MATERIALIZED-MODULE-HTML'] = '1'
        return response


@edge_side_cache(key=(keys.subdomain + 'c:{collection_id}:v:{version}:t:{variant}:m:{module_id}:xml'), timeout=settings.EPO_PREVIEW_SK_TIMEOUT)
def preview_transformed_module_xml(request, collection_id, version, variant, module_id):

    return platform_cache.internal_redirect(request, 'http://%s/content/%s/%s/%s/%s.xml' % (
        settings.BACKEND_ADDRESS['coding_server'], collection_id, version, variant, module_id))



def preview_other(request, path):
    warning('requested other in preview: "%s" by "%s"', path, request.META.get('HTTP_REFERER', '<unknown referer>'))
    raise Http404("other")



def bind_present_object_view(glob, view_name):

    repo_present = getattr(repo.views, view_name)
    editstore_present = getattr(editstore.views.bound_views, view_name)

    def present_object(request, identifier, version, *args, **kwargs):
        try:
            response = repo_present(request, identifier, version, *args, **kwargs)

            if response.status_code == 200:
                return response

        except RepositoryNotFound as e:
            pass

        if settings.EPO_ENABLE_EDITION:
            return editstore_present(request, identifier, version, *args, **kwargs)

        raise Http404('object not found')

    present_object.__name__ = view_name

    glob[view_name] = present_object


bind_present_object_view(globals(), 'present_collection_xml')

bind_present_object_view(globals(), 'present_module_xml')

bind_present_object_view(globals(), 'present_womi_file')


def legacy_present_womi_file(request, identifier, womi_path):
    return present_womi_file(request, identifier, '1', womi_path)
