from __future__ import absolute_import

from django.apps import AppConfig

class SearchConfig(AppConfig):
    name = 'search'
    label = 'search'

    def ready(self):
        from . import signals

