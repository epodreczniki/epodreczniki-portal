from django.conf.urls import patterns, url

urlpatterns = patterns('emulation.views',
                       url(r'^portal/(?P<path>other/etx/.*)$', 'static'),
                       url(r'^.*$', 'redirect_domain'),
)
