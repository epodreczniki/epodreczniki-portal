# coding=utf-8
from __future__ import absolute_import

from django.db import models
from django.utils import timezone

from django.utils.functional import cached_property
from django.core.urlresolvers import reverse
from . import exceptions

from django.conf import settings



class Publication(models.Model):

    WOMI_CATEGORY = 'w'
    MODULE_CATEGORY = 'm'
    COLLECTION_CATEGORY = 'c'

    CATEGORY = (
        (WOMI_CATEGORY, 'womi'),
        (MODULE_CATEGORY, 'module'),
        (COLLECTION_CATEGORY, 'collection'),
    )

    CATEGORY_RDICT = { fullname: code for code, fullname in CATEGORY }



    INITIAL = 'i'
    FETCHING = 'c'
    DEPENDENCIES = 'n'
    PROCESSING = 'p'
    VERIFYING = 'v'
    FAILED = 'f'
    SUCCESS = 's'
    CANCELED = 'd'


    STATUS_TYPES = (
        (INITIAL, 'initial'),
        (FETCHING, 'fetching'),
        (DEPENDENCIES, 'dependencies'),
        (PROCESSING, 'processing'),
        (VERIFYING, 'verifying'),
        (FAILED, 'failed'),
        (SUCCESS, 'success'),
        (CANCELED, 'canceled'),
    )

    MISSING = 'missing'
    EDITED = 'edited'
    SEALED = 'sealed'
    READY = 'ready'
    PUBLISHED = 'published'
    EXECUTED = 'executed'
    STALE = 'stale'
    INVALID = 'invalid'


    STATUSES = { name: status for status, name in STATUS_TYPES }
    STATUSES_NAMES = { name: name for _, name in STATUS_TYPES }
    STATUSES_REVERSE = { status: name for status, name in STATUS_TYPES }

    identifier = models.CharField(max_length=100, help_text='main identifier', verbose_name='identifier')
    version = models.DecimalField(max_digits=6, decimal_places=0, help_text='version', verbose_name='version')
    category = models.CharField(max_length=1, choices=CATEGORY, help_text='category', verbose_name='category')
    aspect = models.CharField(max_length=64, help_text='aspect', verbose_name='aspect')

    status = models.CharField(max_length=1, choices=STATUS_TYPES, help_text='status type', verbose_name='status type', null=False, default=INITIAL)

    last_modified = models.DateTimeField(help_text='last modified', verbose_name='last modified', auto_now=True, blank=True)
    created = models.DateTimeField(help_text='created', verbose_name='created', default=timezone.now)
    last_processed = models.DateTimeField(help_text='last time task on was ran (updated by wrapper)', verbose_name='last processed', null=True, blank=True)
    last_function = models.CharField(max_length=100, help_text='last function', verbose_name='last function triggered on this task', null=True, blank=True)
    last_exception = models.TextField(help_text='last exception', verbose_name='last exception triggered on this task', null=True, blank=True)
    last_changed_status = models.DateTimeField(help_text='last time status was changed', verbose_name='status change', blank=True, default=timezone.now)

    flow_id = models.CharField(max_length=32, help_text='currently running edition', null=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name='publications', on_delete=models.SET_NULL)

    edition_timestamp = models.DateTimeField(help_text='timestamp of imported edition', verbose_name='imported timestamp', null=True, blank=True, default=None)

    class Meta:
        unique_together = ('category', 'identifier', 'version', 'aspect')

    def __unicode__(self):
        return u'%s:%s:%s:%s %s (%s)' % (self.real_category, self.identifier, self.version, self.aspect, self.get_status_display(), self.flow_id)

    @cached_property
    def driver(self):
        from . import objects
        return objects.drivers.bind(self.real_category, self.identifier, self.version, self.aspect)

    @property
    def real_category(self):
        return self.get_category_display()

    @cached_property
    def context(self):
        from . import utils
        return utils.PublicationContext.bind_publication_obj(self)


    def get_absolute_url(self):

        return reverse('publication.views.publication_view', args=[self.real_category, self.identifier, self.version, self.aspect])


class PublicationDependency(models.Model):

    dependant = models.ForeignKey(Publication, null=False, related_name='dependencies', on_delete=models.CASCADE)
    dependency = models.ForeignKey(Publication, null=False, related_name='dependants', on_delete=models.CASCADE)

    @property
    def dependant_context(self):
        from . import utils
        return utils.PublicationContext.bind_publication_obj(self.dependant)

    @property
    def dependency_context(self):
        from . import utils
        return utils.PublicationContext.bind_publication_obj(self.dependency)

    def __unicode__(self):
        return u'%s on %s' % (self.dependant, self.dependency)
