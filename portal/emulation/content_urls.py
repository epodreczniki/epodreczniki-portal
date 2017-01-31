from django.conf.urls import patterns, url

urlpatterns = patterns('emulation.views',
                       url(r'^global/libraries/(?P<path>.*)$', 'global_libs'),
                       url(r'^(?P<path>.*)$', 'content'),
)
