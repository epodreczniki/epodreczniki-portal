# coding=utf-8
from __future__ import absolute_import

from django.db import models
from django.conf import settings
import store.models
from django.core.urlresolvers import reverse


class Space(models.Model):

    identifier = models.CharField(max_length=32, help_text="main identifier", null=False, unique=True)
    label = models.CharField(max_length=100, help_text="label", null=False)

    def __unicode__(self):
        return u'space %s - %s' % (self.identifier, self.label)


    def get_absolute_url(self):
        return reverse('editres.views.space_main', args=[self.identifier])




class ContentObject(store.models.ContentObject):

    space = models.ForeignKey('Space', null=False, blank=False, related_name='content_objects', on_delete=models.PROTECT)

    @classmethod
    def get_drivers(self):
        from . import objects
        return objects.drivers

    def get_absolute_url(self):
        return reverse('editres.views.edit', args=[self.space.identifier, self.category, self.identifier, self.version])







class ContentFile(store.models.ContentFile):

    content_object = models.ForeignKey('ContentObject', null=False, blank=False, related_name='content_files', on_delete=models.CASCADE)

    class Meta:
        unique_together = ('content_object', 'filename')


class UserRoleInSpace(models.Model):

    ADMIN_ROLE = 'admin'
    AUTHOR_ROLE = 'author'
    REVIEWER_ROLE = 'reviewer'
    PUBLISHER_ROLE = 'publisher'
    EDITOR_ROLE = 'editor'

    ROLES = (
        (ADMIN_ROLE, 'administrator'),
        (AUTHOR_ROLE, 'autor'),
        (REVIEWER_ROLE, 'recenzent'),
        (PUBLISHER_ROLE, 'wydawca'),
        (EDITOR_ROLE, 'redaktor'),
    )

    ALL_ROLES = [ role_name for role_name, _ in ROLES ]

    space = models.ForeignKey('Space', null=False, blank=False, related_name='users', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False, related_name='spaces', on_delete=models.CASCADE)
    role = models.CharField(max_length=16, choices=ROLES, null=False)

    class Meta:
        unique_together = ('space', 'user', 'role')
