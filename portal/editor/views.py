import json

from auth.utils import epo_auth_required
from django.conf import settings
from django.shortcuts import render
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from surround.django import redis
from surround.django.logging import setupModuleLogger
from django.http import HttpResponse
from editor import keys
from editstore.decorators import driver_method
from editcommon.decorators import must_revalidate_headers

setupModuleLogger(globals())

BASE_URL = 'http://' + settings.HOSTS['content_repository'][0] + '/repo/'

@epo_auth_required(profile='default')
@must_revalidate_headers
@driver_method(must_exist=True, category='module')
def editor(request, driver):
    return render(request, 'editor2.html', { 'driver': driver })


@redis.cache_result(60 * 30, key=keys.folders)
def get_folders():
    r = requests.get(BASE_URL + 'folders', timeout=60)
    r.raise_for_status()
    return r.json()


@redis.cache_result(60 * 10, key=keys.search + 'q:{query}')
def search_womi(query):
    url = BASE_URL + 'searchwomi'

    if query:
        url = '%s?%s' % (url, query)

    debug('requesting: %s', url)

    r = requests.get(url, timeout=30)
    r.raise_for_status()
    return r.json()


@epo_auth_required(profile='default')
@api_view(['GET'])
def folders(request):
    return Response(get_folders())


def wrap_into_jsonp(request, name, result):
    if "jsonFeed" in request.GET:
        return HttpResponse('%s(%s)' % (name, json.dumps(result)), content_type="application/x-javascript")

    return Response(result)


@epo_auth_required(profile='default')
@api_view(['GET'])
def foldersforxopus(request):
    return wrap_into_jsonp(request, 'jsonFoldersFeed', get_folders())



@epo_auth_required(profile='default')
@api_view(['GET'])
def searchwomi(request):
    return Response(search_womi(request.GET.urlencode()))


@epo_auth_required(profile='default')
@api_view(['GET'])
def searchforxopus(request):
    return wrap_into_jsonp(request, 'jsonWOMIFeed', search_womi(request.GET.urlencode()))




