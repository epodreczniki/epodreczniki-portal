# coding=utf-8

from django.core.exceptions import PermissionDenied
from django.http import Http404
from common.exceptions import NiceException as CommonNiceException

class NiceException(CommonNiceException):
    lead = 'Edycja Online'


class StoreException(Exception):
    pass


class InvalidOperationException(StoreException, NiceException):

    title = 'Niepoprawna operacja'
    status = 503

class InsufficientPermissionsException(StoreException, PermissionDenied, NiceException):

    title = u'Obiekt nie jest dostępny'
    status = 403

class DoesNotExist(StoreException, Http404):
    pass

class ObjectAlreadyExist(InvalidOperationException, NiceException):

    title = 'Obiekt już istnieje'
    status = 500

class ValidationFailureException(InvalidOperationException, NiceException):

    title = 'Wystąpił błąd podczas walidacji'
    status = 400


class WomiIdNotFoundInStore(Http404):
    def __init__(self):
        self.message = 'Womi ID does not exist in store, wrong id'

    def __str__(self):
        return repr(self.message)



class FileNotFound(Http404):
    def __init__(self, message='file not found in womi'):
        self.message = message

    def __str__(self):
        return repr(self.message)


class FileNotRemoveable(Exception):
    pass
