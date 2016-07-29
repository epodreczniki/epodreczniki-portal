from __future__ import absolute_import

from celery import shared_task
from common.models import Collection
from pprint import pformat
from django.conf import settings
import requests
import requests.exceptions
from common import url_providers, utils
import logging

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


query_logger = None
solr_logger = None
request_logger = None

def setupSearchModuleLogger(glob):
    query_logger_path = 'search.%s' % 'query'
    request_logger_path = 'search.%s' % 'request'
    solr_logger_path = 'search.%s' % 'solr'
    level = 'info'
    glob['search_query_logger'] = getattr(logging.getLogger(query_logger_path),level)
    glob['search_solr_logger'] = getattr(logging.getLogger(solr_logger_path),level)
    glob['search_request_logger'] = getattr(logging.getLogger(request_logger_path),level)

setupSearchModuleLogger(globals())


#Logging user queries metrics
@shared_task(ignore_result=True, queue='indexer')
def register_user_query(user_query):
    if search_query_logger:
        search_query_logger('User query: {%s}', user_query)


@shared_task(ignore_result=True, queue='indexer')
def register_solr_metric(solr_metric):
    if search_solr_logger:
        search_solr_logger('User query: {%s}', solr_metric)


@shared_task(ignore_result=True, queue='indexer')
def register_client_metric(client_metric):
    if search_request_logger:
        search_request_logger('User query: {%s}', client_metric)


@shared_task(ignore_result=True, queue='indexer')
def register_user_dynamic_query(user_query):
    if search_query_logger:
        search_query_logger('Dynamic query: {%s}', user_query)


#Indexing and reindexing
@shared_task(ignore_result=True, queue='indexer')
def index_collection(collection_id, version, variant=None):
    info('attempting to index collection %s/%s/%s' % (collection_id, version, variant))

    if variant:
        collections = Collection.objects.filter(md_content_id=collection_id, md_version=version, variant__startswith=variant).all()
    else:
        collections = Collection.objects.filter(md_content_id=collection_id, md_version=version).all()

    results = []
    for collection in collections:
        if not collection.has_any_inside():
            info('collection not indexed due to emptyness')
            return
        if not settings.EPO_USE_SOLR_INDEXER:
            info('collection not indexed due to EPO_USE_SOLR_INDEXER setting')
            return

        collection_url = url_providers.get_collection_variant_xml_url('content', collection.md_content_id, collection.md_version, collection.variant)

        payload = {'colURL': collection_url}
        info('indexing %s with SOLR at %s', collection_url, settings.SOLR_INDEXER_URL)
        try:
            r = requests.put(settings.SOLR_INDEXER_URL, params=payload, timeout=600)
            r.raise_for_status()
            result = r.json()
            ok_responses_count = len([entry for entry in result if (entry['response'] != None) and (entry['response']['status'] == 0)])
            notok_responses = [entry for entry in result if (entry['response'] == None) or (not entry["response"]["status"] == 0)]

            info('indexation done for: %s elements', ok_responses_count)
            for notok in notok_responses:
                error('failed perform index: %s', pformat(notok, indent=2))
        except requests.exceptions.HTTPError as e:
            error('failed to index: %s, %s', e, e.response.text)
            result = {'indexation failured': e}
        except requests.exceptions.RequestException as e:
            error('failed to index: %s', e)
            result = {'indexation failured': e}
        results.extend(result)


def get_indexed_collections_ids():
    try:
        r = requests.get("%sselect?q=type:collection-index-item&fl=id&wt=json&rows=1000000" % settings.SOLR_MAIN_URL, timeout=30)
        r.raise_for_status()
        return [x['id'] for x in r.json()['response']['docs']]
    except requests.exceptions.HTTPError as e:
        error('failed to fetch indexed collections: %s, %s', e, e.response.text)
        raise
    except requests.exceptions.RequestException as e:
        error('failed to fetch indexed collections: %s', e)
        raise


@shared_task(ignore_result=True, queue='indexer')
def index_all_collections(remove_all=False):
    import common.models
    info("indexing all collections into solr")
    collections_ids = [map(unicode, [c.identifier, c.version, c.variant]) for c in common.models.Collection.objects.leading().published().all_latest()]
    collections_ids_no_lev = [map(unicode, [c[0], c[1], c[2].split('-',1)[0]]) for c in collections_ids]

    try:
        if remove_all:
#remove all indices
            remove_all()
        else:
#fetch collections that are indexed
            collections_indexed = get_indexed_collections_ids()
            collections_ids_s = [u"/".join(c) for c in collections_ids_no_lev]

#remove the one that are old
            remove_ids = set(collections_indexed) - set(collections_ids_s)
            for remove_id in remove_ids:
                info("Removing %s from solr index", remove_id)
                payload = "<delete><query>collectionid:%s</query></delete>" % remove_id
                for url in [settings.SOLR_MAIN_URL, settings.SOLR_DS_URL, settings.SOLR_AC_URL]:
                    #url += "update?commit=true"
                    #debug('POSTing to URL: %s, data: "%s"', url, payload)
                    #requests.post(url, data=payload, timeout=30).raise_for_status()
                    url = "%supdate?stream.body=%s&commit=true" % (url, payload)
                    debug('GETting URL: %s', url)
                    requests.get(url, timeout=30).raise_for_status()

    except requests.exceptions.HTTPError as e:
        error('failed to delete indexed collections: %s, %s', e, e.response.text)
        raise
    except requests.exceptions.RequestException as e:
        error('failed delete indexed collections: %s', e)
        raise

#index all collections
    noc = len(collections_ids)
    for c in collections_ids:
        noc -= 1
        info("updating solr index for %s/%s/%s (%d left)", c[0], c[1], c[2], noc)
        index_collection(c[0], c[1], c[2])


@shared_task(ignore_result=True, queue='indexer')
def remove_unpublished_collections():
    import common.models
    info("removing unpublished collections from solr index")
    collections_ids = [map(unicode, [c.identifier, c.version, c.variant.split('-',1)[0]]) for c in common.models.Collection.objects.leading().published().all_latest()]

    try:
#fetch collections that are indexed
        collections_indexed = get_indexed_collections_ids()
        collections_ids_s = [u"/".join(c) for c in collections_ids]

#remove the one that are old
        remove_ids = set(collections_indexed) - set(collections_ids_s)
        for remove_id in remove_ids:
            info("Removing %s from solr index", remove_id)
            payload = "<delete><query>collectionid:%s</query></delete>" % remove_id
            for url in [settings.SOLR_MAIN_URL, settings.SOLR_DS_URL, settings.SOLR_AC_URL]:
                #url += "update?commit=true"
                #debug('POSTing to URL: %s, data: "%s"', url, payload)
                #requests.post(url, data=payload, timeout=30).raise_for_status()
                url = "%supdate?stream.body=%s&commit=true" % (url, payload)
                debug('GETting URL: %s', url)
                requests.get(url, timeout=30).raise_for_status()

    except requests.exceptions.HTTPError as e:
        error('failed to delete indexed collections: %s, %s', e, e.response.text)
        raise
    except requests.exceptions.RequestException as e:
        error('failed delete indexed collections: %s', e)
        raise


@shared_task(ignore_result=True, queue='indexer')
def reindex_all(remove=False):
    import common.models
    info("refreshing index for all collections in solr")
    collections_ids = [map(unicode, [c.identifier, c.version, c.variant, c.variant.split('-',1)[0]]) for c in common.models.Collection.objects.leading().published().all_latest()]

#index all collections
    noc = len(collections_ids)
    for c in collections_ids:
        noc -= 1
        info("updating solr index for %s/%s/%s (%d left)", c[0], c[1], c[2], noc)
        if remove:
            remove_collection(c[0], c[1], c[3])
        index_collection(c[0], c[1], c[2])


@shared_task(ignore_result=True, queue='indexer')
def remove_collection(identifier, version, variant):
    info("remove collection %s/%s/%s from solr" % (identifier, version, variant))
    #collections_ids = [u"/".join(c) for c in collections_to_remove]
    collection_id = "%s/%s/%s" % (identifier, version, variant.split('-',1)[0])

    try:
        #info("Removing %s from solr index", collection_id)
        payload = "<delete><query>collectionid:%s</query></delete>" % collection_id
        for url in [settings.SOLR_MAIN_URL, settings.SOLR_DS_URL, settings.SOLR_AC_URL]:
            #url += "update?commit=true"
            #debug('POSTing to URL: %s, data: "%s"', url, payload)
            #requests.post(url, data=payload, timeout=30).raise_for_status()
            url = "%supdate?stream.body=%s&commit=true" % (url, payload)
            debug('GETting URL: %s', url)
            requests.get(url, timeout=30).raise_for_status()

    except requests.exceptions.HTTPError as e:
        error('failed to delete indexed collection: %s, %s', e, e.response.text)
        raise
    except requests.exceptions.RequestException as e:
        error('failed delete indexed collection: %s', e)
        raise


@shared_task(ignore_result=True, queue='indexer')
def remove_all():
    info("remove ALL collections from solr")

    try:
        payload = "<delete><query>*:*</query></delete>"
        for url in [settings.SOLR_MAIN_URL, settings.SOLR_DS_URL, settings.SOLR_AC_URL]:
            #url += "update?commit=true"
            #requests.post(url, data=payload, timeout=30).raise_for_status()
            url = "%supdate?stream.body=%s&commit=true" % (url, payload)
            debug('GETting URL: %s', url)
            requests.get(url, timeout=30).raise_for_status()

    except requests.exceptions.HTTPError as e:
        error('failed to delete indexed collections: %s, %s', e, e.response.text)
        raise
    except requests.exceptions.RequestException as e:
        error('failed delete indexed collections: %s', e)
        raise
