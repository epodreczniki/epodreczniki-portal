from common.endpoint import endpoint_string_pattern
from common.utils import epo_translate
from django.conf import settings
from surround.django.utils import absolute_url
from django import template
from django.template.loader import render_to_string
from common import models
from surround.django.basic.templatetags.common_ext import host_url
import re

register = template.Library()

# TODO: this is partially wrong - only path of the request can be accessed
@register.simple_tag(takes_context=True)
def absolute_path(context, path):
    request = context['request']
    return absolute_url(request, path)




class Counter(object):
    def __init__(self):
        self._value = 0

    def __str__(self):
        return str(self._value)

    def increment(self):
        self._value += 1
        return ''

    @property
    def value(self):
        return str(self._value)


@register.simple_tag(takes_context=True)
def counter(context, name):
    context[name] = Counter()
    return ''


@register.simple_tag(takes_context=True)
def table_of_contents_recursive(context, presentation, parent_content, parent, parent_level):
    return render_to_string('table_of_contents.html', {'parent_content': parent_content,
                                                       'parent': parent,
                                                       'parent_level': parent_level,
                                                       'collection': parent_content.collection,
                                                       'presentation': presentation,
                                                       'config': parent_content.collection.environment_type_config}, context)


@register.filter
def grouped_womi_references(womi_referrer):
    result = {}
    for womi_reference in womi_referrer.womi_references_prefetch_related_womi.all():
        nice_kind = womi_reference.nice_kind

        if nice_kind not in result:
            result[nice_kind] = []

        result[nice_kind].append(womi_reference)

    return result.items()


@register.filter
def reader_resource(module_occurrence, resource_name):
    return module_occurrence.resource_url(resource_name)


@register.simple_tag
def womi_embed_pattern(config):
    if config and hasattr(config, 'VIEWS_BASE_NAME'):
        return endpoint_string_pattern(config.VIEWS_BASE_NAME + '_womi_embed', True)
    else:
        return ''


@register.filter
def womi_file_url(womi, path):
    return womi.path_url(path)

@register.filter
def attribute(attributes_owner, name, default=None):
    return attributes_owner.get_attribute_value(name, default=default)

@register.filter
def split(value, arg=" "):
    return value.split(arg)

@register.filter
def collection_presentation_toc_mappings(presentation):
    for module_id_and_key in presentation.collection.get_attribute_value('collection-toc-mappings').split(" "):
        _, module_id = module_id_and_key.split(':')
        module_occurrence_presentation = presentation.bind_module_or_404(module_id)

        yield module_occurrence_presentation.url + '/auto', module_occurrence_presentation.module_occurrence.single_referred_womi_or_none(models.WomiReference.PLAY_AND_LEARN_UNBOUND_KIND).title



@register.simple_tag
def collection_specific_translate(collection, word):
    dictionary = 'none'
    if collection.md_school is not None and collection.md_school.md_education_level == 'III':
        dictionary = 'gim'
    return epo_translate('reader', dictionary, word)


@register.filter
def resolve_license(value, key):
    for lic in settings.LICENSE_LIST:
        if key in lic and lic[key] == value:
            return lic

    return resolve_license('CC0', 'id')

IMPLODED_URL_REGEX = re.compile(r'\/(?P<subdomain>\w+)\/(?P<path>.*)')

@register.filter
def explode_url_host(url):
    match = IMPLODED_URL_REGEX.match(url)
    if not match:
        return None
    return '//%s.%s/%s' % (match.group('subdomain'), settings.TOP_DOMAIN, match.group('path'))




@register.filter
def extract_subdomain(host):
    return host[:host.find(settings.TOP_DOMAIN) - 1]


@register.simple_tag(takes_context=True)
def current_request_as_next_redirect_url(context):
    request = context['request']
    return '/%s%s' % (extract_subdomain(request.get_host()), request.path)


@register.filter
def distinct_cc(entries):
    result = set()
    for cc in entries:
        if cc.stage and cc.school:
            result.add(u'{} - {}'.format(unicode(cc.stage.value), unicode(cc.school.value)))
        elif cc.stage:
            result.add(unicode(cc.stage.value))
        elif cc.school:
            result.add(unicode(cc.school.value))

    return result

@register.simple_tag
def begin_start_page_url():
    return host_url('www', 'wagtail_serve', '')
