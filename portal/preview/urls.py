from __future__ import absolute_import

from django.conf.urls import patterns, url, include
from reader.womireader import WomiReader
from surround.django.views import DeprecatedAddress

from . import volatile_models
from . import views

urlpatterns = patterns('preview.views',
                       views.bound_views.collection_details_url,

                       url(r'^api/mobile/descriptor/(?P<identifier>\w+)/(?P<version>\d+)', 'mobile_descriptor', name='mobile_descriptor'),
                       url(r'^reader/', include(views.bound_views.www_urlpattens)),

                       url(r'^reader/(?P<collection_id>\w+)/(?P<version>\w+)/(?P<variant>(\w|-)+)/(?P<module_id>\w+)$', DeprecatedAddress.as_view(new_view_name='preview_module_reader')),
)

