from __future__ import absolute_import

from django.apps import AppConfig

class FrontConfig(AppConfig):
    name = 'front'
    label = 'front'

    def ready(self):
        from . import signals

