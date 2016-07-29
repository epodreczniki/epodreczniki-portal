from __future__ import absolute_import
from .base import BaseDriver
from repo.utils import RepoObjectDriver

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class DummyDriver(BaseDriver):

    can_create_new_objects_lines = False


