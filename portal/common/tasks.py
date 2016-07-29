# coding=utf-8
from __future__ import absolute_import

from celery import shared_task
from datetime import datetime
from surround.django.logging import setupModuleLogger
from django.conf import settings
import django.core.mail
import time
from django.db.models import Q
from common import presentations, utils
from django.core.mail import EmailMessage

setupModuleLogger(globals())


def issue_ping_task():
    n = datetime.now()
    t = timer_task.delay()
    r = t.wait(interval=0.1)
    print(r - n)


@shared_task(ignore_result=True)
def timer_task():
    return datetime.now()


@shared_task()
def health_check(add_info="", error=None):
    info('this is celery cronjob health check%s', add_info)
    if error:
        raise error


@shared_task(queue='mailer', ignore_result=True)
def send_mail_task(subject, message, to, only_print=False, history_line=None, headers=None):
    if not isinstance(to, (list, tuple)):
        to = [to]

    to = [t for t in to if t is not None]

    to = list(set(to)) # remove duplicates
    if history_line is not None:
        if headers is None:
            headers = {}
        history_header = '<%s>' % history_line
        headers['In-Reply-To'] = history_header
        headers['References'] = history_header

    if settings.EPO_EMAIL_ONLY_PRINT or only_print:
        info(u'printing portal email to: %s: %s (%r)\n%s', to, subject, headers, message)
    else:

        info('sending email to: %s', to)
        try:
            email_message = EmailMessage(subject, message, settings.SMTP_CONF["from"], to)
            if headers is not None:
                email_message.extra_headers = headers
            email_message.send()
        except Exception as e:
            error('failed to send email: %s', e)
            raise


def send_mail(*args, **kwargs):
    send_mail_task.delay(*args, **kwargs)


def send_mail_template(subject, to, template_name, context, **kwargs):
    from django.template import Context, loader

    effective_context = { 'subject': subject }
    effective_context.update(context)

    rendered = loader.get_template(template_name).render(Context(effective_context))

    info(u'scheduling sending mail: %s', subject)
    send_mail(subject, rendered, to, **kwargs)





@shared_task(ignore_result=True)
def send_publication_report():

    import common.models

    if not settings.EPO_REPORT_RECEIVERS:
        return

    info('sending publication report')

    published_students = common.models.Collection.objects.filter(variant='student-canon', md_published=True)
    identifiers = published_students.values_list('md_content_id', flat=True).distinct()
    collections = [ published_students.filter(md_content_id=identifier).latest('md_version') for identifier in identifiers ]

    send_mail_template('opublikowane podręczniki na platformie beta', settings.EPO_REPORT_RECEIVERS, 'mails/collections_report.mail', { 'collections': collections })




@shared_task(ignore_result=True)
def hostname2():
    import os
    open("/tmp/test123fasdfad","a").write("[%s] %s\n" % (time.strftime("%c"), __name__))
    return os.popen('hostname').read()


@shared_task(ignore_result=True)
def test():
    raise IOError("test")

@shared_task(ignore_result=True)
def populate_caches_with_collection_modules():
    import common.models
    from common.presentations import LATEST_VERSION_MODE, CollectionPresentationDriver
    from surround.django.platform_cache import warm_cache

    for collection in common.models.Collection.objects.leading().published().all_latest():
        collection_presentation = CollectionPresentationDriver.bind_from_object(collection, version_mode=LATEST_VERSION_MODE)
        # info("querying: %s", collection_presentation.detail_url)
        warm_cache(collection_presentation.detail_url)
        time.sleep(2)
        for module_occurrence_presentation in collection_presentation.module_occurrences_presentations:
            # info("querying: %s", module_occurrence_presentation.url)
            warm_cache(module_occurrence_presentation.url)
            time.sleep(2)


