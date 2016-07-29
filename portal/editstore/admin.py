# coding=utf-8
from __future__ import absolute_import

from django.contrib import admin

from surround.django.basic.admin import action

from . import models

class CustomContentObject(admin.ModelAdmin):

    list_filter = ('category', )
    search_fields = ('identifier', 'version', 'space__identifier')
    list_display = ('category', 'identifier', 'version', 'space')


admin.site.register(models.ContentObject, CustomContentObject)
admin.site.register(models.ContentFile, admin.ModelAdmin)
admin.site.register(models.Space, admin.ModelAdmin)
admin.site.register(models.UserRoleInSpace, admin.ModelAdmin)
