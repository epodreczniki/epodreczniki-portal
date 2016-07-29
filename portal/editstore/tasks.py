# coding=utf-8
from __future__ import absolute_import

from celery import shared_task
from common import messaging

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

@shared_task(queue='indexer', ignore_result=True)
def cascade_collections_on_module_modify(category, identifier, version):
    from . import objects
    from editcommon.views import referables_listing
    driver = objects.drivers.module(identifier, version)

    for d in driver.get_referencing_collections_drivers(list_all=True, with_dummy=True):
        debug('change in %s cascades notification for %s', driver, d)
        messaging.publish_json('collection.dependencies-modified', subsystem='edition', collection_id=d.identifier, collection_version=d.version)

        referables_listing.purge(category=d.category, identifier=d.identifier, version=d.version)
