from api.utils import include_docs
from django.conf.urls import patterns, url
from api.views import *

urlpatterns = patterns('api.view2',
    url(r'^home/$', include_docs(home), name='home'),
    url(r'^version/$', include_docs(version), name='version'),
    url(r'^format/$', include_docs(format), name='format'),
    url(r'^source_formats', include_docs(source_formats), name='source_formats'),
    url(r'^index/$', include_docs(root_index), name='root_index'),
    url(r'^$', include_docs(root_index), name='dev_root'),
    url(r'^details/', include_docs(method_detail), name='method_detail'),
)

