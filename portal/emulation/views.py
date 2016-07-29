from portal.settings.misc import utils
from django.contrib.staticfiles.views import serve as just_serve
from django.views.static import serve as explicit_serve
from django.views.decorators.clickjacking import xframe_options_exempt
from surround.django.simple_cors.decorators import cors_headers
from django.shortcuts import redirect

from django.http import Http404
import re

@cors_headers(profile='open')
@xframe_options_exempt
def static(request, path):
    return just_serve(request, path)


@cors_headers(profile='open')
@xframe_options_exempt
def content(request, path):
    response = explicit_serve(request, path, document_root=utils.django_project_path_join('static/repository/content'))
    del response['Content-Length']
    return response

@cors_headers(profile='open')
@xframe_options_exempt
def global_libs(request, path):
    #return redirect(settings.STATIC_URL + '3rdparty/' + path)
    return just_serve(request, '3rdparty/' + path)


DOMAIN_PATTERN = re.compile(r'^(?P<prefix>\w+\.)?localhost(?P<suffix>(\w|\.)*)(?P<port>(\:\d+)?)$')

def redirect_domain(request):
    match = DOMAIN_PATTERN.match(request.get_host())
    if not match:
        raise Http404('unmatched domain: %s' % request.get_host())
    prefix = match.group('prefix')
    suffix = match.group('suffix')
    if not prefix or not suffix:
        host = '%s%s%s%s' % ((prefix if prefix else 'www.'), 'localhost', (suffix if suffix else '.epodreczniki.pl'), match.group('port'))
        print('redirect')
        return redirect('http://%s%s' % (host, request.get_full_path()))

    raise Exception('this view (redirect_domain) should not match that domain (%s)' % request.get_host())
