# -*- coding: utf-8 -*-

import ast
from common.kzd import KZD_CATEGORIES
from django import forms


class ResourceEditForm(forms.Form):
    title = forms.CharField(label=u"Tytuł", max_length=250)
    author = forms.CharField(label=u"Autor", max_length=150)
    description = forms.CharField(label=u"Opis", widget=forms.Textarea(attrs={'rows':3}))
    keywords = forms.CharField(label=u'Słowa kluczowe')
    alt = forms.CharField(label=u"Tekst alternatywny", widget=forms.Textarea(attrs={'rows':3}))
    category = forms.ChoiceField(label=u"Kategoria", choices=[ (c.key, "%s (%s)" % (c.label, c.key)) for c in KZD_CATEGORIES.values() ])
    learning_objectives = forms.CharField(label="Podstawa programowa", widget=forms.MultipleHiddenInput)
    thumbnail_ftp_path = forms.CharField(label=u"Okładka", max_length=200)


    def __init__(self, *args, **kwargs):
        super(forms.Form, self).__init__(*args, **kwargs)


    def rewrite_fields(self, resource):
        if not resource.loaded:
            resource.load()

        resource.title = self.cleaned_data['title']
        resource.author = self.cleaned_data['author']
        resource.description = self.cleaned_data['description']
        resource.keywords = self.cleaned_data['keywords']
        resource.alt = self.cleaned_data['alt']
        resource.category = self.cleaned_data['category']
        resource.learning_objectives = [ uspp.strip() for uspp in ast.literal_eval(self.cleaned_data['learning_objectives']) ]
        resource.thumbnail_ftp_path = self.cleaned_data['thumbnail_ftp_path']

