# coding=utf-8
from __future__ import print_function

from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django_hosts.reverse import reverse_full
from django.http import Http404
from common import model_mixins
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.shortcuts import get_object_or_404
import sys
from django.utils.functional import cached_property
from django.db.models import Q
from collections import OrderedDict

from django.dispatch import receiver

import operator

from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())



class Config(object):
    MODULE_VIEW_NAME = 'reader_module_reader'
    VOLATILE_VIEW_NAME = 'reader_volatile_module'
    VARIANT_DETAILS_VIEW = 'reader_variant_details'
    TABLE_OF_CONTENTS_VIEW = 'reader_table_of_contents'
    SUBDOMAIN = 'content'
    MODELS = sys.modules[__name__]
    VIEWS_BASE_NAME = 'reader'

    is_preview = False
    store_womi_manifest_and_metadata = False


    @classmethod
    def get_first_collection_variant_name_or_404(cls, identifier, version):
        try:
            return Collection.objects.filter(md_content_id=identifier, md_version=version).order_by('variant')[0].variant
        except IndexError as e:
            raise Http404(Collection.DoesNotExist(e))

    @classmethod
    def get_collection_first_variant_or_404(cls, identifier, version, prefetch_modules=False):
        return cls.get_collection_variant_or_404(identifier, version, variant=cls.get_first_collection_variant_name_or_404(identifier, version), prefetch_modules=prefetch_modules)


    @classmethod
    def get_collection_variant_or_404(cls, identifier, version, variant, prefetch_modules=False):
        try:
            return Collection.objects.select_related('root_collection').get(md_content_id=identifier, md_version=version, variant=variant)
        except Collection.DoesNotExist as e:
            raise Http404(e)


    @classmethod
    def get_module_or_404(cls, identifier, version):
        return get_object_or_404(Module, md_content_id=identifier, md_version=version)

    @classmethod
    def get_womi_or_404(cls, identifier, version):
        return get_object_or_404(Womi, womi_id=identifier, version=version)


    @classmethod
    def get_module_occurrence_or_404(cls, identifier, version, variant, module_id, with_volatile=False):
        return cls.get_collection_variant_or_404(identifier, version, variant).get_module_occurrence_or_404(module_id, with_volatile=with_volatile)


    @classmethod
    def get_presentations(cls):
        from common import presentations
        return presentations

    @classmethod
    def view_name(cls, name):
        return '%s_%s' % (cls.VIEWS_BASE_NAME, name)

    @classmethod
    def womi_embed_view(cls):
        return cls.view_name('womi_embed')



EPOCH_DEFAULT = '1970-01-01T00:00:00.000+0000'


class Author(model_mixins.AuthorMixin, models.Model):

    kind = models.SmallIntegerField(choices=model_mixins.AuthorMixin.KINDS, default=model_mixins.AuthorMixin.PERSON_KIND, null=False)

    md_first_name = models.CharField(max_length=256, verbose_name='first name')
    md_surname = models.CharField(max_length=256, verbose_name='surname', blank=True)
    md_institution = models.CharField(max_length=256, blank=True, verbose_name='institution')
    md_email = models.EmailField(verbose_name='email')
    md_full_name = models.CharField(max_length=512, verbose_name='full name')

    class Meta:
        unique_together = ('kind', 'md_first_name', 'md_surname', 'md_institution', 'md_email', 'md_full_name')

    def __unicode__(self):
        return u'%s %s%s' % (self.md_first_name, self.md_surname, ((u" (%s)" % self.md_institution) if self.md_institution else ''))


class Authorship(models.Model):

    authored_content_type = models.ForeignKey(ContentType, null=True)
    authored_content_id = models.PositiveIntegerField(null=True)
    authored_content = GenericForeignKey('authored_content_type', 'authored_content_id')

    author = models.ForeignKey(Author, related_name='authorships', null=False, blank=False, on_delete=models.PROTECT)

    role_type = models.CharField(max_length=192, verbose_name="role's type", null=False, blank=False)

    order_number = models.PositiveIntegerField(default=1)
    role_number = models.PositiveIntegerField(default=1)

    def __unicode__(self):
        return u'%s in %s of %s [%d:%d]' % (self.author, self.role_type, self.authored_content, self.order_number, self.role_number)

    class Meta:
        ordering = ['order_number']
        index_together = ('authored_content_type', 'authored_content_id')



class AuthoredContent(models.Model):

    class Meta:
        abstract = True

    authorships = GenericRelation('Authorship',
                               content_type_field='authored_content_type',
                               object_id_field='authored_content_id')

    edition_timestamp = models.DateTimeField(help_text='timestamp of imported edition', verbose_name='imported timestamp', null=True, blank=True, default=None)

    def authors(self):
        return [authorship.author for authorship in self.authorships.all()]



class SchoolLevel(models.Model, model_mixins.SchoolLevelMixin):

    TYPES = (
        ('I', 'Wczesnoszkolna'),
        ('II', 'Podstawowa'),
        ('III', 'Gimnazjum'),
        ('IV', 'Ponadgimnazjalna')
    )

    CODE_MAPPINGS = {
        'I': 1,
        'II': 2,
        'III': 3,
        'IV': 4
    }

    TYPES_MAP = { k: v for k, v in TYPES }

    REVERSE_CODE_MAPPINGS = { v: k for k, v in CODE_MAPPINGS.items() }


    # CAUTION: new fields added here will not be filled in preview, since
    # instances of that class there are created on-the-fly based on attributes
    # passed to get/get_or_create functions. See also Subject class
    md_education_level = models.CharField(max_length=256, choices=TYPES, default='I')
    ep_class = models.PositiveSmallIntegerField(null=True)

    def __unicode__(self):
        result = u'Poziom nauczania %s - %s' % (self.md_education_level, self.get_md_education_level_display())
        if self.ep_class is not None:
            result += u' klasa %d' % self.ep_class
        return result


    def class_human_readable_form(self):
        return 'Klasa %d' % self.ep_class if self.ep_class is not None else ''

    def get_school_type(self):
        return self.get_md_education_level_display()

    def get_simple_form(self):
        result = u'Szkoła %s' % self.get_md_education_level_display().lower()
        if self.ep_class is not None:
            result += u' - klasa %d' % self.ep_class
        return result

    def for_details(self):
        return '%s_Klasa_%s' % (self.get_md_education_level_display(), self.ep_class) if self.ep_class is not None else self.get_md_education_level_display()

    def list_specific_classes(self):
        return [school_level.ep_class for school_level in SchoolLevel.objects.filter(md_education_level=self.md_education_level).exclude(ep_class=None)]

    class Meta:
        ordering = ['md_education_level', 'ep_class']


class Subject(models.Model):

    # CAUTION: the same as with SchoolLevel
    md_name = models.CharField(max_length=256)
    ordering = models.PositiveSmallIntegerField(default=0)

    def __unicode__(self):
        return self.md_name

    class Meta:
        ordering = ['ordering']


class Keyword(models.Model):
    md_name = models.CharField(max_length=256)

    def __unicode__(self):
        return self.md_name



class AttributesOwner(models.Model, model_mixins.AttributesOwnerMixin):

    class Meta:
        abstract = True

    attributes = GenericRelation('Attribute',
                               content_type_field='attribute_owner_type',
                               object_id_field='attribute_owner_id')

    def get_attribute_value(self, name, default=None):
        try:
            return self.attributes.get(name=name).value
        except Attribute.DoesNotExist:
            return default


class Attribute(models.Model):
    value = models.TextField(help_text='attribute\'s value')
    name = models.CharField(max_length=48, help_text='attribute\'s name')

    present_in_toc = models.BooleanField(help_text='whether to present value in table of contents', default=False)

    attribute_owner_type = models.ForeignKey(ContentType, null=True)
    attribute_owner_id = models.PositiveIntegerField(null=True)
    attribute_owner = GenericForeignKey('attribute_owner_type', 'attribute_owner_id')

    def __unicode__(self):
        return u'(toc: %s) %s=%s' % ('yes' if self.present_in_toc else 'no', self.name, self.value)

    class Meta:
        unique_together = ('name', 'attribute_owner_type', 'attribute_owner_id')


class Metadata(models.Model):
    md_content_id = models.CharField(max_length=100, help_text='main identifier', verbose_name='content id')
    md_title = models.CharField(max_length=256, help_text='title of collection/module', verbose_name='title')
    md_abstract = models.TextField(blank=True, null=True, help_text='abstract of collection/module', verbose_name='abstract')
    md_school = models.ForeignKey(SchoolLevel, blank=True, null=True, help_text='related School object', verbose_name='school', on_delete=models.PROTECT)
    md_subject = models.ForeignKey(Subject, blank=True, null=True, help_text='related Subject object', verbose_name='subject', on_delete=models.PROTECT)

    md_published = models.BooleanField(help_text='tells if collection/module is published for public', verbose_name='published', default=False)
    md_version = models.DecimalField(max_digits=6, decimal_places=0, help_text='version of collection/module', verbose_name='version')
    ep_version = models.DecimalField(max_digits=6, decimal_places=1, help_text='version of epXML schema', verbose_name='schema version')
    LANGUAGES = (
        ('pl', 'polski'),
        ('en', 'english')
    )
    md_language = models.CharField(max_length=256, choices=LANGUAGES, default='pl',
                                   help_text='language of collection/module', verbose_name='language')
    md_license = models.CharField(max_length=256, help_text='link or short description of collection/module license', verbose_name='license')
    md_keywords = models.ManyToManyField(Keyword, blank=True, help_text='related list of Keyword objects<term>', verbose_name='keywords')
    md_created = models.DateTimeField(help_text='date of creation', verbose_name='created')
    md_revised = models.DateTimeField(help_text='date of last touch', verbose_name='revised')
    ep_imports = models.CharField(max_length=1024, default='mathjax;qml;pl_generator;pl_interactive')
    ep_recipient = models.CharField(max_length=256, blank=True, help_text='kind of recipient of this collection/module')
    ep_content_status = models.CharField(max_length=256, blank=True, help_text='content status of collection/module')
    ep_testing_content = models.BooleanField(default=True, help_text='tells if collection/nodule is a testing content, and should be marked as such')

    class Meta:
        abstract = True

    def __unicode__(self):
        return u'[%s:%s] %s' % (self.md_content_id, self.md_version, self.md_title)



class CoreCurriculum(models.Model):
    md_education_level = models.CharField(max_length=4, help_text='education level')
    ep_core_curriculum_subject = models.CharField(max_length=64, help_text='subject')
    ep_core_curriculum_code = models.CharField(max_length=16, help_text='core curriculum code')
    ep_core_curriculum_keyword = models.CharField(max_length=1024, help_text='core curriculum keyword')

    def __unicode__(self):
        return u'%s - %s: %s' % (self.md_education_level, self.ep_core_curriculum_code, self.ep_core_curriculum_subject)


class WomiReferrer(models.Model, model_mixins.WomiReferrerMixin):

    class Meta:
        abstract = True

    womi_references = GenericRelation('WomiReference',
                               content_type_field='referrer_type',
                               object_id_field='referrer_id')


    @property
    def womi_references_prefetch_related_womi(self):
        # return self.womi_references.prefetch_related('womi')
        return self.womi_references.select_related('womi')



class Module(Metadata, AuthoredContent, AttributesOwner, WomiReferrer, model_mixins.ModuleMixin):

    CONFIG = Config

    ep_core_curriculum_entries = models.ManyToManyField(CoreCurriculum, blank=True, null=True,
                                                        help_text='list of related core curriculums')
    ep_presentation_type = models.CharField(max_length=32, help_text='the /document/metadata/ep:e-textbook-module/ep:presentation/ep:type field of epxml', default=None, null=True, blank=True)
    ep_presentation_template = models.CharField(max_length=32, help_text='the /document/metadata/ep:e-textbook-module/ep:presentation/ep:template field of epxml', default=None, null=True, blank=True)
    is_auto_generated = models.BooleanField(default=False, null=False)

    class Meta:
        unique_together = ('md_content_id', 'md_version')




class SubCollection(AttributesOwner, WomiReferrer, model_mixins.SubCollectionMixin):

    md_title = models.CharField(max_length=256)
    parent_collection = models.ForeignKey('self', null=True, blank=True, related_name='subcollections', on_delete=models.CASCADE)
    collection_variant = models.ForeignKey('Collection', null=True, blank=True, related_name='subcollections', on_delete=models.CASCADE)
    order_value = models.IntegerField(default=1)


    def __unicode__(self):
        return u'%s %d' % (self.md_title, self.order_value)


class CollectionQuerySet(models.QuerySet):

    def leading(self):
        return self.filter(Q(variant__exact='student') | Q(variant__exact='student-canon'))

    def published(self):
        return self.filter(md_published=True)

    def official(self):
        return self.filter(ep_dummy=False).exclude(md_subject=None)

    def first_volumes(self):
        return self.exclude(volume__gt=1)

    def all_latest(self, refetch=False):
        results = OrderedDict()
        if refetch:
            for obj in self.values('md_content_id', 'md_version', 'id'):
                try:
                    current_obj = results[obj['md_content_id']]
                except KeyError:
                    pass
                else:
                    if current_obj['md_version'] > obj['md_version']:
                        continue

                results[obj['md_content_id']] = obj

            orderings = self.query.order_by

            result = self.model.objects.filter(id__in=[c['id'] for c in results.values()])
            if orderings:
                result = result.order_by(*orderings)
            return result


        for obj in self.all():
            try:
                if results[obj.identifier].version > obj.version:
                    continue
            except KeyError:
                pass

            results[obj.identifier] = obj

        return results.values()


    # possible approach based on SQL
    # extra(where=['not exists (select 1 from "COMMON_COLLECTION" t2 where t2."MD_CONTENT_ID" = "COMMON_COLLECTION"."MD_CONTENT_ID" and t2.MD_VERSION > "COMMON_COLLECTION"."MD_VERSION" and t2."MD_PUBLISHED" = \'1\')']


# TODO: consider index_together on md_content_id and md_version (maybe something else also)
class Collection(Metadata, AuthoredContent, AttributesOwner, WomiReferrer, model_mixins.CollectionMixin):

    CONFIG = Config

    objects = CollectionQuerySet.as_manager()

    IMG_TYPES = (
        ('svg', 'svg'),
        ('jpg', 'jpg'),
        ('png', 'png')
    )

    REGULAR_KIND = 0
    HELP_KIND = 1
    EXTRA_KIND = 2
    EXPERIMENTAL_KIND = 3

    KINDS = (
        (REGULAR_KIND, 'regular'),
        (HELP_KIND, 'help'),
        (EXTRA_KIND, 'extra'),
        (EXPERIMENTAL_KIND, 'experimental'),
    )

    md_subtitle = models.CharField(null=True, blank=True, max_length=1024, help_text='subtitle of this collection', verbose_name='subtitle')
    md_institution = models.CharField(null=True, blank=True, max_length=128, help_text='collection\'s institution', verbose_name='institution')
    root_collection = models.OneToOneField(SubCollection, related_name='owning_collection')

    ep_cover_type = models.CharField(choices=IMG_TYPES, null=True, blank=True, max_length=4, default=None,
                                     help_text='extension of cover image', verbose_name='cover type')
    ep_stylesheet = models.CharField(default='standard', null=True, blank=True, max_length=64,
                                     help_text='collection\'s stylesheet name', verbose_name='stylesheet')
    ep_signature = models.CharField(blank=True, max_length=2000, help_text='collection\'s signature', verbose_name='signature')

    variant = models.CharField(null=False, blank=False, max_length=32, help_text='collection\'s variant', verbose_name='variant')
    volume = models.PositiveSmallIntegerField(null=True, default=None, blank=True, help_text='volume number', verbose_name='volume')
    ep_environment_type = models.CharField(null=False, blank=False, max_length=32, help_text='collection\'s environment type', default='normal', verbose_name='environment type')

    ep_dummy = models.BooleanField(null=False, blank=False, default=False, help_text='collection is dummy', verbose_name='dummy')
    kind = models.SmallIntegerField(choices=KINDS, default=REGULAR_KIND, help_text='the kind of collection')

    class Meta:
        unique_together = ('md_content_id', 'md_version', 'variant')


    def get_static_formats_for_interface(self):
        return sorted(self.static_formats.filter(present_in_interface=True), key=operator.attrgetter('order'))

    def __unicode__(self):
        return u'[%s:%s] %s (%s)' % (self.md_content_id, self.md_version, self.md_title, self.variant)

    # def reimport(self):
    #     from repository.utils import reimport_collection
    #     reimport_collection(self.md_content_id, self.md_version, self.variant)

    def prefetch_referred_womis_deep(self, in_modules=False):
        pass



class ModuleOccurrence(AttributesOwner, WomiReferrer, model_mixins.ModuleOccurrenceMixin):

    CONFIG = Config

    module = models.ForeignKey(Module, related_name='module_order', null=False, blank=False, on_delete=models.PROTECT)
    sub_collection = models.ForeignKey(SubCollection, related_name='module_orders', null=False, blank=False, on_delete=models.CASCADE)
    value = models.IntegerField(default=1, null=False, blank=False)
    ep_skip_numbering = models.BooleanField(default=False)

    def __unicode__(self):
        return u'%s - %s | %d' % (self.md_title, self.sub_collection.md_title, self.value)


    # TODO: consider adding explicit collection field and unique on (collection, module)



class CollectionStaticFormat(models.Model, model_mixins.CollectionStaticFormatMixin):

    CONFIG = Config

    collection = models.ForeignKey(Collection, related_name='static_formats', on_delete=models.CASCADE)
    specification_code = models.CharField(max_length=16, choices=model_mixins.CollectionStaticFormatMixin.FORMATS, default=model_mixins.CollectionStaticFormatMixin.PDF, null=False, help_text='format code')
    uncompressed_size = models.IntegerField(default=None, null=True, blank=True, help_text='the real size of uncompressed file')
    present_in_interface = models.BooleanField(default=True)
    present_in_api = models.BooleanField(default=True)
    last_changed = models.DateTimeField(default=EPOCH_DEFAULT, null=False, blank=False, help_text='date of last change', verbose_name='last changed')


    class Meta:
        unique_together = ('collection', 'specification_code')




class WomiType(models.Model):
    name = models.CharField(max_length=32, help_text='name', verbose_name='name', blank=True)

    def __unicode__(self):
        return self.name

    @property
    def total_womi_count(self):
        return self.womis.all().count()


class Womi(AuthoredContent, WomiReferrer, model_mixins.WomiMixin):

    CONFIG = Config

    womi_id = models.CharField(max_length=32, help_text='main identifier', verbose_name='womi id', null=False, blank=False)
    womi_type = models.ForeignKey(WomiType, related_name='womis', null=True, blank=True, on_delete=models.PROTECT)
    title = models.CharField(max_length=256, help_text='title of womi', verbose_name='title', default='<unknown>')
    version = models.DecimalField(max_digits=6, decimal_places=0, help_text='version of womi', verbose_name='version')

    # manifest_raw = models.TextField(help_text="womi's manifest")

    class Meta:
        unique_together = ('womi_id', )

    def __unicode__(self):
        return u'[%s] %s (%s)' % (self.womi_id, self.title, self.womi_type)

    @cached_property
    def manifest(self):
        from repository.utils import ManifestJsonFileProvider
        return ManifestJsonFileProvider.parsed(self.CONFIG.SUBDOMAIN, self.identifier, self.version)

    @cached_property
    def metadata(self):
        from repository.utils import MetadataJsonFileProvider
        return MetadataJsonFileProvider.parsed(self.CONFIG.SUBDOMAIN, self.identifier, self.version)


class WomiReference(models.Model, model_mixins.WomiReferenceMixin):

    REGULAR_KIND = 0
    COLLECTION_COVER_KIND = 1
    SUBCOLLECTION_ICON_KIND = 2
    SUBCOLLECTION_PANORAMA_KIND = 3
    EXTERNAL_WORK_SHEET_KIND = 4
    EXTERNAL_UNBOUND_KIND = 5
    PLAY_AND_LEARN_UNBOUND_KIND = 6
    MODULE_HEADER_UNBOUND_KIND = 7
    COLLECTION_HEADER_KIND = 8
    GENERIC_NESTED_KIND = 9
    COLLECTION_TOC_KIND = 10


    KINDS = (
        (REGULAR_KIND, 'regular'),
        (COLLECTION_COVER_KIND, 'collection-cover'),
        (SUBCOLLECTION_ICON_KIND, 'subcollection-icon'),
        (SUBCOLLECTION_PANORAMA_KIND, 'subcollection-panorama'),
        (EXTERNAL_WORK_SHEET_KIND, 'external-work-sheet'),
        (EXTERNAL_UNBOUND_KIND, 'external-unbound'),
        (PLAY_AND_LEARN_UNBOUND_KIND, 'play-and-learn-unbound'),
        (MODULE_HEADER_UNBOUND_KIND, 'module-header-unbound'),
        (COLLECTION_HEADER_KIND, 'collection-header'),
        (GENERIC_NESTED_KIND, 'generic-nested'),
        (COLLECTION_TOC_KIND, 'collection-toc'),
    )

    KIND_NICE_NAMES = {k: v for k, v in KINDS}

    # module_occurrence = models.ForeignKey(ModuleOccurrence, related_name='womi_references', null=False, blank=False, on_delete=models.CASCADE)

    referrer_type = models.ForeignKey(ContentType, null=True)
    referrer_id = models.PositiveIntegerField(null=True)
    referrer = GenericForeignKey('referrer_type', 'referrer_id')

    kind = models.SmallIntegerField(choices=KINDS, default=REGULAR_KIND, null=False)

    womi = models.ForeignKey(Womi, related_name='using_womi_references', null=False, blank=False, on_delete=models.PROTECT)
    section_id = models.CharField(max_length=64, help_text='section id attribute', verbose_name='section id', null=True, blank=True)

    def __unicode__(self):
        return u'%s in %s used as %s at %s' % (self.womi, self.referrer, self.KIND_NICE_NAMES[self.kind], self.section_id)

    class Meta:
        index_together = ('referrer_type', 'referrer_id')
        # unique_together = ('referrer_type', 'referrer_id', 'womi')
        pass


@receiver(post_delete, sender=Collection)
def post_delete_root_collection(sender, instance, *args, **kwargs):
    try:
        instance.root_collection.delete()
    except ObjectDoesNotExist:
        pass
    except AttributeError:
        pass





