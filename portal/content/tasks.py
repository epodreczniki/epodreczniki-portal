from __future__ import absolute_import

from celery import shared_task

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


@shared_task(queue='static', ignore_result=True)
def freeze_listing(driver):
    driver.freeze_listing(propagate=True)


@shared_task(queue='warmer', ignore_result=True)
def warm_cache(driver):
    driver.warm_cache()


@shared_task(queue='static', ignore_result=True)
def fix_files(driver):
    driver.redownload_files_if_invalid(propagate=True)


@shared_task(queue='purger', ignore_result=True)
def purge_cache(driver):
    driver.purge_cache()
