# coding: utf-8
from django import forms
from . import models
from django.forms import widgets

class PublicationForm(forms.Form):

    PUBLISH = 'publish'
    CANCEL = 'cancel'
    RESTART = 'restart'
    FORGET = 'forget'

    OPERATIONS = (
        (PUBLISH, 'publish'),
        (CANCEL, 'cancel'),
        (RESTART, 'restart'),
        (FORGET, 'forget'),
    )

    operation = forms.ChoiceField(label='Operacja', choices=OPERATIONS, widget=widgets.HiddenInput)


