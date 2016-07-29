# coding=utf-8
from django.conf import settings

IMPORTS_SPLIT_CHAR = ';'


def engine_dependency(engines):
    engines_list = []
    for engine in engines:
        if engine in settings.EXTERNAL_ENGINES:
            e = {}
            e.update(settings.EXTERNAL_ENGINES[engine])
            if not e['ignore_in_dependencies']:
                if e['internal']:
                    e['url_template'] = settings.STATIC_URL + e['url_template']
                e['name'] = engine
                if 'priority' not in e:
                    e['priority'] = 0
                engines_list.append(e)
    return sorted(engines_list, cmp=lambda x, y: cmp(x['priority'], y['priority']), reverse=True)


