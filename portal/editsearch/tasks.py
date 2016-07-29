from __future__ import absolute_import

from celery import shared_task

from . import utils

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


@shared_task(ignore_result=True, queue='indexer')
def edit_index_all(self):
    utils.get_index_driver().index_all()


@shared_task(ignore_result=True, queue='indexer')
def edit_validate_index(self):
    utils.get_index_driver().validate_index()


@shared_task(ignore_result=True, queue='indexer')
def edit_index_kzd():
    utils.get_index_driver().index_kzd()

