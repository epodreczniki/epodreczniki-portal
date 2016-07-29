# coding: utf-8
from django import forms
from django.forms import widgets

class ChangeLabelForm(forms.Form):
    OPERATIONS = (
        (0, "Dodaj"),
        (1, "Usuń"),
    )

    label = forms.CharField(label='Etykieta', max_length=100)
    operation = forms.ChoiceField(choices=OPERATIONS, initial=0, label='Operacja')

class HiddenForm(forms.Form):
    hidden = forms.CharField(widget=widgets.HiddenInput)






