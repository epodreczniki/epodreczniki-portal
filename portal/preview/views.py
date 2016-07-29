# coding=utf-8
from __future__ import absolute_import

from django.http import Http404
from django.conf import settings
from django.http.response import HttpResponse
from surround.django.decorators import improved_cache_page
from django.shortcuts import render, redirect
from surround.django import platform_cache
from preview import utils
from preview import volatile_models
from repository.utils import ModuleXmlUnavailable, XmlUnavailable, VariantUnavailable, EmptyVariantsList, WomiJsonUnavailable, JsonUnavailable
from repository.utils import ImportFailure
import functools
from common.utils import format_timestamp, now, mobile_apps_versions
from surround.django.basic.templatetags.common_ext import make_schemeless
from . import presentations
from common.model_mixins import SOURCE_VARIANT
import reader.views
from common.utils import wrap_nice_exceptions
from django.http import JsonResponse
from . import keys
from surround.django.utils import add_forward_error_header

from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())


def error_response(request, template_name, context, timeout=5, status=404):
    response = render(request, template_name, context, status=status)
    platform_cache.pass_forced_ttl_timeout(response, timeout)
    add_forward_error_header(response)
    return response


def catch_import_failures(view_func):

    @functools.wraps(view_func)
    def wrapper(request, *args, **kwargs):

        try:
            return view_func(request, *args, **kwargs)
        except ImportFailure as e:
            logger.exception('caught import failure in view %s', request.path)
            return error_response(request, 'collection_import_failure.html', context=kwargs, status=503)

    return wrapper

def preview_redirect_old(request, collection_id, version, variant, module_id):
    return redirect(preview, collection_id, version, variant, module_id)

def extract_variant(variant, *args, **kwargs):
    return variant, args, kwargs


def monitor_error_response(request, monitor, template_name, context={}, timeout=5, status=404):
    awaited, notifications = monitor.mark_failure()

    ctx = {
        'minutes_awaited': (int(awaited.total_seconds()) / 60),
        'notifications': notifications,
    }
    ctx.update(context)

    return error_response(request, template_name, ctx, timeout=timeout, status=status)


def mobile_descriptor(request, identifier, version):
    from repository.utils import MetadataXml

    metadata_xml = MetadataXml('preview', identifier, version)

    monitor = utils.CollectionXMLReferenceMonitor(identifier, version)

    if metadata_xml.mobile_variant is None:
        raise Http404()

    collection = utils.prefetch_collection(identifier, version, metadata_xml.mobile_variant, modules=False)

    last = format_timestamp(now())

    ready = False
    formats = collection.get_static_formats_for_category('mobile')
    for f in formats:
        if f.uncompressed_size != None:
            ready = True

    if not ready:
        monitor.mark_failure()

    descriptor = {
        'md_content_id': identifier,
        'md_version': version,
        'md_title': collection.md_title,
        'state': {
            'comment': 'Hello',
            'ready': ready,
            'lastmodified': last,
            'lasttransformed': last,
        },
        'formats': [{
            'url': make_schemeless(f.get_absolute_url()),
            'format': f.specification.public_name,
            'size': f.uncompressed_size if f.uncompressed_size is not None else (-1)
        } for f in formats],
    }

    for app, ver in mobile_apps_versions().items():
        descriptor['app_version_%s' % app] = ver


    return JsonResponse(descriptor)


class ReaderViews(reader.views.ReaderViews):

    name = 'preview'
    config = volatile_models.Config
    use_womi_version = True
    presentations = presentations
    womi_timeout = min(settings.EPO_PREVIEW_SOURCE_PARSED_CACHE_TIME, settings.EPO_PREVIEW_PAGES_CACHE_TIME)
    collection_reader_timeout = min(settings.EPO_PREVIEW_HTML_CACHE_TIME, settings.EPO_PREVIEW_SOURCE_PARSED_CACHE_TIME, settings.EPO_PREVIEW_PAGES_CACHE_TIME)
    collection_details_template = 'preview_details.html'
    reader_template = 'preview.html'
    keys = keys
    support_contact = False

    def cache_view(self, key, timeout):

        def wrapper(view):
            return improved_cache_page(key=key, timeout=timeout, never_public=True)(view)

        return wrapper


    def wrap_collection_reader(self, not_ready_template, prefetch_modules=True, variant=None, pass_module=False):

        def wrapper(view):

            if pass_module:
                def wrapped_internal(request, collection_id, version, variant, module_id, *args, **kwargs):
                    module_presentation = self.presentations.bind_module_occurrence_or_404(collection_id, version, variant, module_id, prefetch_modules=prefetch_modules)
                    response = view(request, module_presentation, *args, **kwargs)
                    utils.CollectionXMLReferenceMonitor(module_presentation.collection_presentation.identifier, module_presentation.collection_presentation.version).mark_success()
                    return response
            else:
                def wrapped_internal(request, collection_id, version, variant, *args, **kwargs):
                    presentation = self.presentations.bind_collection_or_404(collection_id, version, variant, prefetch_modules=prefetch_modules)
                    response = view(request, presentation, *args, **kwargs)
                    utils.CollectionXMLReferenceMonitor(presentation.identifier, presentation.version).mark_success()
                    return response

            wrapped_internal = functools.wraps(view)(wrapped_internal)

            @functools.wraps(wrapped_internal)
            def wrapped(request, collection_id, version, variant, *args, **kwargs):


                try:
                    response = wrapped_internal(request, collection_id, version, variant, *args, **kwargs)
                    return response

                except (XmlUnavailable, EmptyVariantsList, JsonUnavailable) as e:

                    try:
                        collection_presentation = presentations.bind_collection_or_404(collection_id, version, variant=SOURCE_VARIANT, prefetch_modules=prefetch_modules)
                        collection = collection_presentation.collection

                        if not collection.modules:
                            return error_response(request, 'collection_is_empty.html', status=404, context={
                                'collection': collection,
                            })

                        context = {
                            'presentation': collection_presentation,
                            'collection': collection,
                        }

                        fixed_version, _ = self.presentations.PreviewCollectionPresentationDriver.translate_version(collection_id, version)
                        monitor = utils.CollectionXMLReferenceMonitor(collection_id, str(fixed_version))
                        return monitor_error_response(request, monitor, not_ready_template, status=200, context=context)

                    except WomiJsonUnavailable as e:
                        return error_response(request, 'collection_womi_does_not_exist.html', status=404, context={
                            'collection_id': collection_id,
                            'version': version,
                        })
                    except ModuleXmlUnavailable as e:
                        return error_response(request, 'collection_module_does_not_exist.html', status=404, context={
                            'collection_id': collection_id,
                            'version': version,
                        })
                    except XmlUnavailable as e:
                        return error_response(request, 'collection_does_not_exist_in_repository.html', status=404, context={
                            'collection_id': collection_id,
                            'version': version,
                        })
                    except VariantUnavailable as e:
                        return error_response(request, 'variant_does_not_exist.html', status=404, context={
                            'collection_id': collection_id,
                            'variant': '?',
                        })



            return wrap_nice_exceptions(catch_import_failures(wrapped))

        return wrapper


bound_views = ReaderViews()
