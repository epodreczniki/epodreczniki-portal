from surround.django.utils import lazy_reverse
from django.conf.urls import patterns, include, url
from django.views.generic import RedirectView
from django.views.decorators.cache import never_cache
from django.contrib import admin
import health_check
from health_check.views import home as health_check_home
from portal.sitemap import portal_sitemaps
from django.contrib.sitemaps import views as sitemaps_views
from django.conf import settings
from surround.django.decorators import legacy_cache_page
from surround.django.views import DeprecatedAddress
import surround.django.health.views
from reader.womireader import LegacyWomiReader
from django.contrib.auth.models import Permission
from decorator_include import decorator_include
from django.utils.decorators import decorator_from_middleware
from wagtail.wagtailcore.middleware import SiteMiddleware
from wagtail.wagtailredirects.middleware import RedirectMiddleware

admin.autodiscover()

health_check.autodiscover()

urlpatterns = patterns('',
                       url(r'^reader/', include('reader.urls')),
                       url(r'^common/', include('common.urls')),
                       url(r'^$', legacy_cache_page()(RedirectView.as_view(url=lazy_reverse('wagtail_serve', args=['']), permanent=False))),
                       url(r'^front/', include('front.urls'), name='front_pattern'),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^health$', never_cache(health_check_home), name='health_check_home'),
                       url(r'^health/service/(?P<service>\w+)$', never_cache(surround.django.health.views.check)),
                       url(r'^health/check/gevent$', 'common.views.gevent_check'),
                       url(r'^health/check/coroutine$', 'common.views.coroutine_check'),
                       url(r'^health/check/code(?P<code>[0-9]+)$', 'common.views.code_generator'),
                       url(r'^badbrowser$', 'common.views.badbrowser'),
                       url(r'^begin/', decorator_include((decorator_from_middleware(SiteMiddleware), decorator_from_middleware(RedirectMiddleware)), 'begin.urls')),
                       url(r'^preview/', include('preview.urls')),
                       url(r'^edit/publication/', include('publication.urls')),
)



from preview import volatile_models
urlpatterns += patterns('',
    url(r'^edit$', RedirectView.as_view(url=lazy_reverse('editres.views.landing_page')), name='edition_entry'),
    url(r'^edit/store/', include('editstore.urls')),
    url(r'^edit/coll/', include('editcoll.urls')),
    url(r'^edit/res/', include('editres.urls')),
    url(r'^edit/text/', include('edittext.urls')),
    url(r'^edit/tiles/', include('editor.urls')),
    url(r'^edit/line/', include('editline.urls')),
    url(r'^edit/common/', include('editcommon.urls')),
    url(r'^edit/kzd/', include('editkzd.urls')),
    url(r'^editres$', DeprecatedAddress.as_view(new_view_name='edition_entry')),
    url(r'^editor/womi/preview/preview/(?P<womi_id>\w+)$', DeprecatedAddress.as_view(new_view_name='preview_womi_technical', fixed_kwargs={ 'version': '1' })),
    url(r'^editor/womi/preview/(?P<subdomain_with_optional_port>[:\w]+)/(?P<womi_id>\w+)$', LegacyWomiReader.as_view(config=volatile_models.Config)),
)

if settings.EPO_HAS_DEDICATED_SK:
    urlpatterns += patterns('', url(r'^coding/', include('codingserver.urls')))



# if settings.EPO_ENABLE_EDITSEARCH:
#     urlpatterns += patterns('', url(r'^edit/search/', include('editsearch.urls')))


urlpatterns += patterns('django.contrib.sitemaps.views',
                        url(r'^sitemap\.xml$', legacy_cache_page()(sitemaps_views.index), {'sitemaps': portal_sitemaps, 'sitemap_url_name': 'sitemaps'}),
                        url(r'^sitemap-(?P<section>.+)\.xml$', legacy_cache_page()(sitemaps_views.sitemap), {'sitemaps': portal_sitemaps}, name='sitemaps'),
)


