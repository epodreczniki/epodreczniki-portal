# coding=utf-8
from __future__ import absolute_import

import common.models
import common.model_mixins
from django_hosts.reverse import reverse_full
from common.models import Config
from surround.django import redis
from preview import keys
from surround.django.local_orm import models as local_models
from surround.django import execution
from common.model_mixins import SOURCE_VARIANT
import sys

from . import signals

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class Config(common.models.Config):

    MODULE_VIEW_NAME = 'preview_module_reader'
    VOLATILE_VIEW_NAME = 'preview_volatile_module'
    VARIANT_DETAILS_VIEW = 'preview_variant_details'
    TABLE_OF_CONTENTS_VIEW = 'preview_table_of_contents'
    SUBDOMAIN = 'preview'
    MODELS = sys.modules[__name__]
    VIEWS_BASE_NAME = 'preview'

    is_preview = True
    store_womi_manifest_and_metadata = True

    @classmethod
    def get_first_collection_variant_name_or_404(cls, identifier, version):
        from preview import parsers
        return parsers.PreviewContentParser.get_metadata_xml(identifier, version).variant_names[0]

    @classmethod
    def get_collection_variant_or_404(cls, identifier, version, variant, prefetch_modules=False):
        from preview import utils
        return utils.prefetch_collection(identifier, version, variant, modules=prefetch_modules)

    @classmethod
    def get_module_or_404(cls, identifier, version):
        from preview import parsers
        return parsers.PreviewContentParser.imported_module(identifier, version)

    @classmethod
    def get_womi_or_404(cls, identifier, version):
        from preview import parsers
        return parsers.PreviewContentParser.imported_womi(identifier, version)



class PreviewModel(local_models.Model):
    CONFIG = Config
    # is_lazy = False


class ModuleOccurrence(PreviewModel, common.model_mixins.ModuleOccurrenceMixin, common.model_mixins.WomiReferrerMixin):

    class Meta:
        django_model = common.models.ModuleOccurrence

    def __unicode__(self):
        return u'%s | %d' % (self.sub_collection.md_title, self.value)

    # @property
    # def md_title(self):
    #     return u'Moduł %s' % self.value



class Attribute(PreviewModel):

    class Meta:
        django_model = common.models.Attribute


class Module(PreviewModel, common.model_mixins.ModuleMixin, common.model_mixins.WomiReferrerMixin):

    class Meta:
        django_model = common.models.Module

    def prefetch_all(self):
        execution.multi_lazy_resolve(self.referred_womis)


class Author(common.model_mixins.AuthorMixin, PreviewModel):

    class Meta:
        django_model = common.models.Author

class Authorship(PreviewModel):

    class Meta:
        django_model = common.models.Authorship


class Collection(PreviewModel, common.model_mixins.AttributesOwnerMixin, common.model_mixins.CollectionMixin, common.model_mixins.WomiReferrerMixin):

    class Meta:
        django_model = common.models.Collection


    @property
    def sibling_variants(self):
        from preview import parsers
        from preview import utils

        if self.variant == SOURCE_VARIANT:
            return []

        siblings = []

        for variant in self.metadata_xml.variant_names:
            if variant == self.variant:
                siblings.append(self)
            else:
                siblings.append(parsers.PreviewContentParser.imported_collection_variant(self.md_content_id, self.md_version, variant))

        return siblings


    def prefetch_modules(self):

        execution.multi_lazy_resolve(self.get_all_modules())


    def prefetch_referred_womis(self):

        execution.multi_lazy_resolve(self.referred_womis)


    def prefetch_referred_womis_deep(self, in_modules=False):

        execution.multi_lazy_resolve(self.referred_womis_overall if in_modules else self.referred_womis_in_structure, final_throw_if_any=False)


    def prefetch_all(self):
        self.prefetch_modules()
        self.prefetch_referred_womis_deep(in_modules=True)

    @property
    def referred_womis_deep_overall(self):
        self.prefetch_all()
        return super(Collection, self).referred_womis_deep_overall



    def get_mobile_descriptor_url(self):

        return reverse_full('www', 'preview.views.mobile_descriptor', view_args=[self.md_content_id, self.md_version])


class SubCollection(PreviewModel, common.model_mixins.SubCollectionMixin, common.model_mixins.WomiReferrerMixin):

    class Meta:
        django_model = common.models.SubCollection


class Womi(PreviewModel, common.model_mixins.WomiMixin, common.model_mixins.WomiReferrerMixin):

    class Meta:
        django_model = common.models.Womi

    def prefetch_all(self):
        execution.multi_lazy_resolve(self.referred_womis)


class WomiType(PreviewModel):

    class Meta:
        django_model = common.models.WomiType


class Subject(PreviewModel):

    class Meta:
        django_model = common.models.Subject


class SchoolLevel(PreviewModel, common.model_mixins.SchoolLevelMixin):

    class Meta:
        django_model = common.models.SchoolLevel


class WomiReference(PreviewModel, common.model_mixins.WomiReferenceMixin):

    class Meta:
        django_model = common.models.WomiReference


class CollectionStaticFormat(PreviewModel, common.model_mixins.CollectionStaticFormatMixin):

    class Meta:
        django_model = common.models.CollectionStaticFormat



