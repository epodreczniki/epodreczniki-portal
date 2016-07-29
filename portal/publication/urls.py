from django.conf.urls import patterns
from django.conf.urls import url

PATTERN_PART = r'(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)'
PATTERN_FULL = PATTERN_PART + r'/(?P<aspect>[\w\-]+)'

urlpatterns = patterns('publication.views',
    url(r'^view/' + PATTERN_PART + '$', 'publication_aspects_view', name='publication_aspects_view'),
    url(r'^view/' + PATTERN_FULL+ '$', 'publication_view', name='publication_view'),
    url(r'^find/' + PATTERN_PART + '$', 'redirect_published_or_publish'),
    url(r'^view', 'publication_listing', name='publication_listing'),


    url(r'^api/state/' + PATTERN_FULL + '$', 'publication_state'),
    url(r'^api/multi$', 'publication_multi_state'),

    url(r'^api/execute/' + PATTERN_FULL + '$', 'publication_execute'),
)
