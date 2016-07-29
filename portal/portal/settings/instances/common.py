# coding=utf-8
from __future__ import absolute_import

from django.core.urlresolvers import reverse_lazy
from ..misc.utils import *
from collections import OrderedDict
from ..misc.licenses import *


TIME_ZONE = 'Europe/Warsaw'
USE_TZ = True

LANGUAGE_CODE = 'pl-PL'
USE_I18N = True
USE_L10N = True

# import os
# print('loading settings for %s' % os.environ["DJANGO_SETTINGS_MODULE"])
# from IPython import embed ; embed()

SECRET_KEY = '-h=(kqeys@i+m8@55nk+0!6d^b@xua)0v2@-_^$c*0_upwi7f2'

#authentication config
#from auth import *

STATIC_ROOT = django_project_path_join('collected-static')

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.CachedStaticFilesStorage'

STATICFILES_DIRS = (
    django_project_path_join('static'),
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'compressor.finders.CompressorFinder',
)

TEMPLATE_LOADERS = (
    'django.template.loaders.app_directories.Loader',
)

# CORS_ORIGIN_ALLOW_ALL = True

TEMPLATE_CONTEXT_PROCESSORS = (
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.i18n',
    'django.core.context_processors.request',
    'django.core.context_processors.static',
    'django.core.context_processors.media',
    'common.context_processors.debug.debug',
    'common.context_processors.debug.sentry',
    'common.context_processors.external_dependencies.engines',
    'common.context_processors.deployment_type.deployment_type',
    'api.context_processors.include_docs.include_docs',
    'django.contrib.messages.context_processors.messages',
)

MIDDLEWARE_CLASSES = [
    'django_hosts.middleware.HostsRequestMiddleware',
    'django.middleware.http.ConditionalGetMiddleware',

    'surround.django.middleware.minify_html.MinifyHTMLMiddleware',

    'django.middleware.common.CommonMiddleware',
    'auth.middleware.EpoSessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'auth.middleware.OpenIdMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    'django_hosts.middleware.HostsResponseMiddleware',
]

ROOT_URLCONF = 'portal.urls'
ROOT_HOSTCONF = 'portal.hosts'

# IMPORTANT NOTE: this is set here to an existing host only becaouse of django-hosts settings validation
# in portal/portal/hosts.py configuration all non matching hosts are caught by 'other_host',
# since passing non matching domains to a real domain is considered invalid approach
# it is another layer of protection, since invalid domains should be filtered by front Varnish
DEFAULT_HOST = 'invalid'
PARENT_HOST = ''

WSGI_APPLICATION = 'portal.wsgi.application'

# Default to path of the URL that generated the cookie. This allows some parts of the page to issue a session cookie
# but not pollute other parts which still can be cached and retrieved by all users (=stored in http cache). On the
# other hand the browser might end up with a few distinct session cookies for various paths...
#
# We might for example issue a session cookie from '/session/' URL and then put all the resources that need this session
# as subpaths of '/session/' without polluting '/' and '/someother' with cookies.
#
# We might also hardcode SESSION_COOKIE_PATH to '/session/' or sth similar.
#
# PLEASE NOTE: If you set a cookie from '/common/foo/' URL, then the cookie path will be set to '/common/foo/', but if
# you serve it from '/common/foo' then the path will be set to '/common/'.
SESSION_COOKIE_PATH = ''

# 1 week (default is 2 weeks)
SESSION_COOKIE_AGE = 604800

SESSION_COOKIE_SECURE = True

# Default to path of the URL that generated the cookie. The same comment applies as for SESSION_COOKIE_PATH.
CSRF_COOKIE_PATH = ''

# We must have compression always enabled as we use Django templates in JavaScript files
COMPRESS_ENABLED = True

# Hashes are created based on file's content not modification time
COMPRESS_CSS_HASHING_METHOD = 'content'

# IMPORTANT: check deduce_deployment.py for changes in precompilers on deployment environment
COMPRESS_PRECOMPILERS = (
    ('text/less', 'lessc --no-color --verbose {infile} {outfile}'),
    ('text/requirejs', 'compressor_requirejs.compressor.r_precompiler.RequireJSPrecompiler'),
    ('text/x-scss', 'django_libsass.SassCompiler'),
)

COMPRESS_PARSER = 'compressor.parser.HtmlParser'

COMPRESS_CSS_COMPRESSOR = 'common.compressor.css.NewCssCompressor'

COMPRESS_CSS_FILTERS = [
    # 'common.compressor.css_filters.NewCssAbsoluteFilter'
    'compressor.filters.css_default.CssAbsoluteFilter'
]
COMPRESS_JS_FILTERS = [
    'common.compressor_filters.template.TemplateFilter'
]

# Always minify HTML so that there are no bugs seen only on the testing/production server
MINIFY_HTML = True

# Default Expires/max-age header values for HTML that we are serving
_WEEK_TIMEOUT = 60 * 60 * 24 * 7
DEFAULT_CACHE_TIME = 60 * 60

EPO_PREVIEW_WOMI_CACHE_TIME = _WEEK_TIMEOUT

EPO_PREVIEW_SK_TIMEOUT = _WEEK_TIMEOUT

EPO_PREVIEW_SOURCE_CACHE_TIME = _WEEK_TIMEOUT

EPO_PREVIEW_SOURCE_PARSED_CACHE_TIME = _WEEK_TIMEOUT

EPO_PREVIEW_HTML_CACHE_TIME = _WEEK_TIMEOUT

EPO_PREVIEW_PAGES_CACHE_TIME = _WEEK_TIMEOUT

SEARCH_RESULT_CACHE_TIME = 60 * 10

DEBUG_TOOLBAR = False
DEBUG = False

PROJECT_APPS = (
    'basics',
    'common',
    'auth',
    'front',
    'reader',
    'api',
    'repository',
    'riddle',
    'tickets',
    'preview',
    'search',
    'content',
    'repo',
    'surround.django.health',
    'store',
    'codingserver',
    'publication',
    'userapi',
)

PROJECT_APPS += (
    'editcommon',
    'edittext',
    'editcoll',
    'editline',
    'editor',
    'editres',
    'editstore',
    only_if('EPO_ENABLE_EDITION', 'editkzd'),
)

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django_extensions',
    'surround.django',
    'surround.django.basic',
    'compressor',
    'compressor_requirejs',
    'django_jenkins',
    'health_check',
    'health_check_db',
    'health_check_cache',
    'django_hosts',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'jira',
    'django.contrib.staticfiles',
    'url_tools',
    'djcelery',
)

INSTALLED_APPS += PROJECT_APPS

#rest framework must be after uor application due to override templates
INSTALLED_APPS += (
    'rest_framework',
    'rest_framework_docs',
)

WAGTAIL_APPS = (
    'taggit',
    'modelcluster',
    'wagtail.wagtailcore',
    'wagtail.wagtailadmin',
    'wagtail.wagtaildocs',
    'wagtail.wagtailsnippets',
    'wagtail.wagtailusers',
    'wagtail.wagtailsites',
    'wagtail.wagtailimages',
    'wagtail.wagtailembeds',
    'wagtail.wagtailsearch',
    'wagtail.wagtailredirects',
    'wagtail.wagtailforms',
    'begin'
)

INSTALLED_APPS += WAGTAIL_APPS


JENKINS_TASKS = (
    'django_jenkins.tasks.with_coverage',
    'django_jenkins.tasks.django_tests',
    'common.jenkins.tasks.run_jshint',
    'django_jenkins.tasks.run_pep8',
    'django_jenkins.tasks.run_pylint',
    'django_jenkins.tasks.run_pyflakes',
)

PEP8_RCFILE = 'qa/pep8.rc'
PYLINT_RCFILE = 'qa/pylint.rc'

#import engines definition
from ..misc.engines_definition import EXTERNAL_ENGINES
# EXTERNAL_ENGINES = EXTERNAL_ENGINES

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.

# A possible way to completely disable debug altogether:
# logger.debug = lambda *a, **kw: None

# try this to silence https://djangosnippets.org/snippets/2050/



REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
        'rest_framework.renderers.XMLRenderer',
    ),
}

TRACKER_API_TOKEN_AUTH = '?'
TRACKER_API_URL = '?'

TEST_OPEN_SEARCH_EXCEPTION = False

JIRA_AUTH = ('user', 'password')

JIRA_URL = 'https://jira.address/jira/browse/'

EPO_JIRA_OUTPUT_PROJECT = {
    'key': 'project-key',
    'name': 'project-name'
}

MAN_IN_BLACKLIST = ()


WAIT_AFTER_DEPLOY = 300

GIT_BRANCH_DEPLOYMENT_GUARD = None

# versions must match following regex: \d+\.\d+
API_VALID_VERSIONS = ('2.1', '2.0', '1.0',)

COMPRESSOR_REQUIREJS_TMP = project_path_join('tmp')

COMPRESSOR_REQUIREJS_REQUIRED_LIBS = {
    'front': 'front/js',
    '_jquery': 'common/js/libs/jquery_wrapper.js',
    'jquery': 'common/js/libs/jquery-2.0.3.min.js',
    'jqueryui': 'common/js/libs/jquery-ui-1.10.3.custom.js',
    'jquery_qrcode': 'common/js/libs/jquery.qrcode.js',
    'domReady': 'common/js/libs/require_libs/domReady.js',
    'text': 'common/js/libs/require_libs/text.js',
    'json': 'common/js/libs/require_libs/json.js',
    'underscore': 'common/js/libs/underscore.js',
    'backbone': 'common/js/libs/backbone.js',
    'localStorage': 'common/js/libs/backbone_libs/backbone.localStorage.js',
    'declare': 'common/js/libs/declare.js',
    'bowser': 'common/js/libs/bowser.js',
    'common_base': 'common/js/common.js',
    'contact_form': 'common/js/contact-form.js',
    'fancybox': 'common/js/libs/jquery.fancybox.js',
    # 'svg_fallback': 'common/js/svg-fallback.js',
    'device_detection': 'common/js/device-detection.js',
    'masterBuild': 'common/js/masterBuild.js',
    'mocha': 'common/js/libs/testing/mocha.js',
    'chai': 'common/js/libs/testing/chai.js',
    'imagesLoaded': 'common/js/libs/imagesLoaded.pkgd.js',
    'search_box': 'front/js/modules/new_front/search_box.js',
    'portal_instance': 'common/js/portal_instance.js',
    'velocity': 'editcommon/js/libs/velocity.js',
    'velocityui': 'editcommon/js/libs/velocityui.js',
    'picker': 'editcommon/js/libs/pickadate/picker.js',
    'pickadate': 'editcommon/js/libs/pickadate/picker.date.js',
    'endpoint_tools': 'common/js/endpoint_tools.js',
    'rangy-core': 'common/js/libs/rangy/rangy-core.js',
    'rangy-textrange': 'common/js/libs/rangy/rangy-textrange.js',
    'rangy-classapplier': 'common/js/libs/rangy/rangy-classapplier.js',
    'EpoAuth': 'common/js/auth/EpoAuth.js',
    'auth_login_template': 'common/js/auth/login_template.html',
    'play_and_learn': 'common/js/play_and_learn.js',
    'JIC': 'common/js/libs/JIC.js'
}

COMPRESSOR_REQUIREJS_CACHE_BACKEND = 'default'


def logging_compressor_requirejs(text):
    import importlib
    mod_name, func_name = 'surround.django.logging', 'setupModuleLogger'
    mod = importlib.import_module(mod_name)
    func = getattr(mod, func_name)
    func(globals())
    debug(text)

COMPRESSOR_REQUIREJS_LOGGING_OUTPUT_FUNCTION = logging_compressor_requirejs



STATIC_URL = lazy_format('//static.%s/portal/', 'TOP_DOMAIN')
REPOSITORY_URL  = lazy_format('//content.%s/portal/', 'TOP_DOMAIN')

# it should be nice reverse here, but lazy
LOGIN_REDIRECT_URL = lazy_format('//www.%s/begin/', 'TOP_DOMAIN')
LOGIN_URL = lazy_format('//user.%s/auth/login', 'TOP_DOMAIN')



HOSTS = {
    'cache': lazy_setting('EPO_CACHE_HOSTS'),
    'app': lazy_setting('EPO_APP_HOSTS'),
    'static': lazy_setting('EPO_STATIC_HOSTS'),
    only_if('EPO_ZONE_MAIN', 'coding_server'): [ lazy_setting('SK_IP') ],
    only_if('EPO_ZONE_MAIN', 'av'): [ lazy_setting('AV_SERVER_ADDRESS') ],
}

ROLES = {
    'cache': {
        'port': 80,
        'is_cache_backend': False,
    },
    'app': {
        'port': 8000,
        'is_cache_backend': False,
    },
    only_if('EPO_ZONE_MAIN', 'app_main'): {
        'hosts': 'app',
        'port': 8000,
    },
    only_if('EPO_ZONE_SEARCH', 'app_search'): {
        'hosts': 'app',
        'port': 8000,
    },
    only_if('EPO_ZONE_USER', 'app_user'): {
        'hosts': 'app',
        'port': 8000,
    },
    only_if('EPO_ZONE_USER', 'app_userapi'): {
        'hosts': 'app',
        'port': 8000,
    },
    only_if('EPO_ZONE_MAIN', 'static'): {
        'port': 8000,
    },
    'app_health': {
        'hosts': 'app',
        'port': 8000,
    },
    only_if('EPO_ZONE_MAIN', 'av'): {
        'subdomain': 'av.proxy',
    },
    only_if('EPO_ZONE_MAIN', 'admin'): {
        'hosts': 'app',
        'port': 8000,
    },
    only_if('EPO_ZONE_MAIN', 'begin'): {
        'hosts': 'app',
        'port': 8000,
        'type' : 'fallback',
    },
    only_if('EPO_ZONE_MAIN', only_if('EPO_ENABLE_EDITION', 'edition')): {
        'hosts': 'app',
        'port': 8000,
    },
    only_if('EPO_ZONE_MAIN', 'preview'): {
        'hosts': 'app',
        'port': 8000,
    },
    only_if('EPO_ZONE_MAIN', 'coding_server'): {
        'port': lazy_setting('SK_PORT', default=80),
        'subdomain': 'directsk',
    },
}



EPO_FRONT_STATISTICS_PERIOD = 'all'

CORS_ORIGIN_ALLOW_ALL = True
SURROUND_RUNNING_ON_PLATFORM = True

HAYSTACK_CONNECTIONS = {}


INSTANCE_NAME = 'anonymous'

PREVIEW_WOMI_USE_DYNAMIC = True

EPO_ENABLE_MAIL_ADMINS = True

SURROUND_RUNNING_MANAGEMENT_COMMAND_ON_PLATFORM = get_bool_env_variable('SURROUND_RUNNING_MANAGEMENT_COMMAND_ON_PLATFORM', False)

SURROUND_ROOT_LOGGER_NAME = 'epo'

EPO_ENABLE_FILE_LOGGING = True

EPO_PUBLIC_PREVIEW = True


SURROUND_PLATFORM_CACHE_FAILED_TTL_TIMEOUT = 5

EPO_GENERAL_LOGGING_LEVEL = 'INFO'

SURROUND_ENABLE_COROUTINE_ON_PLATFORM = True

EPO_EMERGENCY_HOSTED_COLLECTIONS = []

EPO_SHOW_TRACKING_STATISTICS = True

SURROUND_SENTRY_ENABLE = False

SURROUND_SENTRY_JS_ENABLE = False

EPO_USE_SOLR_INDEXER = True

EPO_GE_GETJSON_OVERRIDE = False

EPO_EDITSEARCH_INDEX_NAME = None

EPO_ENABLE_EDITSEARCH = False

#### CELERY ####
CELERY_RESULT_BACKEND = 'djcelery.backends.database:DatabaseBackend'

JIRA_SERVER = 'https://jira.man.poznan.pl/jira'

EPO_EDITOR_ENABLE_WOMI_STORE = False

EPO_ENABLE_EDITOR = True

EPO_ENABLE_EDITION = True

EPO_ENABLE_TESTS = False

SURROUND_CACHE_VIEWS = True

SURROUND_EXPERIMENTALS_ENABLED = False

SURROUND_DEV_ENABLE_EDGE_SIDE_CACHE = True

#### SEARCH LOG ####
EPO_ENABLE_SEARCH_LOGGING = True

EPO_REFRESH_STATS_HOUR = 2

EPO_EDITOR_STORAGE_LOCATION = None
EPO_KZD_EDITOR_STORAGE_LOCATION = None

EPO_KZD_SYNC_SECRET = '?'

EPO_KZD_MEN_FTP_HOST = '?'
EPO_KZD_MEN_FTP_USER = '?'
EPO_KZD_MEN_FTP_PASSWORD = '?'


EPO_NOTIFY_SK_DIRECTLY = False

EPO_CONTENT_REPOSITORIES_DESCRIPTOR = OrderedDict([

    ("content", {
        "driver": "repo.drivers.advanced.AdvancedDriver",
        "backend": {
            "ip": ["192.168.1.52"],
            "port": 80,
        },
        "enabled": True,
        "info": {
            "description": "Główne repozytorium projektu E-podręczniki",
            "url": "http://epodreczniki.pcss.pl",
        },
        "api": {
            "writeRoot": "www.epodreczniki.pl/repos/main/api",
            "readDomain": "epodreczniki.pcss.pl",
        },
        "namespacePrefix": "m",
        "identifiers": {
            "collection": { "regex": r'\d{1,10}' },
            "module": { "regex": r'[^nx]\w{3,}' },
            "womi": { "regex": r'\d{1,10}' },
        },
        "responsible": {
            "description": "PCSS",
            "url": "www.man.poznan.pl",
        },
    }),
])

EPO_EDITSTORE_PARSED_OBJECT_TIMEOUT = 60 * 60 * 24


EPO_AUTH_PROFILES = {
    'default': {
        'allowed': 'all',
        'need_login': True
    },
    'publication': {
        'allowed': 'all',
        'need_login': True,
        #'access_authorizer': 'publication.access.AccessAuthorizer'
    }
}

EPO_AUTH_USER_PING_MAX_AGE = 60

EPO_AUTH_USER_PING_COOKIE_MAX_AGE = 600

EPO_SESSION_ACCESS_PATHS = ('/auth', '/editor', '/edit', '/admin', '/userapi', '/begin/wagtail-admin')



EPO_PUBLICATION_BUFFER_IN_TMP = True

EPO_ENVIRONMENT_TYPE_DEFAULT_CONFIG = {
    'include_dotted_toc_path': True,
    'level_cutoff_on': 1,
    'use_collapse_x': True,
    'details_template': 'front/collection_details.html',
    'generate_titles': False,
}

EPO_ENVIRONMENT_TYPE_UWR_CONFIG = {
    'include_dotted_toc_path': True,
    'level_cutoff_on': 1,
    'use_collapse_x': True,
    'details_template': 'front/collection_details.html',
    'generate_titles': False,
}

EE_CONFIG = {
    'include_dotted_toc_path': False,
    'level_cutoff_on': 2,
    'use_collapse_x': False,
    'details_template': 'front/details123.html',
    'generate_titles': True,
}

EPO_ENVIRONMENT_TYPE_CONFIGS = {
    'ee': EE_CONFIG,
    'normal': EPO_ENVIRONMENT_TYPE_DEFAULT_CONFIG,
    'uwr': EPO_ENVIRONMENT_TYPE_UWR_CONFIG,
}

EPO_MESSAGING_ENABLE = True


#max size of uploaded file in bytes
EDITRES_FILEUPLOAD_MAX_SIZE = 1024 * 1024 * 5

EPO_READER_USE_PERF_COUNTER = True

EPO_READER_USE_LOGGING = True

EPO_READER_API_MODES = {
    'debug': True,
    'info': True,
    'extended': True
}

EPO_FRONT_123_MOVIE_SUBDOMAIN = 'content'

EPO_FRONT_123_FRONT_MOVIE_ID = '34673'

SURROUND_HEALTH_SERVICES = (
    ('redis', 'surround.django.health.backends.cache.Check', {'cache_name': 'redis'}),
    ('user', 'surround.django.health.backends.constant.Check', {'value': True}),
    only_if('EPO_ENABLE_EDITION', ('edition', 'surround.django.health.backends.composite.Check', {'names': ('redis', ) })),
    ('preview', 'surround.django.health.backends.composite.Check', {'names': ('redis', ) }),
)


EPO_HAS_DEDICATED_SK = False

EPO_EDITRES_PRESENT_LABELS = False


EPO_EDITSTORE_SOURCE_CACHE_TIME = 5 * 60

EPO_ENABLE_EDITCOMMON_TEST = False

EPO_REPOSITORY_ENABLE_SELF = False

SURROUND_EXECUTION_DEBUG = False

EPO_GE_LIBRARY_BRANCH = 'develop'
EPO_CP_LIBRARY_BRANCH = 'develop'

EPO_ETX_LIBRARY_BRANCH = 'develop'

EPO_ETX_ENABLE = False

EPO_REPO_ADVANCED_TOOLS_PATH = project_parent_path_join('epodreczniki-eprt-tools')

EPO_REPO_ADVANCED_USER = '?'
EPO_REPO_ADVANCED_PASSWORD = '?'

EPO_MOBILE_VERSIONS_FILE_URL = '?'
EPO_INTER_COLLECTIONS_FILE_URL = '?'


EPO_ETX_IFRAME_SEPARATE_DOMAIN = None

SMTP_CONF = {
  "host" : "?",
  "port" : 587,
  "tls" : True,
  "user" : "?",
  "password" : "?",
  "from" : "?"
}

EMAIL_HOST = SMTP_CONF["host"]

EMAIL_PORT = SMTP_CONF["port"]

EMAIL_USE_TLS = SMTP_CONF["tls"]

EMAIL_HOST_USER = SMTP_CONF["user"]

EMAIL_HOST_PASSWORD = SMTP_CONF["password"]

MINIFY_HTML_EXCLUDE_SUBDOMAINS = ('preview', 'edit')

EPO_EDITION_APPS_REGISTER = {
    'etx': { 'limit': 30 },
    'limited': { 'limit': 2 },
    'cli': { 'limit': None },
    'internal': { 'limit': None },
    'other': { 'limit': None },
}

SURROUND_COROUTINE_MAX_PARALLEL_DEFAULT = 64

EPO_EDITION_LOCKS_REPEATS = 4

EPO_EDITION_LOCK_EXPIRE = 60 * 5

EPO_EDITION_LOCK_KEY_EXPIRE = EPO_EDITION_LOCK_EXPIRE * 3

EPO_ENABLE_EDITION_LOGGING = True

EPO_EDITCOMMON_STANDARD_CACHE_TIME = 60 * 60

EPO_REPO_ADVANCED_ENABLE_SEALING = True



#user endopints config
USER_ENDPOINTS = ('userapi.views.WomiStateEndpoint',
                  'userapi.views.NotesEndpoint',
                  'userapi.views.UserProgressEndpoint',
                  'userapi.views.FileStoreEndpoint',
                  'userapi.views.LastViewedCollectionsEndpoint',
                  'userapi.views.OpenQuestionEndpoint',
                  'userapi.views.UserMyTeacherEndpoint')

EPO_ENABLE_USERAPI = True

EPO_READER_AUTH_ENABLE = True

#api should be ope except for restricted views
# REST_FRAMEWORK.update({
#     'DEFAULT_PERMISSION_CLASSES': (
#         'rest_framework.permissions.IsAuthenticated',
#     ),
#     'DEFAULT_AUTHENTICATION_CLASSES': (
#         'rest_framework.authentication.SessionAuthentication',
#         'rest_framework.authentication.BasicAuthentication',
#         'auth.authentication.EpoJSONWebTokenAuthentication',
#     ),
# })

JWT_AUTH = {
    'JWT_SECRET_KEY': '?',
    'JWT_ALGORITHM': 'HS256',
    'JWT_DECODE_HANDLER': 'auth.jwt_tools.jwt_decode_handler',
    'JWT_ENCODE_HANDLER': 'auth.jwt_tools.jwt_encode_handler',
}


DEV_PAGES_CONFIG = {
    'EXAMPLE_COLLECTIONS': [
        {
            'md_content_id': '130637',#'45314',
            'md_version': '41',
            'variant': 'student-canon',
            'module_id': 'iaXivoLNLM'#'demo_1_1_4_23_p1'
        }
    ],
    'EXAMPLE_MODULES': [
        {
            'md_content_id': 'iaXivoLNLM', #'demo_1_1_4_23_p1',
            'md_version': '17'
        }
    ]
}

TEST_RUNNER = 'django.test.runner.DiscoverRunner'

EPO_PUBLISH_DIRECTORY = "~/static/content"

#uncomment to apply cassandra patch for suppresing connection error
#from portal.patches import cassandra_connection_errror_supress
#cassandra_connection_errror_supress.apply_patch()


#wagtail

LOGIN_URL = 'auth.views.epo_login'

WAGTAIL_SITE_NAME = "begin"

WAGTAILIMAGES_FEATURE_DETECTION_ENABLED = False

WAGTAIL_IMAGE_SERVE_CACHE_TIMEOUT = 60 * 30

EPO_REPORT_RECEIVERS = None

EPO_USE_WGET_FOR_PUBLICATIONS_DOWNLOAD = True

EPO_PUBLICATION_OBSERVERS = []
EPO_PUBLICATION_SUCCESS_EXTRA_OBSERVERS = []

EPO_EMAIL_ONLY_PRINT = False
EPO_PUBLICATION_NOTIFICATIONS_ONLY_PRINT = False

#media root in case of wagtail images
MEDIA_ROOT = '/home/epo/media'

EPO_EDITION_NEW_STYLE = False

EPO_ENABLE_SQL_LOGGING = False

EPO_PUBLISHED_CONTENT_CACHE = 60 * 60 * 24

EPO_PUBLICATION_DEPENDENCIES_TIMEOUT = 60 * 10

EPO_PUBLICATION_RECHECK_OLDER_THAN = 60 * 30

EPO_PUBLICATION_REMOVE_OLDER_SUCCESS = 60 * 60 * 24


EPO_FRONT_PROFILE_ENABLE = True

EPO_USERAPI_FORCE_SECURE = True

EPO_USERAPI_IMAGES_LIMIT = 100

EPO_ZONES = ('main', 'search', 'user')

EPO_STATIC_CELERY_PROCESSES = 1
EPO_APP_CELERY_INDEXER_PROCESSES = 1
EPO_APP_CELERY_PUBLISHER_PROCESSES = 1
EPO_APP_CELERY_WARMER_PROCESSES = 1


DATABASES = {
    'default': lazy_setting('EPO_DEFAULT_DATABASE'),
}


# yes, it looks strange here with all entries set to default, but it can be modified further down the line
# by other applications (like USPP)
DATABASE_APPS_MAPPING = {
    'api': 'default',
    'common': 'default',
    'editor': 'default',
    'front': 'default',
    'reader': 'default',
    'repository': 'default',
    'riddle': 'default',
    'tickets': 'default',
    'editstore': 'default',
    # TODO: this should be full module path here, but router should be improved to support that
    'admin': 'default',
    'auth': 'default',
    'contenttypes': 'default',
    'sessions': 'default',
    'sites': 'default',
    'health_check': 'default',
    'south': 'default',
    'begin': 'default',
    # Celery
    'djcelery': 'default',
    'celery': 'default',
    # Wagtail
    'taggit': 'default',
    'wagtailcore': 'default',
    'wagtaildocs': 'default',
    'wagtailusers': 'default',
    'wagtailimages': 'default',
    'wagtailembeds': 'default',
    'wagtailsearch': 'default',
    'wagtailredirects': 'default',
    'wagtailforms': 'default',
    'kombu_transport_django': 'default',
    'publication': 'default',
    #'': 'default',
    #cassandra mappings
    'userapi': 'cassandra',
}


DATABASE_ROUTERS = ['common.router.DatabaseAppsRouter']

# it can be overriden in local.py
EPO_ACTIVE_ZONES = '-'.join(EPO_ZONES)

EPO_ZONE_MAIN = lazy_eval("'main' in EPO_ACTIVE_ZONES")
EPO_ZONE_USER = lazy_eval("'user' in EPO_ACTIVE_ZONES")
EPO_ZONE_SEARCH = lazy_eval("'search' in EPO_ACTIVE_ZONES")

REDIS_TWEMPROXY = {
    "redis_twemproxy": {
        "BACKEND": "redis_cache.cache.RedisCache",
        "LOCATION": "127.0.0.1:6380:0",
    }
}

SESSION_ENGINE = "django.contrib.sessions.backends.cache"

SESSION_CACHE_ALIAS = "redis_twemproxy"

EPO_AUTH_INTERNAL_ACCESS_HEADER = 'HTTP_X_INTERNAL'

EPO_PUBLICATIONS_OTHER_INSTANCE_DOMAIN = None
EPO_PUBLICATIONS_OTHER_INSTANCE_OBSERVERS = []
EPO_PUBLICATIONS_CREATE_WOMI_SOURCE_ZIPS = True

DEFAULT_HAYSTACK_CONNECTIONS = {
    'default': {
        'ENGINE': 'haystack.backends.simple_backend.SimpleEngine',
    },
}

EPO_REGISTRATION_FORM_TYPE = 'native'

EPO_JIRA_NOTIFICATIONS = []

EPO_PUBLICATION_AUTO_MOBILE = True

EPO_BEGIN_DEFAULT_TTL = "1m"
