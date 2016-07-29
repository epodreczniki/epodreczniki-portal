from __future__ import absolute_import

from django.conf.urls import patterns, url, include
from django.conf import settings

urlpatterns = patterns('editcommon.views',
    url(r'^api/object/(?P<category>\w+)/(?P<identifier>\w+)/(?P<version>\d+)', include(patterns('editcommon.views',
        url('/descriptor$', 'search_descriptor', name='search_descriptor'),
        url('/state$', 'state_descriptor', name='state_descriptor'),
        url('/referables/xml$', 'referables_listing'),
        url('/womis-deep$', 'referred_womis_deep_listing'),
    ))),
    url(r'^api/interlinks', 'interlinks_service', name='interlinks_service'),
    url(r'^api/kzd/categories', 'kzd_category_list', name='kzd_category_list'),
)

if settings.EPO_ENABLE_EDITCOMMON_TEST:
    urlpatterns += patterns('editcommon.views',
        url(r'^test/womi_dialog$', 'test'),
        url(r'^test/res_lister$', 'reslister'),
        url(r'^test/locks$', 'locks')
    )
