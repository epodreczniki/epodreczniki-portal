from __future__ import absolute_import

import celery
from celery import shared_task
from .models import Publication
from .utils import PublicationContext
from .utils import publication_command

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


@shared_task(queue='publisher', ignore_result=True)
def recheck_all_objects_waiting_on_dependencies():

    PublicationContext.recheck_all_objects_waiting_on_dependencies()


@shared_task(queue='publisher', ignore_result=True)
def remove_old_successed_publications():

    PublicationContext.remove_old_successed_publications()

@shared_task(queue='publisher', ignore_result=True)
def send_periodic_publication_report():

    PublicationContext.send_periodic_publication_report()

