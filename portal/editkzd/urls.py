from django.conf.urls import *


urlpatterns = patterns('editkzd.views',
    url(r'^resource/edit/(?P<womi_id>\w+)/(?P<womi_version>\w+)$', 'edit_resource', name='edit_resource'),
    url(r'^resource/edit/(?P<womi_id>\w+)/(?P<womi_version>\w+)/success$', 'edit_resource_success', name='edit_resource_success'),
    url(r'^resource/delete/(?P<womi_id>\w+)/(?P<womi_version>\w+)$', 'delete_resource', name='delete_resource'),
    url(r'^resource/delete/success$', 'delete_resource_success', name='delete_resource_success'),
    url(r'^resource/(?P<womi_id>\w+)/(?P<womi_version>\w+)$', 'resource_xml', name='resource_xml'),
)
