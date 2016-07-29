import inspect
from django.conf import settings
from django.core.urlresolvers import get_resolver, get_script_prefix
from django.core.urlresolvers import get_urlconf
from django.core.urlresolvers import reverse
from django.utils import importlib
from django.utils.http import urlquote
from django.utils.regex_helper import normalize
from django_hosts import reverse_full
from portal.hosts import subdomain


def get_user_endpoints(user=None):
    endpoints = getattr(settings, 'USER_ENDPOINTS', [])
    endpoints_map = {}
    for endpoint in endpoints:
        module, klass = endpoint.rsplit('.', 1)
        ep = importlib.import_module(module)
        cls = getattr(ep, klass)
        if inspect.isclass(cls):
            inst = cls(user)
            endpoints_map[inst.name] = inst.collect()

    return endpoints_map


def endpoint(func):
    def endpoint_decorator(self):
        return func(self)
    return endpoint_decorator


def endpoint_string_pattern(viewname, with_host=False, pattern_subdomain='www', force_secure=False):
    urlconf = get_urlconf()
    resolver = get_resolver(urlconf)
    args = resolver.reverse_dict[viewname][0][0][1][:]
    pattern = resolver.reverse_dict[viewname][0][0][0]
    prefix = get_script_prefix()
    prefix_norm, prefix_args = normalize(urlquote(prefix))[0]
    candidate_pat = prefix_norm.replace('%', '%%') + pattern
    pattern_args = {arg: '{%s}' % arg for arg in args}
    path = candidate_pat % pattern_args
    if with_host:
        return '%s//%s.%s%s' % (('https:' if force_secure else ''), pattern_subdomain, settings.TOP_DOMAIN, path)

    return path


class UserEndpointBase(object):
    name = 'base'

    def __init__(self, user):
        self._user = user
        self._endpoints = []
        for method in inspect.getmembers(self):
            if inspect.ismethod(method[1]) and method[1].__name__ == 'endpoint_decorator':
                self._endpoints.append(method)

    def collect(self):
        collection = {}
        for endpoint in self._endpoints:
            collection[endpoint[0]] = endpoint[1]()
        return collection


class ExampleEndpoint(UserEndpointBase):
    name = 'example'

    @endpoint
    def method1(self):
        return '/user/cos/' + self._user.username