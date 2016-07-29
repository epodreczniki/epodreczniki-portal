from django.conf.urls import patterns, url

urlpatterns = patterns('editor.views',
                       url(r'^editor/(?P<spaceid>\w+)/(?P<identifier>\w+)/(?P<version>\w+)$', 'editor'),
                       url(r'^folders$', 'folders'),
                       url(r'^searchwomi$', 'searchwomi'),
                       url(r'^searchforxopus$', 'searchforxopus'),
                       url(r'^foldersforxopus$', 'foldersforxopus'),

)

