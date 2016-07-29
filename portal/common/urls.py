from django.conf.urls import patterns, url

urlpatterns = patterns('common.views',
                       # contactForm ends with '/' so that cookies (CSRF) are set *only* for this path, see settings
                       url(r'^contactForm/$', 'contact_form'),
                       url(r'^opensearch.xml$', 'opensearch'),
)
