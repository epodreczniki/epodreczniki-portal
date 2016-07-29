DEFAULT_CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.PyLibMCCache',#'johnny.backends.memcached.PyLibMCCache',
        'LOCATION': 'TO_BE_FILLED_IN_DEDUCE_COMMON',
        #'JOHNNY_CACHE': True,
    }
}
