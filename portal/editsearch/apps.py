from __future__ import absolute_import

from django.apps import AppConfig

class EditSearchConfig(AppConfig):
    name = 'editsearch'
    label = 'editsearch'

    def ready(self):
        from . import signals

