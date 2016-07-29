# -*- coding: utf-8 -*-

from django import template
from django.conf import settings
from django.template import loader
from django.shortcuts import render
from editstore.utils import get_style
from repository.utils import ImportFailure

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

register = template.Library()

@register.filter
def new_old_template(value):
    return '%s/%s' % ('bindery' if settings.EPO_EDITION_NEW_STYLE else 'editres', value)

@register.inclusion_tag(file_name='editres/snippets/listing.html')
def objects_listing(category, drivers):
    return {
        'category': category,
        'drivers': drivers,
    }


@register.inclusion_tag(file_name='editres/snippets/space_tile.html')
def space_tile(space_driver):
    return {
        'space_driver': space_driver,
    }


@register.simple_tag(takes_context=True)
def object_tile(context, driver):
    context['driver'] = driver
    try:
        return loader.get_template("editres/snippets/listing_%s.html" % driver.category).render(context)
    except ImportFailure as ex:
        error('error when attempt to list %s: %s(%s) in edition online; reason: %s', driver.category, driver.identifier, driver.version, ex)
        context['error_obj'] = ex
        return loader.get_template("editres/snippets/listing_object_error.html").render(context)

@register.simple_tag(takes_context=True)
def aggregated_history_entries(context):
    context['entries'] = context['request'].history_aggregator
    return loader.get_template('editres/snippets/history_list.html').render(context)


@register.simple_tag
def style_icon(style):
    if style is None:
        return ''
    config = get_style(style)
    return '<span class="glyphicon glyphicon-%s"></span>' % config.glyph


@register.simple_tag
def short_label(label):
    if len(label) <= 15:
        return label

    return u'<span title="{}">{}...</span>'.format(label, label[:15])