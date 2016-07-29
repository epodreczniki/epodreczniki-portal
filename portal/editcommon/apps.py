from __future__ import absolute_import

from django.apps import AppConfig

class EditCommonConfig(AppConfig):
    name = 'editcommon'
    label = 'editcommon'

    def ready(self):
        from . import signals
