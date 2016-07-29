from __future__ import absolute_import

from django.apps import AppConfig

class RepoConfig(AppConfig):
    name = 'repo'
    label = 'repo'

    def ready(self):
        from . import signals

