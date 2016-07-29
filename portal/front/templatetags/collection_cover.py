from common.url_providers import get_womi_file_url
from common.utils import content_type_to_extension
from django import template
from django.conf import settings
from urlparse import urljoin
from collections import OrderedDict
from common import models
from django.template.loader import render_to_string
from surround.django.basic.templatetags.common_ext import make_schemeless

register = template.Library()

from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())


def get_collection_cover_url(collection, thumb=False):
    womi = collection.cover_womi
    if womi is not None:
        return womi.get_image_url('classic', resolution=('120' if thumb else '480'))
    else:
        return None


def repair_collection_cover_url(url=None):
    return url if url is not None else settings.STATIC_URL + 'front/img/no-cover.svg'


@register.filter
def cover_url(collection):
    return make_schemeless(repair_collection_cover_url(get_collection_cover_url(collection, thumb=False)))


@register.filter
def cover_thumb_url(collection):
    return make_schemeless(repair_collection_cover_url(get_collection_cover_url(collection, thumb=True)))


@register.filter
def find_format_categories(collection):
    categories = OrderedDict([(c, None) for c in models.CollectionStaticFormat.CATEGORIES])
    found = False
    for f in collection.get_static_formats_for_interface():
        if f.specification.category is not None:
            found = True
            categories[f.specification.category] = f

    return found, categories.items()


@register.filter
def find_static_format(collection, format):
    formats = collection.get_static_formats_for_category(format)
    try:
        return formats[0]
    except IndexError:
        return None


@register.simple_tag
def collection_header(womi):
    if womi:
        return render_to_string('front/includes/collection_header.html',
                                {'url': make_schemeless(womi.get_image_url('classic', resolution=None))})
    else:
        return ''
