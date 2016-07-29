from __future__ import absolute_import

from django.conf.urls import patterns, url, include
from django.conf import settings

urlpatterns = patterns('codingserver.views',
    url(r'^api/index/(?P<identifier>\w+)/(?P<version>\d+)/(?P<variant>(\w|-)+)', 'collection_index'),
)

