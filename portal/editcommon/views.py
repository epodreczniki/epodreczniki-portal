from __future__ import absolute_import

from django.shortcuts import render
import json
from django.http.response import HttpResponse, JsonResponse
from . import objects, parsers
from copy import copy
from . import keys
from surround.django.platform_cache import edge_side_cache
from django.conf import settings
from surround.django.decorators import never_cache_headers
from surround.django.simple_cors.decorators import cors_headers
import functools
import surround.django.redis
import requests
from xml.etree import ElementTree
import common.models

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

def test(request):
    return render(request, 'editcommon/test_womi_dialog.html')


def reslister(request):
    return render(request, 'editcommon/test_reslister.html')


def locks(request):
    return render(request, 'editcommon/test_locks.html')


def search_descriptor(request, category, identifier, version):

    return HttpResponse(content=json.dumps(objects.drivers.bind(category, identifier, version).search_descriptor), content_type='application/json')


@edge_side_cache(key=(
    keys.views + 'state:c:{category}:i:{identifier}:v:{version}'),
    timeout=settings.EPO_EDITCOMMON_STANDARD_CACHE_TIME)
@never_cache_headers
def state_descriptor(request, category, identifier, version):
    driver = objects.drivers.bind(category, identifier, version, request.user)

    result = {}
    if driver is not None:
        next_driver = driver.bind_next_version_driver() if driver.is_repo_driver else None
        if next_driver is not None:
            next_driver = objects.drivers.convert(next_driver, lazy=False)

        result['that'] = driver.json_state
        result['next'] = None if next_driver is None else next_driver.json_state
    else:
        result['that'] = None
        result['next'] = None

    return JsonResponse(result)


@edge_side_cache(
    key=(keys.views + 'referables:c:{category}:i:{identifier}:v:{version}'),
    timeout=settings.EPO_PREVIEW_SOURCE_PARSED_CACHE_TIME)
@never_cache_headers
@cors_headers(profile='edition')
def referables_listing(request, category, identifier, version):

    if category != 'collection':
        raise NotImplementedError('referables_listing is not yet implemented for other categories than collection')

    collection = parsers.EditCommonParser.imported_collection(identifier, version)
    collection.prefetch_modules()

    refs = {'bookmarks':[], 'bibliographies':[], 'biographies':[], 'concepts':[], 'definitions':[], 'events':[], 'rules':[]}
    for module in collection.modules:
        module_bookmarks = []
        refs['bookmarks'].append({'identifier': module.identifier, 'md_title': module.md_title, 'bookmarks': module_bookmarks, 'generated_type': module.generated_type})
        for original_referable in module.referables:
            referable = copy(original_referable)
            referable['module_id'] = module.identifier
            if referable['kind'] == 'bookmark':
                module_bookmarks.append(referable)
            elif referable['kind'] == 'bibliography':
                refs['bibliographies'].append(referable)
            elif referable['kind'] == 'biography':
                refs['biographies'].append(referable)
            elif referable['kind'] == 'concept':
                refs['concepts'].append(referable)
            elif referable['kind'] == 'definition':
                refs['definitions'].append(referable)
            elif referable['kind'] == 'event':
                refs['events'].append(referable)
            elif referable['kind'] == 'rule':
                refs['rules'].append(referable)

    refs['bibliographies'] = sorted(refs['bibliographies'], key=lambda element: element['key'])
    refs['biographies'] = sorted(refs['biographies'], key=lambda element: element['key'])
    refs['concepts'] = sorted(refs['concepts'], key=lambda element: element['key'])
    refs['definitions'] = sorted(refs['definitions'], key=lambda element: element['key'])
    refs['events'] = sorted(refs['events'], key=lambda element: element['key'])
    refs['rules'] = sorted(refs['rules'], key=lambda element: element['key'])

    return render(request, 'editcommon/referables_collection.xml', { 'collection': collection, 'refs': refs }, content_type='application/xml')


def temporary_catcher(view):

    @functools.wraps(view)
    def wrapped(request, *args, **kwargs):
        try:
            return view(request, *args, **kwargs)
        except Exception as e:
            logger.exception('exception occurred: %s', e)
            raise

    return wrapped

@never_cache_headers
@temporary_catcher
def referred_womis_deep_listing(request, category, identifier, version):
    if category != 'collection':
        raise NotImplementedError('referred_womis_deep_listing is not yet implemented for other categories than collection')

    obj = parsers.EditCommonParser.imported_function(category)(identifier, version)
    return JsonResponse({ 'womis': [ { 'version': womi.version, 'identifier': str(womi.identifier) } for womi in obj.referred_womis_deep_overall ] })

# def skip_request(func):

#     def wrapped(request, *args, **kwargs):
#         return func(*args, **kwargs)

#     return wrapped

def remove_from(parent, tag):
    for child in parent.findall(tag):
        parent.remove(child)

def interlinks_service_helper(identifier):
    import editsearch.utils
    from repository.namespaces import NS_COLXML, NS_MD, NS_EP
    from repository.utils import CollectionXmlFileProvider
    try:
        latest_driver = editsearch.utils.find_latest_version_from_index(category='collection', identifier=identifier, only_sealed=False)
        if latest_driver is None:
            return None, None
        xml = CollectionXmlFileProvider.parsed('preview', identifier, latest_driver.version)
        metadata = xml.find(NS_COLXML('metadata'))
        remove_from(metadata, NS_MD('actors'))
        remove_from(metadata, NS_MD('roles'))
        remove_from(metadata.find(NS_EP('e-textbook')), NS_EP('learning-objectives'))
        display_name = ElementTree.Element('display-name')

        school = common.models.SchoolLevel.TYPES_MAP.get(metadata.findtext('.//' + NS_MD('education-level')), '?')
        ep_class = metadata.findtext('.//' + NS_EP('class'))
        if ep_class is not None:
            school += (' %s' % ep_class)
        subject = metadata.findtext('.//' + NS_MD('subject'))
        if subject is not None:
            subject = subject.title()

        display_name.text = '%s, %s, %s, %s' % (subject, school, identifier, metadata.findtext(NS_MD('title')))
        return metadata, display_name
    except Exception as e:
        error('failed to fetch metadata for %s: %s', identifier, e)
        return None, None

@edge_side_cache(
    key=(keys.views + 'interlinks_collections_service'),
    timeout=60 * 5)
@cors_headers(profile='edition')
def interlinks_service(request):
    import editsearch.utils
    from surround.django import coroutine
    from surround.django import execution

    identifiers = interlinks_collections_identifiers()

    parameters = execution.MultiParameters()
    for identifier in identifiers:
        parameters.bind(identifier, identifier=identifier)

    results = coroutine.execute_all(interlinks_service_helper, parameters)

    xml = ElementTree.Element('referenceable-collections')

    for identifier in identifiers:
        metadata, display_name = results[identifier]
        if metadata is None:
            continue
        collection_xml = ElementTree.SubElement(xml, 'collection')
        collection_xml.set('id', identifier)
        collection_xml.append(metadata)
        collection_xml.append(display_name)

    return HttpResponse(content=ElementTree.tostring(xml), content_type='application/xml')

@surround.django.redis.cache_result(timeout=(60), key=(keys.app + 'interlinks_collections_identifiers'))
def interlinks_collections_identifiers():
    try:
        collections = requests.get(settings.EPO_INTER_COLLECTIONS_FILE_URL, timeout=5)
        collections.raise_for_status()
        return [c['identifier'] for c in collections.json()['collections']]
    except Exception as e:
        error('failed to get mobile apps versions: %s', e)
        raise


@edge_side_cache(
    key=(keys.views + 'kzd_category_list'),
    timeout=60 * 5)
def kzd_category_list(request):
    from common.kzd import KZD_CATEGORIES as cats
    dto = [ key for key in cats ]
    return HttpResponse(content=json.dumps(dto), content_type='application/json')


