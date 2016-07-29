from django.conf.urls import patterns, url, include
from django.conf import settings

urlpatterns = patterns('editres.views',
    url(r'^welcome$', 'landing_page'),
    url(r'^dashboard$', 'dashboard', name='editres_dashboard'),

    url(r'^space/(?P<spaceid>\w+)$', 'space_main'),

    url(r'^list/(?P<spaceid>\w+)/(?P<category>collection|module|womi)$', 'listing'),
    url(r'^edit/(?P<spaceid>\w+)/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', 'edit'),

    url(r'^wizard/preview/(?P<spaceid>\w+)/module/(?P<identifier>\w+)/(?P<version>\w+)$', 'preview_module_selection'),
    url(r'^wizard/delete/space/(?P<spaceid>\w+)', 'space_delete_wizard'),
    url(r'^wizard/seal/(?P<spaceid>\w+)/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)', 'seal_wizard'),

    url(r'^find/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', 'find_object'),

    url(r'^pack/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', 'generate_package'),

    url(r'^esi/stream/(?P<stream_key>(?:\w|-|\.)+)$', 'stream_provider', name='editres_stream_provider'),
)


if settings.EPO_EDITRES_PRESENT_LABELS:

    urlpatterns += patterns('editres.views',
        url(r'^change-label/(?P<spaceid>\w+)/(?P<category>collection|module|womi)/(?P<identifier>\w+)/(?P<version>\w+)$', 'change_user_label'),
    )

