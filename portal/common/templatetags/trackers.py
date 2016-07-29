# -*- coding: utf-8 -*-

from django import template
from django.template.loader import render_to_string
from django.conf import settings
from common.utils import get_subdomain

register = template.Library()

@register.simple_tag(takes_context=True)
def tracker(context):
    """Provide django setting TRACKER_CODES as a dictionary mapping subdomain (www) to the tracker code."""

    request = context['request']
    subdomain = get_subdomain(request.get_host())
    code = settings.TRACKER_CODES.get(subdomain)

    if code is not None:
        tracker = render_to_string('tracker.html', {'tracker_code': code})
    else:
        tracker = '<!-- tracker placeholder -->'


    return tracker

