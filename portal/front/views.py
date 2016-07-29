# -*- coding: utf-8 -*-
from __future__ import absolute_import

import json
import time
from common.kzd import KZD_CATEGORIES
from common.models_cache import all_subjects
from common.endpoint import endpoint_string_pattern
from common.utils import solr_switcher
from common.views import ClassBasedView
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from common.models import Collection
from common import models
from django.utils.functional import cached_property
from front.utils import parse_solr_path
from front.utils import remove_quotation_marks
from front.utils import first_or_none
from front.utils import forced_get_statistics_data
from django.conf import settings
from preview import volatile_models
from sunburnt import SolrInterface, SolrError
from portal.patches.sunburnt_patch import *
from .decorators import front_cache_page
from django.views.decorators.cache import never_cache
from front.templatetags.collection_cover import cover_thumb_url, get_collection_cover_url
from front.models import AdminMessage
from collections import defaultdict
from search.tasks import register_user_query, register_user_dynamic_query, register_solr_metric, register_client_metric
from search.utils import RequestMetric, SolrMetric, QueryMetric
from common import models, url_providers
from common.todo import HARDCODED_WOMI_VERSION_ONE
from common import presentations
from django.http import Http404
from django.db.models import Q
from common import presentations
from surround.django import execution
from . import keys
from surround.django.basic.templatetags.common_ext import host_url
from surround.django.decorators import improved_cache_page

from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())

use_patch()

PAGINATION_ROWS = 10
PAGES_OFFSET = 5


class EducationLevel(object):
    def __init__(self, id, name):
        self.id = id
        self.name = name


EDUCATION_LEVELS = {k: EducationLevel(k, models.SchoolLevel.TYPES_MAP[v]) for k, v in
                    models.SchoolLevel.REVERSE_CODE_MAPPINGS.items()}


#profile may need more pages - like KZD, but for now there will be only one view
@front_cache_page()
def profile(request):
    return render(request, 'new_templates/profile_base.html',{'subjects': all_subjects(), 'education_levels' : EDUCATION_LEVELS.values(),
                                                              'reader_url_pattern': endpoint_string_pattern('reader_module_reader', True)})


@improved_cache_page(timeout=settings.DEFAULT_CACHE_TIME, key=keys.platform + 'e:{education_level}:l:{level}:s:{subject}')
def new_index(request, education_level, level=None, subject=None):
    collections = []

    chosen_education_level = int(education_level)
    # this redirect is ugly - I know
    if chosen_education_level == 0:
        return redirect(host_url('www', 'wagtail_serve', ''))

    # chosen_subject = None if subject == "None" else subject
    # chosen_level = None if (level is None or level == "None") else int(level)

    chosen_subject = subject
    chosen_level = None if level is None else int(level)

    all_levels = list(models.SchoolLevel.objects.filter(
        md_education_level=models.SchoolLevel.REVERSE_CODE_MAPPINGS[chosen_education_level]))
    levels_with_ep_class = []
    level_without_ep_class = None
    for level in all_levels:
        if level.ep_class is not None:
            levels_with_ep_class.append(level)
        else:
            level_without_ep_class = level


    theme = chosen_education_level

    if chosen_education_level:
        active_education_level = EDUCATION_LEVELS[chosen_education_level]
    else:
        active_education_level = None

    if chosen_subject:
        active_subject = get_object_or_404(models.Subject, id=chosen_subject)
    else:
        active_subject = None

    if chosen_level is not None:
        for l in levels_with_ep_class:
            if chosen_level == l.ep_class:
                active_level = l
                break
        else:
            raise Http404()

        filter_levels = [active_level, level_without_ep_class]
    else:
        active_level = None
        filter_levels = all_levels

    context = {
        # TODO: optimize here

        'education_levels': EDUCATION_LEVELS.values(),
        'chosen_education_level': chosen_education_level,
        'active_education_level': active_education_level,

        'levels': levels_with_ep_class,
        'chosen_level': chosen_level,
        'active_level': active_level,

        'subjects': models.Subject.objects.all(),
        'chosen_subject': chosen_subject,
        'active_subject': active_subject,

        'admin_messages': AdminMessage.objects.filter(shown=True),
        'theme': theme,
    }

    if active_education_level.id > 1:
        collections = Collection.objects.leading().published()

        collections = collections.filter(md_school__in=filter_levels)
        if active_subject is not None:
            collections = collections.filter(md_subject=active_subject)

        collections = collections.order_by('md_subject', 'md_school', 'volume')


        context['collection_presentations'] = [
            presentations.CollectionPresentationDriver.bind_from_object(collection,
                                                       version_mode=presentations.LATEST_VERSION_MODE) for collection in
            collections.all_latest(refetch=True)]


    else:
        context.update(front123_context())

    response = render(request, 'front/new_index.html', context)

    return response



def aggregate_statistics(collection):
    from common import models
    from django.db.models import Count


    statistics = defaultdict(lambda: 0)
    if collection is None:
        statistics['collection'] = len(models.Collection.objects.leading().published().official().first_volumes().all_latest())

        collections_for_scan = models.Collection.objects.leading().published().official().all_latest()
        collections_ids = [c.id for c in collections_for_scan]

        statistics['module'] = models.Module.objects.filter(
            module_order__sub_collection__collection_variant__id__in=collections_ids).distinct().count()

        module_occurrences = models.ModuleOccurrence.objects.filter(
            sub_collection__collection_variant__id__in=collections_ids)
    else:
        statistics['collection'] = 1
        collections_for_scan = [collection]
        statistics['module'] = models.Module.objects.filter(
            module_order__sub_collection__collection_variant=collection).distinct().count()

        module_occurrences = models.ModuleOccurrence.objects.filter(sub_collection__collection_variant=collection)


    module_occurrence_ids = module_occurrences.values_list('id', flat=True)

    for womi_type in models.WomiType.objects.all():
        statistics[womi_type.name] = models.Womi.objects.filter(
            womi_type=womi_type,
            using_womi_references__referrer_id__in=module_occurrence_ids,
            using_womi_references__referrer_type=models.ContentType.objects.get_for_model(models.ModuleOccurrence)
        ).distinct().count()


    if collection is None:
        if settings.EPO_ENABLE_EDITSEARCH:
            import editsearch.utils

            statistics['kzd'] = editsearch.utils.get_index_driver().objects.filter(category='womi',
                                                                                   purpose='kzd').count()
        else:
            statistics['kzd'] = 0

    return statistics


@front_cache_page()
def statistics(request):

    return render(request, 'front/statistics.html', {
        'statistics': aggregate_statistics(None),
        'statistics_api': forced_get_statistics_data(),
        'show_tracking_statistics': settings.EPO_SHOW_TRACKING_STATISTICS
    })


@front_cache_page()
def terms(request):
    return render(request, 'front/terms.html')


@front_cache_page()
def about(request):
    return render(request, 'front/about.html')


@front_cache_page()
def support(request):
    return render(request, 'front/mobile_support.html')


@front_cache_page()
def privacy(request):
    return render(request, 'front/mobile_privacy.html')


def front123_context():
    from surround.django.basic.templatetags.common_ext import make_schemeless

    def cmp_school_level(x, y):
        if x['collection'].md_school is not None and y['collection'].md_school is not None:
            return cmp(x['collection'].md_school.ep_class, y['collection'].md_school.ep_class)
        return -1

    jsonn = []
    collections = Collection.objects.filter(ep_environment_type='ee', md_published=True)
    volumized_collections = dict()
    for collection in collections:
        c = {
            'collection': collection,
            'md_title': collection.md_title,
            'subcollections': [],
            'icon_url': get_collection_cover_url(collection, True),
        }
        if collection.volume is not None:
            key = '%s_%s' % (collection.md_school, collection.md_subject)
            if key in volumized_collections:
                c = volumized_collections[key]
            else:
                volumized_collections[key] = c
                jsonn.append(c)
        else:
            jsonn.append(c)
        for sub in collection.root_collection.subcollections.order_by('order_value'):
            icon_id = sub.get_attribute_value('icon-womi-id')
            icon_url = make_schemeless(
                url_providers.get_womi_file_url(models.Config.SUBDOMAIN, icon_id, HARDCODED_WOMI_VERSION_ONE,
                                                'icon.svg')) if icon_id is not None else None
            s = {
                'md_title': sub.md_title,
                'url': make_schemeless(sub.get_absolute_url()),
                'is-empty': str(sub.is_empty),
                'icon_url': icon_url,
                'volume': collection.volume,
                'parent_collection': collection
            }
            c['subcollections'].append(s)
            if collection.volume is not None:
                c['subcollections'] = sorted(c['subcollections'], cmp=lambda x, y: cmp(x['volume'], y['volume']))

    return {
        'collections': sorted(jsonn, cmp=cmp_school_level),
        'front_movie_id': (settings.EPO_FRONT_123_FRONT_MOVIE_ID if len(collections) > 0 else None ),
        'front_movie_view': (
        '%s_womi_embed' % ('reader' if settings.EPO_FRONT_123_MOVIE_SUBDOMAIN == 'content' else 'preview')),
    }

#@front_cache_page()
#def one2three(request):
#    return render(request, 'front/123.html', front123_context())


class KzdViews(ClassBasedView):
    name = 'front'
    config = volatile_models.Config
    default_timeout = settings.DEFAULT_CACHE_TIME
    index_template = 'new_templates/kzd_index.html'
    welcome_template = 'new_templates/kzd_welcome.html'

    def get_index_driver(self):
        import editsearch.utils
        return editsearch.utils.get_index_driver()


    def index_query_base(self):
        index_driver = self.get_index_driver()
        return index_driver.objects.filter(category='womi', purpose='kzd')

    def filter_womis(self, category):
        import preview.parsers

        query = self.index_query_base().values('identifier', 'version')

        if category is not None:
            query = query.filter(extended_category=category)

        womis = [preview.parsers.PreviewContentParser.reference_imported_womi(womi_result['identifier'], womi_result['version']) for womi_result in query.all()]
        womis = execution.multi_lazy_resolve(womis, final_throw_if_any=False, accumulate_successes=True)

        return womis


    @cached_property
    def kzd_index(self):

        @self.cache_view(key=('kzd_index'), timeout=self.default_timeout)
        def view(request):
            return render(request, self.index_template, {
                'config': self.config,
                'kzd_womis': self.filter_womis(request.GET.get('category', None)),
                'show_view': '%s_%s' % (self.config.VIEWS_BASE_NAME, 'womi_embed')  #temporary embed
            })

        return view

    @property
    def stats(self):
        return {"categories": {category: {'count': self.index_query_base().filter(extended_category=category).count()}
                               for category in KZD_CATEGORIES.keys()}}

    @cached_property
    def kzd_welcome(self):

        @self.cache_view(key=('kzd_welcome'), timeout=self.default_timeout)
        def view(request):
            #sorted_categories = self.kzd_sorted_categories
            return render(request, self.welcome_template, {

                'show_view': '%s_%s' % (self.config.VIEWS_BASE_NAME, 'womi_embed'), #temporary embed
                'sorted_categories': self.sorted_categories,
                'all_items_count': sum(map(lambda x: x['count'], self.sorted_categories)),
                'edit_pattern': endpoint_string_pattern('edit_resource')
            })

        return view

    @cached_property
    def www_urlpattens(self):
        from django.conf.urls import patterns, url, include

        kzd_views = patterns('', url(r'^index$', self.kzd_index, name='kzd_index')
                             , url(r'^main$', self.kzd_welcome, name="kzd_main"))  #url to be changed

        return patterns('', url(r'^kzd/', include(kzd_views)))

    @cached_property
    def reversed_categories(self):
        return {category.css_class: category.key for category in KZD_CATEGORIES.itervalues()}

    @property
    def sorted_categories(self):
        stats = self.stats

        result = {category.key: {
            'count': stats['categories'][category.key]['count'],
            'category_name': category.key,
            'category_label': category.label,
            'category_class': category.css_class
        } for category in KZD_CATEGORIES.itervalues()}

        return sorted(result.values(), key=lambda it: it['count'], reverse=True)


kzd_views = KzdViews()
