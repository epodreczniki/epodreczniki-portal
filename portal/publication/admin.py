# coding=utf-8
from __future__ import absolute_import

from django.contrib import admin

from surround.django.basic.admin import action, absolute_link

from . import models

class Publication(admin.ModelAdmin):

    list_display = ('__unicode__', 'status', 'user', 'created', 'last_changed_status', 'last_modified', absolute_link('view'))
    list_filter = ['category', 'status', 'aspect']
    search_fields = ['=identifier']


class PublicationDependency(admin.ModelAdmin):

    list_display = ['__unicode__']
    list_filter = ['dependency__category', 'dependant__category']
    search_fields = ['=dependency__identifier', '=dependant__identifier']

admin.site.register(models.Publication, Publication)
admin.site.register(models.PublicationDependency, PublicationDependency)
