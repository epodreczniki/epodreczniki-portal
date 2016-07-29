from __future__ import absolute_import

from django.conf.urls import patterns, url, include
from django.conf import settings

urlpatterns = patterns('',
    url(r'^auth/', include('auth.urls')),
    url(r'^userapi/', include('userapi.urls')),
)

