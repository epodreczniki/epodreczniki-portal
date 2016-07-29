# coding=UTF-8
from __future__ import absolute_import
from common import models

from django.shortcuts import render
from .forms import NewContactForm
from django.conf import settings
from surround.django.decorators import legacy_cache_page
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponse
import traceback
from surround.django import coroutine


from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


@csrf_protect
@never_cache
def contact_form(request):
    if request.POST:
        form = NewContactForm(request.POST)
        if form.is_valid():
            form.process(request)
            return render(request, 'contact_form_success.html')
    else:
        form = NewContactForm()

    return render(request, 'contact_form_content.html', {'form': form})

@legacy_cache_page(timeout=86400)
def opensearch(request):
    if settings.TEST_OPEN_SEARCH_EXCEPTION:
        raise Exception('test exception')

    return render(request, 'opensearch.xml', content_type='application/opensearchdescription+xml')


def badbrowser(request):
    return render(request, 'badbrowser.html')




def coroutine_check_helper(number):
    info('coroutine check helper: %s', number)

@never_cache
def coroutine_check(request):
    coroutine.execute_all(coroutine_check_helper, {number: execution.parameters(number) for number in xrange(50)})
    return HttpResponse('OK', content_type='text/plain')


@never_cache
def gevent_check(request):
    try:
        from logging import threading as logging_threading
        import threading as main_threading
        from gevent import threading as gevent_threading
        from gevent.monkey import saved
        from gevent._threading import RLock

        def checker(module):
            return 'module %s: \n%s' % (module, '\n'.join(['%s: %s' % (name, getattr(module, name, None)) for name in ['Lock', 'RLock']]))

        out = '%s\n***\n%s\n***\n%s\n***%s\n' % (
            settings.SURROUND_ENABLE_COROUTINE_ON_PLATFORM,
            RLock,
            '\n'.join(map(checker, [logging_threading, main_threading, gevent_threading])),
            '\n'.join(['%s: %s' % (k, v) for k, v in saved['threading'].items()]),
        )
    except Exception as e:
        out = 'exception: %s\n' % '\n'.join(traceback.format_exc().splitlines())

    return HttpResponse(out, content_type='text/plain')


@never_cache
def code_generator(request, code):
    code = int(code)
    return HttpResponse(content=('CODE %s' % code), status=code, reason=('SYNTHESIZED CODE %s' % code))


class ClassBasedView(object):
    name = 'common'
    config = models.Config

    def cache_view(self, key, timeout):

        def wrapper(view):

            return legacy_cache_page(timeout=timeout)(view)

        return wrapper

