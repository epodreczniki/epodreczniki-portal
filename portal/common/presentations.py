from __future__ import absolute_import

from common.models import Config
from django.utils.functional import cached_property
from common.model_mixins import FIRST_VARIANT
from django_hosts.reverse import reverse_full
from common import models
from django.http import Http404
from django.conf import settings

FIXED_VERSION_MODE = 'fixed'
LATEST_VERSION_MODE = 'latest'
HIDDEN_VERSION_MODE = 'hidden'

class CommonPresentationMixin(object):
    config = Config


class ModuleOccurrencePresentationDriver(CommonPresentationMixin):


    @cached_property
    def module_occurrence(self):
        return self.collection_presentation.collection.get_module_occurrence_or_404(self.module_id, with_volatile=True)

    @cached_property
    def module(self):
        return self.module_occurrence.module

    @property
    def collection(self):
        return self.collection_presentation.collection


    def __init__(self, collection_presentation, module_id):
        self.collection_presentation = collection_presentation
        self.module_id = module_id

    @classmethod
    def bind_from_object(cls, collection_presentation, module_occurrence):
        presentation = cls(collection_presentation, module_id=module_occurrence.module.identifier)
        presentation.module_occurrence = module_occurrence
        return presentation


    @cached_property
    def url(self):
        return 'http:' + reverse_full('www', self.config.MODULE_VIEW_NAME, view_kwargs={'collection_id': self.collection_presentation.identifier,
                                                                   'version': self.collection_presentation.public_version,
                                                                   'variant': self.collection_presentation.variant,
                                                                   'module_id': self.module_id})




class CollectionPresentationDriver(CommonPresentationMixin):

    module_occurrence_presentation_driver_class = ModuleOccurrencePresentationDriver
    category = 'collection'

    VARIANT_SHORT_IDENTIFIERS_MAP = {
        'student': 'UCZNIOWSKI',
        'student-canon': 'UCZNIOWSKI',
        'student-expanding': 'UCZNIOWSKI',
        'student-supplemental': 'UCZNIOWSKI',
        'teacher': 'NAUCZYCIELSKI',
        'teacher-canon': 'NAUCZYCIELSKI',
        'teacher-expanding': 'NAUCZYCIELSKI',
        'teacher-supplemental': 'NAUCZYCIELSKI',
    }

    def __init__(self, identifier, version, variant, version_mode=FIXED_VERSION_MODE, prefetch_modules=False):
        self.identifier = identifier
        self.version = version
        self.variant = variant
        self.version_mode = version_mode
        self.prefetch_modules = prefetch_modules

    @classmethod
    def bind_from_object(cls, collection, **kwargs):
        presentation = cls(identifier=collection.identifier, version=collection.version, variant=collection.variant, **kwargs)
        presentation.collection = collection
        return presentation





    @cached_property
    def public_version(self):

        if self.version_mode == FIXED_VERSION_MODE:
            return self.version

        return self.version_mode

    @cached_property
    def collection(self):
        return self.config.get_collection_variant_or_404(self.identifier, self.version, self.variant, prefetch_modules=self.prefetch_modules)

    @property
    def content(self):
        return self.collection

    def bind_module_or_404(self, module_id):
        return self.module_occurrence_presentation_driver_class(self, module_id)

    @property
    def module_occurrences_presentations(self):
        for module_occurrence in self.collection.get_all_module_occurrences():
            yield self.module_occurrence_presentation_driver_class.bind_from_object(self, module_occurrence)


    @cached_property
    def read_url(self):
        if self.collection.is_emergency_hosted_collection:
            return reverse_full('www', 'reader.views.emergency_reader', view_kwargs={'collection_id': self.identifier,
                                                        'version': self.version,
                                                        'variant': self.variant})

        try:
            first_module = next(self.collection.get_all_module_occurrences())
            # TODO: optimize here
            return self.bind_module_or_404(first_module.module.md_content_id).url
        except StopIteration:
            return None


    @property
    def nice_short_variant_name(self):
        return self.VARIANT_SHORT_IDENTIFIERS_MAP.get(self.variant, 'nieznany wariant')

    @cached_property
    def detail_url(self):
        if self.collection.is_emergency_hosted_collection:
            return reverse_full('www', 'reader.views.emergency_reader', view_kwargs={'collection_id': self.identifier,
                                                        'version': self.version,
                                                        'variant': self.variant})

        return reverse_full('www', self.config.VARIANT_DETAILS_VIEW, view_kwargs={
            'collection_id': self.identifier,
            'version': self.public_version,
            'variant': self.variant})


    @cached_property
    def sibling_variants(self):
        # TODO: optimize here
        return [ self.__class__(self.identifier, self.version, sibling.variant, version_mode=self.version_mode) for sibling in self.collection.sibling_variants ]

    @classmethod
    def translate_version(cls, identifier, version, allow_non_fixed_version=True):
        try:
            fixed_version = int(version)
            version_mode = FIXED_VERSION_MODE
        except ValueError:
            if not allow_non_fixed_version:
                raise ValueError('version %s is not allowed here' % version)
            version_mode = version
            version = cls.translate_non_fixed_version(identifier, version_mode)

        return version, version_mode

    @classmethod
    def translate_non_fixed_version(cls, identifier, version_mode):
        try:
            if version_mode == LATEST_VERSION_MODE:
                # TODO: optimize here
                return models.Collection.objects.filter(md_content_id=identifier, md_published=True).latest('md_version').md_version

            if settings.SURROUND_EXPERIMENTALS_ENABLED and version_mode == HIDDEN_VERSION_MODE:
                # TODO: optimize here
                collection = models.Collection.objects.filter(md_content_id=identifier).latest('md_version')
                if collection.md_published:
                    raise Http404('no collections exist matching %s' % identifier)
                return collection.md_version

        except models.Collection.DoesNotExist:
            raise Http404('no collections exist matching %s' % identifier)

        raise Http404('invalid version given: %s' % version_mode)

    @classmethod
    def bind_collection_or_404(cls, identifier, version, variant=FIRST_VARIANT, allow_non_fixed_version=True, prefetch_modules=False):
        version, version_mode = cls.translate_version(identifier, version, allow_non_fixed_version=allow_non_fixed_version)

        if variant == FIRST_VARIANT:
            variant = cls.config.get_first_collection_variant_name_or_404(identifier, version)

        return cls(identifier, version, variant, version_mode=version_mode, prefetch_modules=prefetch_modules)

    @classmethod
    def bind_module_occurrence_or_404(cls, identifier, version, variant, module_id, allow_non_fixed_version=True, prefetch_modules=False):
        return cls.bind_collection_or_404(identifier, version, variant=variant, allow_non_fixed_version=allow_non_fixed_version, prefetch_modules=prefetch_modules).bind_module_or_404(module_id)

    @cached_property
    def collection_header_womi(self):
        return self.collection.single_referred_womi_or_none(models.WomiReference.COLLECTION_HEADER_KIND)

    @cached_property
    def collection_toc_womi(self):
        return self.collection.single_referred_womi_or_none(models.WomiReference.COLLECTION_TOC_KIND)


class WomiPresentationDriver(CommonPresentationMixin):

    category = 'womi'

    def __init__(self, identifier, version, version_mode=FIXED_VERSION_MODE):
        self.identifier = identifier
        self.version = version
        self.version_mode = version_mode

    @classmethod
    def bind_or_404(cls, identifier, version):
        return cls(identifier, version)

    @cached_property
    def womi(self):
        return self.config.get_womi_or_404(self.identifier, self.version)

    @property
    def content(self):
        return self.womi

    @cached_property
    def read_url(self):
        return None



bind_collection_or_404 = CollectionPresentationDriver.bind_collection_or_404
bind_womi_or_404 = WomiPresentationDriver.bind_or_404
bind_module_occurrence_or_404 = CollectionPresentationDriver.bind_module_occurrence_or_404
