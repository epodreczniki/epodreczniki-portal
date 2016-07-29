# coding=utf-8
from __future__ import absolute_import

from django.dispatch import Signal

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

MODIFIED_ARGS = ['category', 'identifier', 'version']

class ComposedSignal(object):

    def __init__(self, providing_args):
        self.signals = []
        self.providing_args = providing_args

    def connect_signal(self, signal):
        self.signals.append(signal)

    def connect(self, receiver, **kwargs):
        signal = Signal(providing_args=self.providing_args)
        signal.connect(receiver, **kwargs)
        self.connect_signal(signal)

    def send(self, sender, **kwargs):
        results = []
        for s in self.signals:
            for r in s.send(sender, **kwargs):
                results.append(r)
        return results

    def send_robust(self, sender, **kwargs):
        results = []
        for s in self.signals:
            for r in s.send_robust(sender, **kwargs):
                results.append(r)
        return results



object_purge = Signal(providing_args=MODIFIED_ARGS)
object_reload = Signal(providing_args=MODIFIED_ARGS)
object_dependencies = Signal(providing_args=MODIFIED_ARGS)

object_added = ComposedSignal(providing_args=MODIFIED_ARGS)
object_modified = ComposedSignal(providing_args=MODIFIED_ARGS)
object_deleted = ComposedSignal(providing_args=MODIFIED_ARGS)




def add_report(signal, action_name):

    def reporter(sender, **kwargs):
        info('%s %s %s %s/%s', sender, action_name, kwargs['category'], kwargs['identifier'], kwargs['version'])

    signal.connect(reporter, weak=False)


add_report(object_added, 'added')
add_report(object_modified, 'modified')
add_report(object_deleted, 'deleted')


object_added.connect_signal(object_purge)
object_added.connect_signal(object_reload)
object_added.connect_signal(object_dependencies)

object_modified.connect_signal(object_purge)
object_modified.connect_signal(object_reload)
object_modified.connect_signal(object_dependencies)

object_deleted.connect_signal(object_purge)
object_deleted.connect_signal(object_dependencies)


def connect_presentation_purges(signal, views, sender):

    def presentation_purger(sender, category, identifier, version, **kwargs):

        if category == 'collection':
            views.present_collection_xml.purge(collection_id=identifier, version=version)
        elif category == 'module':
            views.present_module_xml.purge(module_id=identifier, version=version)
        elif category == 'womi':
            views.present_womi_file.purge(womi_id=identifier, version=version, womi_path='*')


    signal.connect(presentation_purger, sender=sender, weak=False)
