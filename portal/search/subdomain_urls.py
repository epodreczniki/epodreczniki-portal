from __future__ import absolute_import

from django.conf.urls import patterns, url, include
from django.conf import settings

urlpatterns = patterns('',
    url(r'^search/classic$', 'search.views.search_tiles', name='classic_search'),
    url(r'^search/classic/(?P<collection_id>\w+)/(?P<version>\w+)/(?P<variant>(?:\w|-)+)/$', 'search.views.search_tiles', name='classic_search_details'),

)

if settings.EPO_ENABLE_EDITSEARCH:
    urlpatterns += patterns('', url(r'^search/edit/', include('editsearch.urls')))
