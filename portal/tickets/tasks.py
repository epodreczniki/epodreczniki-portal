# coding=UTF-8
from __future__ import absolute_import
from celery import shared_task
from surround.django.logging import setupModuleLogger
from jira import client
from django.conf import settings

setupModuleLogger(globals())


@shared_task(rate_limit="1/m", queue='mailer', ignore_result=True)
def save_jira_issue(summary, description, issue_type, identifier):
    if settings.EPO_JIRA_OUTPUT_PROJECT is None:
        return None
    from common.tasks import send_mail_template

    jira_system_key = settings.EPO_JIRA_OUTPUT_PROJECT['key']
    jira = client.JIRA(options={ 'server': settings.JIRA_SERVER }, basic_auth=settings.JIRA_AUTH)
    #TODO: add user names to cc list
    issue = {'project': {'key': jira_system_key}, 'summary': summary, 'description': description,
             'issuetype': {'name': issue_type}}
    obj = jira.create_issue(issue)
    # cc_array = [{'name': ''}, ]
    # obj.update(customfield_10081=cc_array)

    info('created jira issue: %s for issue %s', obj.key, identifier)

    send_mail_template('[epodreczniki-formularz] %s: %s' % (obj.key, summary), settings.EPO_JIRA_NOTIFICATIONS, 'mails/issue_created.mail', {
        'url': obj.permalink(),
        'description': description,
    })

    return obj.key

