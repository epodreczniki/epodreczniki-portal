# Create your views here.
import json
from auth.utils import epo_auth_required
from django.http import HttpResponse, HttpResponseServerError
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from editstore.exceptions import OtherWriteLockException
from editstore.locks import ObjectLock
from editstore.objects import drivers
from editstore.decorators import wrap_edition_errors
from store.exceptions import InvalidOperationException
from common import messages
from surround.django.decorators import never_cache_headers
from editstore import locks
from editstore.decorators import driver_method
from django.views.generic import View
from django.utils.functional import cached_property


class TextEditorView(View):

    template = 'edittext.html'

    def get(self, request, driver):
        try:
            lockpayload = driver.lock.read()
        except OtherWriteLockException as e:
            lockpayload = None

        path = request.GET.get('file_path', None)
        file_driver = driver.bind_file_driver(path)
        content = file_driver.content

        return render(request, self.template, {
            'path': path,
            'content': content,
            'presentation_driver': driver.space_driver,
            'space_driver': driver.space_driver,
            'category_driver': driver.category_driver,
            'driver': driver,
            'editor_driver': file_driver.text_editor,
            'navbar_chosen': 'editor',
            'lock': json.dumps(lockpayload) if lockpayload else None,
        })


edittext = epo_auth_required(profile='default')(never_cache_headers(driver_method(must_exist=True)(TextEditorView.as_view())))
editwomi = epo_auth_required(profile='default')(never_cache_headers(driver_method(must_exist=True, category='womi')(TextEditorView.as_view(template='editwomi.html'))))


