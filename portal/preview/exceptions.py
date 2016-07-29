# coding=utf-8

from common.exceptions import NiceException
from django.http import Http404

class PreviewNiceException(NiceException):
    lead = 'Podgląd treści'

class EditedVersionDoesNotExist(NiceException, Http404):
    lead = 'Podgląd treści'
    title = 'Obiekt nie podlega aktualnie edycji'
    status = 404
    template_name = 'exceptions/edited_does_not_exist.html'
