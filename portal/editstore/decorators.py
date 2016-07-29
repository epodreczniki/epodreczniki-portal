# coding=utf-8
from __future__ import absolute_import

from django.shortcuts import render
from store.exceptions import NiceException
import functools
from editstore.objects import drivers, SpaceDriver
from editstore import models
from django.shortcuts import get_object_or_404
from editstore import exceptions
from common.utils import wrap_nice_exceptions
from django.shortcuts import redirect

from common import messages

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

wrap_edition_errors = wrap_nice_exceptions


def fetch_from_dict(kwargs, key):
    value = kwargs[key]
    del kwargs[key]
    return value

def space_method(must_have_write=None, must_have_read=True):

    def decorator(view):

        @functools.wraps(view)
        def wrapper(request, **kwargs):
            spaceid = fetch_from_dict(kwargs, 'spaceid')
            space = get_object_or_404(models.Space, identifier=spaceid)
            space_driver = SpaceDriver.bind_db_object(space, user=request.user)
            kwargs['space_driver'] = space_driver

            if must_have_read is True:
                space_driver.raise_for_read_perm()

            if must_have_write is True:
                space_driver.raise_for_write_perm()

            return view(request, **kwargs)

        return wrapper

    return decorator


def driver_method(must_exist=True, must_have_write=None, must_have_read=True, category=None, use_space=True, redirect_missing=False):


    def decorator(view):

        @functools.wraps(view)
        def wrapper(request, **kwargs):

            if use_space:
                space = get_object_or_404(models.Space, identifier=fetch_from_dict(kwargs, 'spaceid'))
            else:
                space = None

            driver = drivers.bind(
                fetch_from_dict(kwargs, 'category') if category is None else category,
                fetch_from_dict(kwargs, 'identifier'),
                fetch_from_dict(kwargs, 'version'),
                request.user,
                space=space,
            )

            if must_exist is True:
                try:
                    driver.raise_for_exists()
                except exceptions.DoesNotExist as e:
                    if redirect_missing and request.method == 'GET':
                        driver_class = drivers.get(driver.category)
                        messages.info(request, u'%s %s, wersja %s nie znajduje się w edycji online' % (driver_class.nice_name, driver.identifier, driver.version), extra_tags='danger')
                        return redirect('editres.views.listing', driver.spaceid, driver.category)
                    raise

                if use_space:
                    driver.raise_for_space()


            if must_exist is False:
                if driver.exists:
                    raise exceptions.ObjectAlreadyExist('%s %s/%s already exists' % (driver.category, driver.identifier, driver.version))

            if must_have_read is True:
                driver.raise_for_read_perm()

            if must_have_write is True:
                driver.raise_for_write_perm()

            kwargs['driver'] = driver

            return view(request, **kwargs)

        return wrapper

    return decorator
