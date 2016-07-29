from __future__ import absolute_import

from django.apps import AppConfig

class StoreConfig(AppConfig):
    name = 'store'
    label = 'store'

    def ready(self):
        from . import signals
