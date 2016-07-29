import json
import subprocess

import re
import os
from django import template
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.contrib.staticfiles import finders


register = template.Library()

NODE_EXECUTABLE = 'node'


def get_fullpath(path, resolve_path=True):
    if not resolve_path:
        return path
    files = finders.find(path, all=True)
    if isinstance(files, list):
        return files[0]
    elif files is not None:
        return files
    else:
        return path


def jsconfig_to_json(string):
    jsonp, n = re.subn(r'\s*\S*\(', '', string, count=1)
    if n == 1:
        jsonp = re.sub(r'\)\s*\S*', '', jsonp, count=1)
    jsonp = re.sub(r'//.*\S', '', jsonp)
    jsonp = re.sub(r'(?P<word>\w+)\s*:', '"\g<word>":', jsonp)
    return json.loads(jsonp.replace('\'', '"'))


def required_libs():
    paths = []
    if hasattr(settings, 'REQUIRED_LIBS'):
        for arg in settings.REQUIRED_LIBS.keys():
            path = get_fullpath(settings.REQUIRED_LIBS[arg])
            if path.endswith('.js'):
                path = path[:-3]
            paths.append('paths.%s=%s' % (arg, path))
    return paths


@register.simple_tag
def requirejs(filename, resolve_path=True, include_tags=True):
    r = getattr(settings, 'REQUIRE_R_JS', None)
    if not r:
        raise ImproperlyConfigured('REQUIRE_R_JS not set')
    tmp = getattr(settings, 'REQUIRE_TMP', None)
    if not tmp:
        raise ImproperlyConfigured('REQUIRE_TMP not set')

    libs = required_libs()
    global_config = getattr(settings, 'REQUIRE_GLOBAL_CONFIG', None)
    outfile = os.path.join(tmp, filename.replace('\\', '_').replace('/', '_').replace('.', '_') + '_build.js')
    process_args = [NODE_EXECUTABLE, r, '-o', get_fullpath(filename, resolve_path), 'out=' + outfile]
    process_args += libs
    if global_config:
        process_args.append('mainConfigFile=' + get_fullpath(global_config))
    try:
        output = subprocess.check_output(process_args)
    except subprocess.CalledProcessError, e:
        raise Exception(e.output)

    if 'Error' in output:
        raise Exception(output)

    f = open(outfile, 'r')
    ret = '<script>%s</script>' % f.read() if include_tags else f.read()
    f.close()
    return ret