# coding=utf-8
from auth.utils import epo_auth_required
from django.shortcuts import render
import editstore.objects
from editstore.decorators import driver_method
from editcommon.decorators import must_revalidate_headers


from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

@epo_auth_required(profile='default')
@must_revalidate_headers
@driver_method(category='collection')
def editcoll(request, driver):

    return render(request, 'editcoll.html', {
        'space_driver': driver.space_driver,
        'category_driver': driver.category_driver,
        'driver': driver,
        'editor_driver': driver.leading_editor,
        'navbar_chosen': 'editor',
        'explicit_start_edit': True,
    })
