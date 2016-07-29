from django_hosts import patterns, host
from django.conf import settings
import re
from surround.django.utils import regex_domain, subdomain

# IMPORTANT NOTICE: beware that django_hosts appends (\.|$) to any given host regex


host_patterns = patterns('',
                         host(subdomain(r'www'), 'portal.urls', name='www'),
                         host(subdomain(r'api'), 'api.urls', name='api'),
                         host(subdomain(r'dev'), 'api.doc_urls', name='dev'),
)

host_patterns += patterns('', host(subdomain(r'preview'), 'preview.subdomain_urls', name='preview'))

if settings.EPO_ENABLE_EDITION:
    host_patterns += patterns('', host(subdomain(r'edit'), 'editstore.subdomain_urls', name='edit'))

host_patterns += patterns('', host(subdomain(r'user'), 'user.subdomain_urls', name='user'))
host_patterns += patterns('', host(subdomain(r'search'), 'search.subdomain_urls', name='search'))


host_patterns += patterns('', host(subdomain(r'repo'), 'repo.subdomain_urls', name='repo'))



if 'emulation' in settings.INSTALLED_APPS:
    host_patterns += patterns('',
                              host(subdomain(r'static'), 'emulation.static_urls', name='static'),
                              host(subdomain(r'content'), 'emulation.content_urls', name='content'),
                              host(r'^(?:' + regex_domain(settings.TOP_DOMAIN) + r'|(?:(?:.*\.)?localhost(?::\d+)?))', 'emulation.redirect_domain_urls', name='domain_redirect'),
    )


host_patterns += patterns('', host(r'.*', 'surround.django.basic.invalid_subdomain_urls', name='invalid'))
