# coding=utf-8

from __future__ import absolute_import

from django.db import models
from django.utils.functional import cached_property

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class ContentObject(models.Model):

    CATEGORIES = (
        ('collection', 'collection'),
        ('module', 'module'),
        ('womi', 'womi'),
    )

    category = models.CharField(max_length=16, choices=CATEGORIES, null=False)
    identifier = models.CharField(max_length=64, help_text="object's identifier", null=False)
    version = models.DecimalField(max_digits=6, decimal_places=0, help_text="object's version", null=False)

    class Meta:
        unique_together = ('category', 'identifier', 'version')
        abstract = True

    @cached_property
    def driver(self):
        return self.bind_driver()

    def bind_driver(self, **kwargs):
        return self.get_drivers().bind(self.category, self.identifier, self.version, **kwargs)

    @property
    def parsed_object(self):
        return self.driver.parsed_object

    def __unicode__(self):
        return u'%s %s:%s - %s' % (self.category, self.identifier, self.version, self.driver.title)


class ContentFile(models.Model):

    filename = models.CharField(max_length=1024, help_text="full file path", null=False)

    class Meta:
        abstract = True

    def __unicode__(self):
        return u'%s - %s' % (self.content_object, self.filename)

    @cached_property
    def driver(self):
        return self.bind_driver()

    def bind_driver(self, **kwargs):
        return self.content_object.bind_driver(**kwargs).bind_file_driver(self.filename)
