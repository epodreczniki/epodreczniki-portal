from auth.utils import epo_auth_required
from django.shortcuts import render
from surround.django.decorators import never_cache_headers
from django.conf import settings
import editstore.objects
from editstore.decorators import driver_method
from editcommon.decorators import must_revalidate_headers

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

@epo_auth_required(profile='default')
@must_revalidate_headers
@driver_method(must_exist=True, category='module')
def editor(request, driver):

    return render(request, 'editline_editor.html', {
        'editor_enabled': settings.EPO_ETX_ENABLE,
        'iframe_root': '//%s/portal/other/etx' % settings.EPO_ETX_IFRAME_ACTIVE_DOMAIN,
        'driver': driver,
    })

