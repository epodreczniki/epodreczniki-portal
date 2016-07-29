# coding=utf-8
from django import template

register = template.Library()

@register.inclusion_tag('common/snippets/endpoint_data.html')
def endpoints_data_attrs(endpoints):
    return {
        'items': endpoints.items()
    }
