# coding=utf-8
from __future__ import absolute_import

import store.signals
from . import views

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

store.signals.connect_presentation_purges(store.signals.object_purge, views.bound_views, sender='edition')

def purge(sender, category, identifier, version, **kwargs):
    from editcommon import parsers
    parsers.EditCommonParser.purge_receiver(sender, category, identifier, version, **kwargs)

store.signals.object_reload.connect(purge)


def cascade_collections_on_module_modify(sender, category, identifier, version, **kwargs):
    from . import tasks
    if category == 'module':
        debug('scheduling cascade check of collections using: %s:%s:%s', category, identifier, version)
        tasks.cascade_collections_on_module_modify.delay(category, identifier, version)


store.signals.object_dependencies.connect(cascade_collections_on_module_modify, sender='edition')


