from ..misc.utils import deduce
from ..misc.search_config import *
from copy import copy

CACHES = {}

CACHES.update(DEFAULT_CACHES)

CACHES.update(REDIS_CACHES)

if REDIS_TWEMPROXY:
    CACHES.update(REDIS_TWEMPROXY)


if EPO_ETX_IFRAME_SEPARATE_DOMAIN is not None:
    EPO_ETX_IFRAME_ACTIVE_DOMAIN = EPO_ETX_IFRAME_SEPARATE_DOMAIN
else:
    EPO_ETX_IFRAME_ACTIVE_DOMAIN = 'static.' + TOP_DOMAIN

if (not SURROUND_RUNNING_ON_PLATFORM) and EPO_DEV_ETX_USE_LOCALHOST:
    EPO_ETX_IFRAME_ACTIVE_DOMAIN = 'localhost:' + EPO_DEV_LISTENING_PORT


SURROUND_SIMPLE_CORS_COMMON_DOMAINS = [TOP_DOMAIN, 'www.' + TOP_DOMAIN, 'static.' + TOP_DOMAIN, 'preview.' + TOP_DOMAIN, 'search.' + TOP_DOMAIN]
SURROUND_SIMPLE_CORS_COMMON_ALLOWED_METHODS = [ "GET", "HEAD", "OPTIONS" ]

SURROUND_SIMPLE_CORS_PROFILES = {
    'open': { 'allow_all': True },
    'default': { },
    'edition': { 'domains': SURROUND_SIMPLE_CORS_COMMON_DOMAINS + ([EPO_ETX_IFRAME_ACTIVE_DOMAIN] if (EPO_ETX_IFRAME_ACTIVE_DOMAIN not in SURROUND_SIMPLE_CORS_COMMON_DOMAINS) else []) },
    'search': { },
    'userapi': { 'allow_credentials': True, 'allow_methods': ['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'OPTIONS'] },
    'useredit': { 'allow_credentials': True, 'allow_methods': ['GET', 'HEAD', 'POST', 'OPTIONS'] },
}


deduce('logging', globals())
deduce('messaging', globals())
deduce('celery', globals())
deduce("crontab", globals())

# TO_BE_FILLED_IN_DEDUCE_COMMON

if CACHES['default']['BACKEND'] in ['johnny.backends.memcached.PyLibMCCache', 'django.core.cache.backends.memcached.PyLibMCCache']:
#    CACHES['default']['LOCATION'] = [h + ":11211" for h in HOSTS['app']]
    CACHES['default']['LOCATION'] = ["127.0.0.1:11211"]

# if 'DJANGO_SETTINGS_MODULE' in environ:
#     print('active settings: %s' % environ['DJANGO_SETTINGS_MODULE'])
# else:
#     print('no settings are active')

