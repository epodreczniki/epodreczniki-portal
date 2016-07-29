from django.conf.urls import *

# place app url patterns here
urlpatterns = patterns('edittext.views',
    url(r'^normal/(?P<spaceid>\w+)/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', 'edittext'),
    url(r'^womi/womi/(?P<spaceid>\w+)/(?P<identifier>\w+)/(?P<version>\w+)$', 'editwomi'),
)
