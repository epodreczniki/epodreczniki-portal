# coding=utf-8
from __future__ import absolute_import

import publication.signals
from search.tasks import index_collection

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

def index_collection_signal(sender, driver, published, **kwargs):
    info('indexing collection(s) with %s', driver)
    index_collection.delay(driver.identifier, driver.version)

publication.signals.object_published.connect(index_collection_signal)
