# coding: utf-8
from django.forms import Textarea
from django.forms.widgets import HiddenInput
from riddle.fields import RiddleField
from django import forms
from tickets.tasks import save_jira_issue
from .tasks import send_mail
from django.template import loader, Context
import re
import hashlib
from datetime import datetime
from django.utils.encoding import smart_bytes

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class NewContactForm(forms.Form):

    TYPES = (
        (0, "Zgłoszenie błędu"),
        (1, "Wyrażenie opinii"),
        (2, "Zgłoszenie pomysłu"),
        (3, "Inne"),
    )

    def __init__(self, *args, **kwargs):
        super(NewContactForm, self).__init__(*args, **kwargs)



    email = forms.EmailField(label='Twój adres e-mail', error_messages={'required': 'To pole jest wymagane.', 'invalid': 'Nieprawidłowy adres e-mail.'})
    message_type = forms.ChoiceField(choices=TYPES, initial=0, label='Typ wiadomości')
    message = forms.CharField(max_length=1000, widget=Textarea(attrs={'maxlength':'1000'}), label='Wiadomość', error_messages={'required': 'To pole jest wymagane.', 'max_length': 'Wiadomość jest zbyt długa.'})
    riddle = RiddleField()

    url = forms.URLField(max_length=1000, widget=HiddenInput(), required=False)
    user_agent = forms.CharField(max_length=300, required=False, widget=HiddenInput())
    width_of_browser = forms.IntegerField(required=False, initial=0, widget=HiddenInput())
    height_of_browser = forms.IntegerField(required=False, initial=0, widget=HiddenInput())

    md_collection_id = forms.CharField(max_length=100, required=False, widget=HiddenInput())
    md_module_id = forms.CharField(max_length=100, required=False, widget=HiddenInput())

    issue_template_name = 'jira_issues/issue.txt'

    contact_email_response_template = 'contact_email_response.txt'

    log_info = ""

    #def __init__(self, *args, **kwargs):
    #    super(NewContactForm, self).__init__(*args, **kwargs)

    #    self.fields.keyOrder = ['message_type', 'message', 'email', 'riddle', 'user_agent',
    #                            'md_module_id', 'md_collection_id', "width_of_browser", "height_of_browser", "url"]

    def process(self, request):

        message_type = int(self.cleaned_data["message_type"])
        message = ""
        if message_type == 4:
            message = "Plagiat: "
        message = message + self.cleaned_data["message"]

        summary = message[:50]
        summary = re.sub(r'(\r\n|\n|\r)+', ' ', summary)

        template = loader.get_template(self.issue_template_name)
        context = Context({
            'form': self,
            'cleaned': self.cleaned_data,
        })
        description = unicode(template.render(context))
        description = re.sub(r'(\r\n|\n|\r){2,}', r'\n\n', description)

        issue_type = 'Bug'
        if message_type == 1:
            issue_type = 'Story'
        if message_type == 2:
            issue_type = 'New Feature'

        md5 = hashlib.md5()
        md5.update(smart_bytes(summary))
        md5.update(str(datetime.now()))
        identifier = md5.hexdigest()

        info('new issue received: (%s) %s regarding %s from %s: %s', identifier, issue_type, self.cleaned_data["url"], self.cleaned_data["email"], description)
        save_jira_issue.delay(summary, description, issue_type, identifier)

        subject = u'Potwierdzenie wysłania zgłoszenia - epodreczniki.pl'

        email_template = loader.get_template(self.contact_email_response_template)
        email_context = Context({
            #'identifier': identifier,
            #'summary': summary
        })
        message_contents = unicode(email_template.render(email_context))

        send_mail(subject, message_contents, self.cleaned_data["email"])



class ReaderContactForm(NewContactForm):

    issue_template_name = 'jira_issues/module_issues.txt'

    TYPES_READER = (
        (0, "Zgłoszenie błędu"),
        (1, "Wyrażenie opinii"),
        (2, "Zgłoszenie pomysłu"),
        (3, "Inne"),
        (4, "Plagiat"),
    )

    def __init__(self, *args, **kwargs):
        self.module_occurrence = kwargs.pop('module_occurrence')
        super(ReaderContactForm, self).__init__(*args, **kwargs)

    message_type = forms.ChoiceField(choices=TYPES_READER, initial=0, label='Typ wiadomości')
