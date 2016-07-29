from __future__ import absolute_import

from .views import bound_views

urlpatterns = bound_views.bind_subdomain_urlpatterns()
