from django.conf.urls import patterns, url

urlpatterns = patterns('emulation.views',
                       url(r'^content/(?P<path>.*)$', 'content'),
                       url(r'^global/libraries/(?P<path>.*)$', 'global_libs')
)
