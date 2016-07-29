from django.conf.urls import patterns, url
from editsearch.views import query_repo

urlpatterns = patterns('',
    url(r'^query/$', query_repo, name='query-index'),
)
