# In order to use it, place line:
# from cache.local_memcached import *
# in your portal/portal/settings/local.py
# and have memcached running in it's stock configuration.

DEFAULT_CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyLibMCCache',
        'LOCATION': '127.0.0.1:11211',
    }
}
