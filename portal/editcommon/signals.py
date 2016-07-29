# coding=utf-8
from __future__ import absolute_import

import store.signals
from . import views

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

def purge_referables_listing(sender, category, identifier, version, **kwargs):
    views.referables_listing.purge(category=category, identifier=identifier, version=version)

store.signals.object_reload.connect(purge_referables_listing)

def purge_state_line_descriptor(sender, category, identifier, version, **kwargs):
    debug('purging state descriptor for %s:%s - all versions', category, identifier)
    views.state_descriptor.purge(category=category, identifier=identifier, version='*')

store.signals.object_dependencies.connect(purge_state_line_descriptor)
