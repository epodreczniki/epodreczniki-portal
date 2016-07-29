"""Compressor cache backend

Based on django.core.cache.backends.dummy.DummyCache.

"""

from django.core.cache.backends.base import BaseCache
from django.core.cache import get_cache
from django.utils.functional import SimpleLazyObject

def lazy_cache(name):
    return SimpleLazyObject(lambda: get_cache(name))

class CompressorCache(BaseCache):
    def __init__(self, host, params, *args, **kwargs):
        BaseCache.__init__(self, params, *args, **kwargs)
        self.caches = {}
        for rule, cache in params.get('RULES', {}).items():
            # print('creating cache rule: %s -> %s' % (rule, cache))
            self.caches.update({rule: lazy_cache(cache)})

        self.default_cache = lazy_cache(params.get('DEFAULT', 'default'))

    def _select_cache(self, key):
        # print(key)
        for rule, cache in self.caches.items():
            if key.endswith(rule):
                return cache
        return self.default_cache

    def add(self, key, value, timeout=None, version=None):
        return self._select_cache(key).add(key, value, timeout, version)

    def get(self, key, default=None, version=None):
        return self._select_cache(key).get(key, default, version)

    def set(self, key, value, timeout=None, version=None):
        self._select_cache(key).set(key, value, timeout, version)

    def delete(self, key, version=None):
        self._select_cache(key).delete(key, versoin)


# For backwards compatibility
class CacheClass(BaseCache):
    pass
