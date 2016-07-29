# coding=utf-8
from __future__ import absolute_import

from django.http.response import Http404
from store.exceptions import NiceException

class RepositoryNotFound(Http404):
    pass

class ObjectFileUnavailableException(NiceException):
    status = 404

class InvalidObjectException(Exception):
    pass

