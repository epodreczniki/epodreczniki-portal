from django.conf import settings

EXCLUDED_APPS = [
    'rest_framework_docs',
    # 'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.contenttypes',
    # 'django.contrib.sites',
    'riddle',
    'jira',
    'tickets',
    'haystack',
    'emulation',
]

APPS_TO_DUMP = [app for app in settings.INSTALLED_APPS if app not in EXCLUDED_APPS]

MODELS_EXCLUDED = {
    'common': ['Metadata', 'Collection', 'Module', 'SubCollection', 'ModuleOccurrence',
               'Author', 'Keyword', 'CoreCurriculum'],
    'admin': ['ContentType', 'LogEntry'],
    # 'auth': ['Permission', 'Group'],
    # 'auth': ['User', Group'],
}


BEGIN_APPS = (
    'taggit',
    'modelcluster',
    'wagtail.wagtailcore',
    'wagtail.wagtaildocs',
    'wagtail.wagtailsnippets',
    'wagtail.wagtailusers',
    'wagtail.wagtailimages',
    'wagtail.wagtailembeds',
    'wagtail.wagtailsearch',
    'wagtail.wagtailredirects',
    'wagtail.wagtailforms',
    'begin'
)

BEGIN_MEDIA_DIRS = ('images', 'original_images', 'documents')

BEGIN_STATE_PREFIX = 'begin_state'
