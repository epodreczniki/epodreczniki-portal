from api.utils import doc_path_hasher
import re
from django import template
from django.utils.html import escape

register = template.Library()

TAGS = [
    {
        'name': 'val',
        'replace_pattern': lambda s: '<tt>%s</tt>' % s
    },
    {
        'name': 'exval',
        'replace_pattern': lambda s: '<p><strong>Example value: </strong><tt>%s</tt></p>' % s
    },
    {
        'name': 'api',
        'replace_pattern': lambda s, params: '<a href="/details/?model=%s">%s</a>' % (
            doc_path_hasher(s + params['v']), escape(s))
    },
    {
        'name': 'i',
        'replace_pattern': lambda s: '<ul><li>%s</li></ul>' % s
    },
    {
        'name': 'red',
        'replace_pattern': lambda s: '<span style="color: red;">%s</span>' % s
    },
    {
        'name': 'b',
        'replace_pattern': lambda s: '<strong>%s</strong>' % s
    }
]

PATTERN_PATTERN = r'(\[%s(.*)\](.*)\[/%s\])'


def params_parser(param_str):
    kvs = param_str.strip().split(',')
    params = dict()
    for kv in kvs:
        key, value = kv.split('=')
        params[key] = value
    return params


@register.filter
def parse_tags(value):
    output = value
    for tag in TAGS:
        pattern = PATTERN_PATTERN % (tag['name'], tag['name'])
        occurrences = re.findall(pattern, output)
        for occur in occurrences:
            _occur = [o for o in occur if o != '']
            if len(_occur) > 2:
                params = params_parser(_occur[1])
                output = output.replace(_occur[0], (tag['replace_pattern'](_occur[2], params)))
            else:
                output = output.replace(_occur[0], (tag['replace_pattern'](_occur[1])))
            output = output.replace('[n]', '<br>')

    return output


@register.filter
def make_version_hash(path, ver):
    return doc_path_hasher(path + ver)
