from __future__ import absolute_import

from django.apps import AppConfig

class PreviewConfig(AppConfig):
    name = 'preview'
    label = 'preview'

    def ready(self):
        from . import signals

