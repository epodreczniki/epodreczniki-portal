# coding=utf-8
from __future__ import absolute_import

from django.dispatch import Signal

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

object_published = Signal(providing_args=['driver'])
