# coding=utf-8
from __future__ import absolute_import

import store.signals
from common import messaging

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

def purge(sender, category, identifier, version, **kwargs):
    from . import parsers
    parsers.PreviewContentParser.purge_receiver(sender, category, identifier, version, **kwargs)

store.signals.object_reload.connect(purge)

def collection_monitor_cancelator(sender, category, identifier, version, **kwargs):
    import preview.utils
    if category == 'collection':
        monitor = preview.utils.CollectionXMLReferenceMonitor(identifier, version)
        monitor.cancel()

store.signals.object_reload.connect(collection_monitor_cancelator)

def connect_message_sender(signal, action):

    def message_sender(sender, category, identifier, version, **kwargs):
        messaging.publish_json('%s.%s' % (category, action), subsystem=sender, **{ (category + '_id'): identifier, (category + '_version'): version})

    signal.connect(message_sender, weak=False)

connect_message_sender(store.signals.object_added, 'added')
connect_message_sender(store.signals.object_reload, 'modified')
connect_message_sender(store.signals.object_deleted, 'deleted')

