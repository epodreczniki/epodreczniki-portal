from django.conf.urls import patterns, url

urlpatterns = patterns('editcoll.views',
    url(r'^(?P<spaceid>\w+)/(?P<identifier>\w+)/(?P<version>\w+)$', 'editcoll'),
)

