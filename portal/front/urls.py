from django.conf import settings
from django.conf.urls import patterns
from django.conf.urls import url
from django.views.generic import RedirectView
from . import views as front_views
from surround.django.utils import lazy_reverse
import reader.views

urlpatterns = patterns('front.views',
                       url(r'^$', RedirectView.as_view(url=lazy_reverse('wagtail_serve', args=[''])), name='front_landing_page'),
                       url(r'^education/(?P<education_level>0|1|2|3|4)$', 'new_index', { 'subject': None, 'level': None }),
                       url(r'^education/(?P<education_level>1|2|3|4)/level/(?P<level>\d+)$', 'new_index', { 'subject': None }),
                       url(r'^education/(?P<education_level>1|2|3|4)/subject/(?P<subject>\d+)$', 'new_index', { 'level': None }),
                       url(r'^education/(?P<education_level>1|2|3|4)/level/(?P<level>\d+)/subject/(?P<subject>\d+)$', 'new_index'),

                       reader.views.bound_views.collection_details_url,

                       #url(r'^statistics$', 'statistics'),
                       url(r'^terms$', 'terms'),
                       url(r'^about$', 'about'),
                       url(r'^support$', 'support'),
                       url(r'^privacy$', 'privacy'),

                       url(r'^statistics$', 'statistics'),

                       #url(r'^123$', 'one2three'),

                       url(r'^no-filter|welcome|(level/\d+/subject/\d+)|(level/\w+)|(subject/\d+)$', RedirectView.as_view(url=lazy_reverse('main_index'))), #reverse compatibility
)

if settings.EPO_FRONT_PROFILE_ENABLE:
    urlpatterns += patterns('front.views',
        url(r'^profile$', 'profile'), #the new profile view
    )


urlpatterns += front_views.kzd_views.www_urlpattens


