from __future__ import absolute_import

from django.apps import AppConfig

class EditStoreConfig(AppConfig):
    name = 'editstore'
    label = 'editstore'

    def ready(self):
        from . import signals
