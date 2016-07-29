# coding=utf-8

import datetime
from django.utils import importlib
from requests import Response

import re
from common import models
from django.conf import settings
from django.db.models import Q
import django.utils.timezone
import requests
import surround.django.redis
from common import keys
from django.utils.timezone import make_aware, get_default_timezone
from common.exceptions import NiceException
from surround.django.utils import add_forward_error_header
import functools
from django.shortcuts import render

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())




def sub_collection_lookup(sub_collection):
    object_list = []
    collections = models.SubCollection.objects.filter(parent_collection__id=sub_collection.id).prefetch_related('module_orders')

    for collection in collections:
        object_list.append(u'%s: %s' % (collection.__class__.__name__, collection.md_title))
        object_list.append(sub_collection_lookup(collection))
    [object_list.append(u'%s: %s' % (c.__class__.__name__, c.module.md_title)) for c in sub_collection.module_orders.all()]
    return object_list




TOP_DOMAIN_MATCHER = re.compile(r'(\w+).' + settings.TOP_DOMAIN)


def get_subdomain(host):
    m = TOP_DOMAIN_MATCHER.match(host)
    return m.group(1) if m is not None else None


def solr_switcher():
    class SettingObject(object):
        def __unicode__(self):
            return self.SOLR_URL

        def __str__(self):
            return self.SOLR_URL

    if hasattr(settings, 'SOLR_HOST2'):
        hosts = [settings.SOLR_HOST, settings.SOLR_HOST2]
        now = datetime.datetime.now()
        if now.second % 10 in (0, 4):
            selected_host = hosts[0]
        else:
            selected_host = hosts[1]

        url = settings.SOLR_URL_PATTERN % (selected_host, settings.SOLR_PORT)
        setting = SettingObject
        setting.SOLR_URL = url
        setting.SOLR_MAIN_URL = setting.SOLR_URL + settings.SOLR_MAIN_PATTERN
        setting.SOLR_DS_URL = setting.SOLR_URL + settings.SOLR_DS_PATTERN
        setting.SOLR_AC_URL = setting.SOLR_URL + settings.SOLR_AC_PATTERN
        return setting
    else:
        setting = SettingObject
        setting.SOLR_URL = settings.SOLR_URL
        setting.SOLR_MAIN_URL = settings.SOLR_MAIN_URL
        setting.SOLR_DS_URL = settings.SOLR_DS_URL
        setting.SOLR_AC_URL = settings.SOLR_AC_URL
        return setting



IMAGE_FILE_EXTENSION_FILTER = re.compile(r'^png|jpg|jpeg|tiff|svg', re.IGNORECASE)


CONTENT_TYPE_EXTENSION_MAPPINGS = (
    (('tiff',), ('image/tiff',), False),
    (('png',), ('image/png',), False),
    (('svg',), ('image/svg+xml',), True),
    (('jpg', 'jpeg'), ('image/jpeg',), False),
    (('mp3',), ('audio/mpeg',), False),
    (('js',), ('application/javascript',), True),
    (('css',), ('text/css',), True),
    (('json',), ('application/json',), True),
    (('html', 'htm'), ('text/html',), True),
    (('pdf',), ('application/pdf',), False),
    (('zip',), ('application/zip',), False),
    (('xml',), ('application/xml',), False),
    (('gif',), ('image/gif',), False),
    (('rtf',), ('application/rtf',), False),
)

EXTENSION_TO_CONTENT_TYPE_FULL_MAPPINS = {ext: ((mimes[0] + '; charset=UTF-8') if utf else mimes[0]) for exts, mimes, utf in CONTENT_TYPE_EXTENSION_MAPPINGS for ext in exts }
CONTENT_TYPE_TO_EXTENSION_FULL_MAPPINS = {mime: exts[0] for exts, mimes, utf in CONTENT_TYPE_EXTENSION_MAPPINGS for mime in mimes }

MIME_REGEX = re.compile(r'^([\w\/\+]+);?.*')


def content_type_to_extension(content_type):
    mime = MIME_REGEX.match(content_type)
    if mime is None:
        return None
    return CONTENT_TYPE_TO_EXTENSION_FULL_MAPPINS.get(mime.group(1).lower(), None)


def extension_to_content_type(ext):
    if not ext:
        return None
    return EXTENSION_TO_CONTENT_TYPE_FULL_MAPPINS.get(ext.lower(), None)



def now():
    return django.utils.timezone.now()


def format_timestamp(moment):
    return moment.strftime('%Y-%m-%dT%H:%M:%S+%Z')


def repair_date(date_obj):
    if date_obj.tzinfo is not None:
        return date_obj
    else:
        return make_aware(date_obj, get_default_timezone())


def int_or_none(value):
    return int(value) if value else None


@surround.django.redis.cache_result(timeout=(60 * 60), key=(keys.app + 'mobile_apps_versions'))
def mobile_apps_versions():
    try:
        versions = requests.get(settings.EPO_MOBILE_VERSIONS_FILE_URL, timeout=5)
        versions.raise_for_status()
        return versions.json()
    except Exception as e:
        error('failed to get mobile apps versions: %s', e)
        return {
            "android": 7,
            "ios": "1.02",
            "win8": "1.0.1",
            "wp8": "1.0.2",
        }



def wrap_nice_exceptions(view):

    @functools.wraps(view)
    def wrapper(request, *args, **kwargs):
        try:
            return view(request, *args, **kwargs)
        except NiceException as e:
            error('returning status %s due to exception of type %s: "%s" occurred while handling: %s', e.status, type(e).__name__, e, request.get_full_path())
            response = render(request, e.template_name, {'exception': e}, status=e.status)
            add_forward_error_header(response)
            return response

    return wrapper


def epo_translate(app, dictionary_name, word):
    translations = importlib.import_module('%s.epo_translations' % app)
    if hasattr(translations, 'DICTIONARIES'):
        pass
    else:
        raise ImportError('module %s.epo_translations does not have DICTIONARIES attribute' % app)

    if dictionary_name not in translations.DICTIONARIES:
        return word

    dictionary = translations.DICTIONARIES[dictionary_name]
    unicode_word = u'%s' % word
    if unicode_word in dictionary['words']:
        return dictionary['words'][unicode_word]
    else:
        return word


