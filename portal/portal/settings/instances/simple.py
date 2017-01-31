from __future__ import absolute_import

from ..misc.utils import *
from .common import *
from ..db.sqlite import *
from ..cache.memcached import *
from ..messaging.simple import *

from ..solr.simple import *
from ..hosts.localhost import *
from ..coding_server.simple import *
from ..editsearch.elasticsearch.simple import *
from ..redis.simple import *

from ..cassandradb.simple import *
from ..av.simple import *


EPO_HAS_DEDICATED_SK = True

SESSION_COOKIE_SECURE = False

EPO_DEV_CELERY_MODE = 'amqp'

EPO_INSTANCE_NAME = None

INSTANCE_NAME = 'production'

EPO_ENABLE_FILE_LOGGING = False

EPO_ENABLE_SEARCH_LOGGING = False

EPO_ENABLE_EDITSEARCH = True

EPO_ENABLE_TESTS = True

SURROUND_RUNNING_ON_PLATFORM = False

COMPRESS_CACHE_BACKEND = 'compressor'

EPO_DEV_LISTENING_PORT = '8000'

TOP_DOMAIN = 'epo.pl'

DEPLOYMENT_TYPE = 'dev'

EPO_GENERAL_LOGGING_LEVEL = 'DEBUG'

EPO_USE_SOLR_INDEXER = True

EPO_EDITOR_ENABLE_WOMI_STORE = True

EPO_EDITOR_STORAGE_LOCATION = project_path_join('local/editor-storage')
EPO_NEWREPO_STORAGE_LOCATION = project_path_join('local/newrepo-storage')
EPO_KZD_EDITOR_STORAGE_LOCATION = project_path_join('local/kzd-editor-storage')

MEDIA_ROOT = project_path_join('local/media')
# Allowed hosts is set to '*' when in DEBUG mode but let's set it explicitely to allow testing dev deployment
# without DEBUG
ALLOWED_HOSTS = ['*']

EPO_MOBILE_VERSIONS_FILE_URL = 'http://static.epo.pl/portal/other/mobile-versions.json'
EPO_INTER_COLLECTIONS_FILE_URL = 'http://static.epo.pl/portal/other/inter-collections.json'

DEBUG = True
TEMPLATE_DEBUG = True
DEBUG_TOOLBAR = False

SURROUND_CACHE_VIEWS = True

SITE_ID = 2

TRACKER_STATISTICS = '16'
TRACKER_CODES = {}

EPO_FRONT_STATISTICS_PERIOD = 'day'

EPO_COMPRESSOR_CACHE_LESS = False
EPO_COMPRESSOR_CACHE_JS = False

EPO_GE_GETJSON_OVERRIDE = True

EPO_MESSAGING_ENABLE = True

SURROUND_EXPERIMENTALS_ENABLED = True

EPO_FRONT_123_MOVIE_SUBDOMAIN = 'preview'

EPO_ENABLE_EDITCOMMON_TEST = True

EPO_ETX_ENABLE = True

EPO_DEV_ETX_USE_LOCALHOST = False

EPO_ENABLE_USERAPI = True

EPO_ENABLE_EDITION_LOGGING = False

EPO_REPO_ADVANCED_TOOLS_PATH = project_parent_path_join('epodreczniki-eprt-tools', 'deploy')

EPO_EMAIL_ONLY_PRINT = True

EPO_FRONT_PROFILE_ENABLE = True

EPO_USERAPI_FORCE_SECURE = False

REDIS_TWEMPROXY = None
del SESSION_ENGINE
del SESSION_CACHE_ALIAS

deduce('all', globals())

CACHES.update({
    'compressor_real': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    },
    'compressor_dummy': {
        'BACKEND': 'django.core.cache.backends.dummy.DummyCache',
    },
    'compressor': {
        'BACKEND': 'emulation.compressor_cache.CompressorCache',
        'RULES': {
            'file.css': 'compressor_real' if EPO_COMPRESSOR_CACHE_LESS else 'compressor_dummy',
            'file.js': 'compressor_real' if EPO_COMPRESSOR_CACHE_JS else 'compressor_dummy',
        },
        'DEFAULT': 'compressor_dummy'
    },
})

# TODO EPP-1755 configure some backend for others also
INSTALLED_APPS += ('emulation', )

EPO_PUBLISH_DIRECTORY = project_path_join('portal', 'static', 'repository', 'content')

# TODO EPP-1755 until johnny cache is properly configured, ORM backend cannot be used in production at all

import platform
EPO_USE_WGET_FOR_PUBLICATIONS_DOWNLOAD = (platform.system() != 'Windows')

AUTH_OIDC_VERIFY_TOKEN_SIGN = False

