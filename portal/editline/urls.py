from django.conf.urls import patterns, url

urlpatterns = patterns('editline.views',
                       url(r'^editor/(?P<spaceid>\w+)/(?P<identifier>\w+)/(?P<version>\w+)$', 'editor')#,
                       #url(r'^editor/xopus/(?P<path>.*)$', 'global_libs')
)

