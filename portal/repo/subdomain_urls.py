from django.conf.urls import patterns, url

urlpatterns = patterns('repo.views',
                       url(r'^content/womi/(?P<womi_id>\w+)/(?P<version>\d+)/(?P<womi_path>.*)$', 'present_womi_file'),
                       url(r'^content/collection/(?P<collection_id>\w+)/(?P<version>\w+)/collection.xml$', 'present_collection_xml'),
                       url(r'^content/module/(?P<module_id>\w+)/(?P<version>\w+)/module.xml$', 'present_module_xml'),
)

