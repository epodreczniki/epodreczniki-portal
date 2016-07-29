from __future__ import absolute_import

from django.conf import settings
from django.conf.urls import patterns
from django.conf.urls import url
from . import views


urlpatterns = patterns('reader.views',
                       url(r'^utils/av/(?P<path>.*)', 'av_rewrite'),
                       url(r'^e/(?P<collection_id>\w+)/v/(?P<version>\w+)/t/(?P<variant>(?:\w|-)+)/', 'emergency_reader'),

) + views.bound_views.www_urlpattens


