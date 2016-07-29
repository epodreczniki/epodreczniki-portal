from __future__ import absolute_import

from celery import shared_task

from . import parsers

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


@shared_task(queue='indexer', ignore_result=True)
def process_collection(collection_id, collection_version, variant):
    collection = parsers.PreviewContentParser.imported_collection_variant(collection_id, collection_version, variant)
    info('processed collection in preview: %s', collection)
