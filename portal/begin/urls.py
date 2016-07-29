from django.conf.urls import patterns, include, url

from wagtail.wagtailadmin import urls as wagtailadmin_urls
from wagtail.wagtailsearch import urls as wagtailsearch_urls
from wagtail.wagtaildocs import urls as wagtaildocs_urls
from wagtail.wagtailcore import urls as wagtail_urls


urlpatterns = patterns('',
                       url(r'^intro/$', 'begin.views.intro', name='begin_intro'),
                       url(r'^licenses/$', 'begin.views.licenses', name='begin_licenses'),
                       url(r'^data-protection/$', 'begin.views.data_protection', name='begin_data_protection'),
                       url(r'^copyright-exceptions/$', 'begin.views.copyright_exceptions', name='begin_copyright_exceptions'),
                       url(r'^wagtail-admin/snippets/choose/(?P<content_type_app_name>begin)/(?P<content_type_model_name>extraitemgroup)/$', 'begin.views.choose_snippet', name='begin_choose_snippet'),
                       url(r'^wagtail-admin/', include(wagtailadmin_urls)),
                       url(r'^wagtail-search/', include(wagtailsearch_urls)),
                       url(r'^wagtail-documents/', include(wagtaildocs_urls)),
                       url(r'^static/(?P<path>.*)$', 'begin.views.image_serve', name='images_serve'),
                       url(r'', include(wagtail_urls)),
                       )

