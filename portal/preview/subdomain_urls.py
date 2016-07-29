from django.conf.urls import patterns, url
from django.conf import settings

urlpatterns = patterns('preview.subdomain_views',
                       url(r'^content/collection/(?P<collection_id>\w+)/(?P<version>\w+)/(?P<variant>(\w|-)+)/(?P<module_id>\w+)/module\.html$', 'preview_module_html'),
                       url(r'^content/collection/(?P<collection_id>\w+)/(?P<version>\w+)/(?P<variant>(\w|-)+)/(?P<module_id>\w+)/module\.xml$', 'preview_transformed_module_xml'),
                       url(r'^content/collection/(?P<collection_id>\w+)/(?P<version>\w+)/(?P<variant>(\w|-)+)/collection.xml$', 'preview_transformed_collection_xml'),
                       url(r'^content/collection/(?P<collection_id>\w+)/(?P<version>\w+)/(?P<variant>(\w|-)+)/(?P<emission_format>[\w\d\.-]+)$', 'collection_emission_format'),
                       url(r'^content/collection/(?P<collection_id>\w+)/(?P<version>\w+)/metadata.xml$', 'collection_metadata_xml'),

)

if not settings.SURROUND_RUNNING_ON_PLATFORM:
    urlpatterns += patterns('preview.subdomain_views',
        url(r'^content/collection/(?P<identifier>\w+)/(?P<version>\w+)/collection.xml$', 'present_collection_xml'),
        url(r'^content/module/(?P<identifier>\w+)/(?P<version>\w+)/module.xml$', 'present_module_xml'),
        url(r'^content/womi/(?P<identifier>\w+)/(?P<version>\d+)/(?P<womi_path>.*)$', 'present_womi_file'),
        url(r'^content/womi/(?P<identifier>\w+)/(?P<womi_path>.*)$', 'legacy_present_womi_file'),
    )

if 'emulation' in settings.INSTALLED_APPS:
    urlpatterns += patterns('emulation.views',
                           url(r'^global/libraries/(?P<path>.*)$', 'global_libs')
    )

urlpatterns += patterns('preview.subdomain_views',
                        url(r'^(?P<path>.*)$', 'preview_other'),
)
