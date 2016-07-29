import time

from common.utils import solr_switcher
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.shortcuts import render
from decorators import search_cache_page
from front.utils import remove_quotation_marks
from django.conf import settings
from sunburnt import SolrInterface, SolrError
from portal.patches.sunburnt_patch import *
from decorators import search_cache_page
from search.tasks import register_user_query, register_solr_metric, register_client_metric
from search.utils import RequestMetric, SolrMetric, QueryMetric
from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())

use_patch()

PAGINATION_ROWS = 10
PAGES_OFFSET = 5


#for now - just need to display it
@search_cache_page()
def search_tiles(request, collection_id=None, version=None, variant=None):
    results = None
    solr_metric = None
    subset_query = None
    query = None
    ed_class = None
    ed_level = None

    if request.GET:
        #if 'level' in request.GET:
        ed_level = request.GET.get('level')
        #if 'class' in request.GET:
        ed_class = request.GET.get('class')
        if 'q' in request.GET:
            query = remove_quotation_marks(request.GET.get('q'))
        if query:
            subset = ''
            if collection_id:
                subset = str(collection_id) + '/' + str(version) + '/' + str(variant).split('-')[0]
            page = request.GET.get('p')
            start_time = time.clock()

            setting = solr_switcher()

            if subset and not (ed_level and ed_class):
                subset_query = "%s*" % subset

            query_metric = QueryMetric(request)
            register_user_query(query_metric)
            request_metric = RequestMetric(request, query_hash=query_metric.get_md5())
            register_client_metric(request_metric)
            solr_metric = SolrMetric(request_hash=request_metric.get_md5(), query_hash=query_metric.get_md5())

            try:
                solr_interface = SolrInterface(setting.SOLR_MAIN_URL)
                solr_interface.conn.request_handler_name('search')
                results = solr_interface.query(solr_interface.Q('"' + query + '"'))
                if subset_query:
                    results = results.filter(collectionid=subset_query)
                if ed_level:
                    results = results.filter(collection_school_type_code=ed_level)
                if ed_class:
                    results = results.filter(collection_ep_class=ed_class)

                results = results.filter(published=True)
            except SolrError:
                solr_metric.solr_error = SolrError

        if results is not None:
            pages = Paginator(results, PAGINATION_ROWS)

            try:
                results = pages.page(page)
            except PageNotAnInteger:
                results = pages.page(1)
            except EmptyPage:
                results = pages.page(pages.num_pages)
            results.num_pages = pages.num_pages
            results.total_count = pages._count
            results.processing_time = time.clock() - start_time
            if solr_metric:
                if results.number < pages.num_pages:
                    solr_metric.next_page = results.number + 1
                solr_metric.num_pages = pages.num_pages
                if results.number > 1:
                    solr_metric.prev_page = results.number - 1
                solr_metric.page = results.number
                solr_metric.total_count = pages._count
                solr_metric.processing_time = results.processing_time
            # get post and pre pages
            max_count = pages.num_pages if pages.num_pages < results.number + PAGES_OFFSET else results.number + PAGES_OFFSET
            results.post_pages = range(results.number + 1, max_count + 1)
            results.pre_pages = [x for x in range(results.number - PAGES_OFFSET, results.number) if x > 0]

            if solr_metric:
                solr_metric.request_time = time.clock() - start_time
                register_solr_metric(solr_metric)
    else:
        results = None

    return render(request, 'search_tiles.html', {'results': results,
                                                 'solr_metric': solr_metric,
                                                 'query': query,
                                                 'collection_id': collection_id,
                                                 'variant': variant,
                                                 'version': version,
                                                 'level': ed_level,
                                                 'class': ed_class,
                                                 'chosen_education_level': ed_level,
                                                 'chosen_level': ed_class})

