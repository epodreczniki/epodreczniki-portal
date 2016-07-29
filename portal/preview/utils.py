# coding=utf-8
from __future__ import absolute_import
from surround.django import redis
from preview import keys
from common.model_mixins import SOURCE_VARIANT

import time
from common import messaging
from surround.django.utils import Timer
from . import parsers


from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

def timestamp():
    return time.time()



def prefetch_collection(collection_id, version, variant, modules=False):

    with Timer('collection %s/%s/%s (%s modules) prefetched in' % (collection_id, version, variant, 'with' if modules else 'without'), debug):
        if variant == SOURCE_VARIANT:
            collection = parsers.PreviewContentParser.imported_collection(collection_id, version)
        else:
            collection = parsers.PreviewContentParser.imported_collection_variant(collection_id, version, variant)

        if modules:
            collection.prefetch_modules()

    return collection


class CollectionXMLReferenceMonitor(redis.ReferenceMonitor):

    key = keys.collection_control

    @property
    def collection_id(self):
        return self.args[0]

    @property
    def version(self):
        return self.args[1]

    @redis.notification((0), repeat_timeout=(60 * 60))
    def coding_server(self):
        info('notifying coding server about missing collection %s', self)

        messaging.publish_json('collection.missing', collection_id=self.collection_id,
                                        collection_version=self.version)


    @redis.notification(3 * 60 * 60)
    def admin(self):
        warning('notifying admins about missing collection %s', self)


    @admin.success
    def admin_is_ready(self):
        info('collection %s is available at last', self)


def bare_content_repository_collection(collection_id, version):
    collection = parsers.PreviewContentParser.imported_collection(collection_id, version)
    collection.prefetch_modules()
    return collection


def parsed_collection_metadata(collection_id, version):
    from preview import views
    from repository import utils
    r = redis.get_connection()

    debug('updated %s/%s', collection_id, version)

    r.zadd(keys.collection_lines(), str(collection_id), -float(timestamp()))
    r.zadd(keys.collection_line_versions(collection_id), str(version), float(version))


