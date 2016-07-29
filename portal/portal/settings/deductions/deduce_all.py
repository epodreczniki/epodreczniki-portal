from __future__ import print_function
from ..misc.utils import deduce

resolver = Resolver(globals())

deduce('local', globals())
HOSTS = resolver.resolve(HOSTS)
deduce('dev', globals())
deduce('cassandra', globals())
deduce('elasticsearch', globals())
deduce('common', globals())
deduce('preview', globals())
deduce('solr', globals())
deduce('editsearch', globals())

ROLES = resolver.resolve(ROLES)
HOSTS = resolver.resolve(HOSTS)

deduce('roles', globals())

# PRAGMA: PUBLIC-NO-SECTION-START
if SURROUND_RUNNING_ON_PLATFORM and SURROUND_ENABLE_COROUTINE_ON_PLATFORM:
    SURROUND_COROUTINE_IMPLEMENTATION_MODULE = 'surround.django.coroutine.gevent'
else:
    SURROUND_COROUTINE_IMPLEMENTATION_MODULE = 'surround.django.coroutine.simple'

if SURROUND_RUNNING_ON_PLATFORM:
    SURROUND_ESI_IMPLEMENTATION_MODULE = 'surround.django.esi.varnish'
else:
    SURROUND_ESI_IMPLEMENTATION_MODULE = 'surround.django.esi.simple'

if SURROUND_RUNNING_ON_PLATFORM:
    SURROUND_HTTPCACHE_IMPLEMENTATION_MODULE = 'surround.django.platform_cache.varnish'
else:
    SURROUND_HTTPCACHE_IMPLEMENTATION_MODULE = 'surround.django.platform_cache.simple'

# SURROUND_COROUTINE_IMPLEMENTATION_MODULE = 'surround.django.coroutine.simple'
# SURROUND_ESI_IMPLEMENTATION_MODULE = 'surround.django.esi.simple'
# SURROUND_HTTPCACHE_IMPLEMENTATION_MODULE = 'surround.django.platform_cache.simple'

resolver.resolve_in_place(globals())

