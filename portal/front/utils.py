# -*- coding: utf-8 -*-

from common.models import Collection
from common.models import SchoolLevel
from common.models import Subject
import json
import requests
from django.conf import settings
from surround.django.utils import cache_result, CacheKey
from portal.settings.misc.utils import project_path_join
import time
from collections import OrderedDict
import re

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


def first_or_none(list_obj):
    return list_obj[0] if list_obj else None



def parse_solr_path(path):
    return path.split('/')


def remove_quotation_marks(str_obj):
    return str_obj.replace('"', '').replace("'", '')


STATISTICS_BASE_PARAMS = dict(
    module='API',
    format='JSON',
    token_auth=settings.TRACKER_API_TOKEN_AUTH,
    idSite=settings.TRACKER_STATISTICS,
)


def get_statistics_api(method, queries=None):
    params = STATISTICS_BASE_PARAMS.copy()
    params.update(dict(method=method))
    if queries is not None:
        params.update(queries)
    return json.loads(requests.get(settings.TRACKER_API_URL, params=params).text)


def compute_share_summary(group_field, groups, data, other):
    count = 0
    acc = dict()
    for k in groups.viewvalues():
        acc.update({k: 0})
    if other:
        acc.update({'other': 0})

    areres = isinstance(groups.keys()[0], re._pattern_type) 

    for d in data:
        # TODO: decide whether to use visits or visitors in browsers and devices shares
        #value = d['nb_uniq_visitors']
        value = d['nb_uniq_visitors']
        label = d[group_field]
        count = count + value
        if areres:
            found = False
            for group in groups:
                if group.search(label):
                    acc[groups[group]] += value
                    found = True
                    break
            if not found:
                acc['other'] += value
        else:
            if label in groups:
                acc[groups[label]] = value
            elif other:
                acc['other'] = acc['other'] + value

    result = dict()
    for k, v in acc.items():
        if count !=0 :
            result[k] = float(v) / count
        else:
            result[k] = 0

    return result


def standarize_percent(data):
    percent_sum = sum(data.values())
    if percent_sum == 0:
        percent_sum = 1

    return {k: v / percent_sum for k, v in data.items()}


def process_convert_percentage(data):
    result = {k: int(round(v * 100)) for k, v in standarize_percent(data).items()}
    if len(result) >= 2:
        lastkey = 'other' if 'other' in result else result.keys()[-1]
        result[lastkey] = 100 - (sum(result.values()) - result[lastkey])

    return {k: str(v) + '%' for k, v in result.items()}


def process_min_max(data):
    min_value = min(data.values())
    max_value = max(data.values())
    dist = max_value - min_value
    if dist == 0:
        dist = 1
    return {k : ((v - min_value) / dist) for k, v in data.items()}

# codes based on TERYT system: http://pl.wikipedia.org/wiki/TERYT
STATISTICS_REGIONS = {
    '72': '02', # Dolnoslaskie
    '73': '04', # Kujawsko-Pomorskie
    '74': '10', # Lodzkie
    '75': '06', # Lubelskie
    '76': '08', # Lubuskie
    '77': '12', # Malopolskie
    '78': '14', # Mazowieckie
    '79': '16', # Opolskie
    '80': '18', # Podkarpackie
    '81': '20', # Podlaskie
    '82': '22', # Pomorskie
    '83': '24', # Slaskie
    '84': '26', # Swietokrzyskie
    '85': '28', # Warminsko-Mazurskie
    '86': '30', # Wielkopolskie
    '87': '32', # Zachodniopomorskie
}

STATISTICS_REGIONS_LABELS = {
    '72': 'Dolnośląskie',
    '73': 'Kujawsko-Pomorskie',
    '74': 'Łódzkie',
    '75': 'Lubelskie',
    '76': 'Lubuskie',
    '77': 'Małopolskie',
    '78': 'Mazowieckie',
    '79': 'Opolskie',
    '80': 'Podkarpackie',
    '81': 'Podlaskie',
    '82': 'Pomorskie',
    '83': 'Śląskie',
    '84': 'Świętokrzyskie',
    '85': 'Warmińsko-Mazurskie',
    '86': 'Wielkopolskie',
    '87': 'Zachodniopomorskie',
}

STATISTICS_BROWSERS = {
    re.compile('Firefox|Iceweasel'): 'firefox',
    re.compile('Chrom(e|ium)'): 'chrome',
    re.compile('Internet Explorer|IE'): 'ie',
    re.compile('Safari'): 'safari',
    }

STATISTICS_DEVICES = {
    'Smartphone': 'mobile',
    'Desktop': 'desktop',
}

STATISTICS_FILE = project_path_join('tmp', 'statistics.json')


@cache_result(60 * 60, key=CacheKey('front.utils.get_statistics_data'))
def get_statistics_data():
    info('loading statistics file')
    with open(STATISTICS_FILE, 'r') as f:
        return json.load(f)


def forced_get_statistics_data():
    try:
        return get_statistics_data()
    except Exception as e:
        if not settings.SURROUND_RUNNING_ON_PLATFORM:
            raise Exception('file %s is missing, run "./manage.py regenerate_statistics" to create' % STATISTICS_FILE)
        error('failed to fetch statistics: %s', e)
        return {}


def regenerate_statistics_data():
    info('generating statistics')
    statistics = generate_statistics_data(settings.EPO_FRONT_STATISTICS_PERIOD)
    with open(STATISTICS_FILE, 'w') as f:
        json.dump(statistics, f, indent=4)
    info('statistics generated')


def generate_statistics_data(moment):
    domain_queries = dict()
    # domain_queries.update(period='range', date='2013-09-30,yesterday')
    if moment == 'all':
        domain_queries.update(period='range', date='2013-09-30,yesterday')
        # domain_queries.update(period='day', date='today')
    elif moment == 'day':
        domain_queries.update(period='day', date='today')
    elif moment == 'month':
        domain_queries.update(period='month', date='today')
    else:
        raise ValueError('invalid moment argument')

    visits = get_statistics_api('VisitsSummary.get', domain_queries)

    global_result = dict(
        visits=visits['nb_visits'],
        #visitors=visits['nb_uniq_visitors'],
        browser=process_convert_percentage(compute_share_summary('label', STATISTICS_BROWSERS, get_statistics_api('UserSettings.getBrowser', domain_queries), True)),
        device=process_convert_percentage(compute_share_summary('label', STATISTICS_DEVICES, get_statistics_api('UserSettings.getMobileVsDesktop', domain_queries), False)),
        label='Polska',
        regions={},
    )

    global_result.update(regionsMapping=process_min_max(compute_share_summary('region', STATISTICS_REGIONS, get_statistics_api('UserCountry.getRegion', domain_queries), False)))

    info('statistics: %s', global_result)

    regs = dict()

    for key in STATISTICS_REGIONS.keys():
        domain_queries.update(segment=("regionCode==" + str(key)))
        localVisits = get_statistics_api('VisitsSummary.get', domain_queries)
        region_result = dict(
            visits=localVisits['nb_visits'],
            label=STATISTICS_REGIONS_LABELS[key],
            #visitors=localVisits['nb_uniq_visitors'],
            browser=process_convert_percentage(compute_share_summary('label', STATISTICS_BROWSERS, get_statistics_api('UserSettings.getBrowser', domain_queries), True)),
            device=process_convert_percentage(compute_share_summary('label', STATISTICS_DEVICES, get_statistics_api('UserSettings.getMobileVsDesktop', domain_queries), False)),
        )
        regs[STATISTICS_REGIONS[key]] = region_result
        info('region statistics: %s', region_result)

    global_result.update(regions=regs)

    global_result['timestamp'] = time.strftime("%Y-%m-%d")

    str_result = json.dumps(global_result, indent=4)

    # print(str_result)

    return str_result

# EPP-6209 I know this looks strange
def hide_all_dummies():
    import front.signals
    for collection in common.models.Collection.objects.filter(md_published=True, variant='student-canon').all():
        front.signals.hide_dummy_collection('publication', collection.as_bare_driver())


def repair_microseconds_from_edition_timestamps():
    from common import models
    for model in (models.Collection, models.Module, models.Womi):
        for obj in model.objects.all():
            if obj.edition_timestamp is not None and obj.edition_timestamp.microsecond:
                info('fixing edition timestamp of %s', obj)
                obj.edition_timestamp = obj.edition_timestamp.replace(microsecond=0)
                obj.save()



def repair_bad_modules_titles():
    import common.models
    from repository import namespaces
    for collection in common.models.Collection.objects.all():

        for module in collection.get_all_modules():
            if module.md_title.endswith('.docx') or module.md_title.endswith('.doc'):
                try:
                    mx = collection.parsed_xml.find('.//' + namespaces.NS_COLXML('module') + "[@document='" + module.identifier + "']")
                    title = mx.find(namespaces.NS_MD('title')).text
                    info(u'fixing module %s:%s title "%s" to "%s"', module.identifier, module.version, module.md_title, title)
                    module.md_title = title
                    module.save()
                except Exception as e:
                    logger.exception('failed to fix module %s:%s title', module.identifier, module.version)

def repair_bad_edition_timestamps(dry=True):
    import common.models
    import django.utils.timezone

    current_timezone = django.utils.timezone.get_current_timezone()

    for model in (common.models.Collection, common.models.Module, common.models.Womi):
        for obj in model.objects.exclude(edition_timestamp=None):
            original_year = obj.edition_timestamp.year
            repaired_timestamp = current_timezone.localize(obj.edition_timestamp.replace(year=1900).astimezone(current_timezone).replace(year=original_year).replace(tzinfo=None))
            info('fixing timestamp of %s from %s to %s', obj, obj.edition_timestamp, repaired_timestamp)
            if not dry:
                obj.edition_timestamp = repaired_timestamp
                obj.save()


def reassign_dummy_collections():
    import common.models
    for collection in common.models.Collection.objects.all():
        if (collection.get_number_of_modules() == 1) and (next(collection.get_all_modules()).md_title == u'Treści w przygotowaniu...'):
            collection.ep_dummy = True
        else:
            collection.ep_dummy = False
        collection.save()
