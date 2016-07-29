# -*- coding: utf-8 -*-
import uuid
from common.url_providers import get_womi_file_url
import lxml.html
import lxml.etree

from modelmixins import ModelMixin
from django.core.exceptions import ObjectDoesNotExist
from django_hosts.reverse import reverse_full
from django.core.urlresolvers import reverse
from django.http import Http404
from django.utils.functional import cached_property
from django.conf import settings
from common import url_providers
from repository.namespaces import NS_CNXML
from repository.namespaces import NS_CNXSI
from repository.namespaces import NS_COLXML
from repository.namespaces import NS_EP
from repository.namespaces import NS_MD
from collections import namedtuple
from surround.django import context_cache
import operator
from datetime import datetime
import requests
import itertools
import common.objects
from django.utils import timezone

# I admit this somewhat strange to import presentation detail in model definition file,
# but slugify operation is a but more that presentation
from django.template.defaultfilters import slugify

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

SOURCE_VARIANT = '__source__'
FIRST_VARIANT = '__first__'
ALL_VARIANT = '__all__'


def filter_unique_drivers(drivers):

    found = set()

    for driver in drivers:
        representation = '%s:%s:%s' % (driver.category, driver.identifier, driver.version)
        if representation in found:
            continue
        found.add(representation)
        yield driver

class AttributesOwnerMixin(ModelMixin):

    def get_attribute_value(self, name, default=None):
        try:
            return self.attributes.get(name=name).value
        except Attribute.DoesNotExist:
            return default


class TOCElementMixin(ModelMixin):

    # @cached_property

    @property
    def toc_path(self):
        out = list()
        content = self
        while content.parent is not None:
            out.insert(0, content.order_value)
            content = content.parent
        return out


    @property
    def technical_toc_path(self):
        return '_'.join(map(str, self.toc_path))


    @property
    def title_toc_path(self):
        if self.is_module and (self.is_title or self.ep_skip_numbering):
            return ''

        out = list()
        content = self
        while content.parent is not None:
            order = content.order_value
            for c in content.parent.get_all_children_ordered(with_volatile=False):
                if c.order_value == content.order_value:
                    break
                if c.is_module and c.ep_skip_numbering:
                    order -= 1

            out.insert(0, order)

            content = content.parent
        output = '.'.join(map(str, out))
        if len(output) == 0:
            return ''
        else:
            return output+'.'


class SubCollectionMixin(TOCElementMixin):

    @property
    def is_root(self):
        return not self.parent_collection

    @property
    def collection(self):
        if self.is_root:
            return self.owning_collection #Collection.objects.filter(root_collection__id=self.id)
        return self.parent_collection.collection


    def get_all_children_ordered(self, with_volatile=True):
        children = list(self.subcollections.all()) + list(self.module_orders.all())
        return sorted(children, key=lambda o: o.order_value)


    def get_all_modules(self, with_volatile=True):
        for module_occurrence in self.get_all_module_occurrences():
            yield module_occurrence.module


    def get_all_module_occurrences(self, with_volatile=True):
        for child in self.get_all_children_ordered(with_volatile=with_volatile):
            if child.is_module:
                yield child
            else:
                for module_occurrence in child.get_all_module_occurrences():
                    yield module_occurrence

    def get_number_of_modules(self):
        return len(list(self.get_all_modules()))


    @property
    def is_empty(self):
        return (not self.subcollections.exists()) and (not self.module_orders.exists())


    @property
    def is_module(self):
        return False

    @property
    def parent(self):
        return self.parent_collection

    @property
    def first_nested_module_occurrence(self):
        for child in self.get_all_children_ordered(with_volatile=True):
            if child.is_module:
                return child
            else:
                nested_child = child.first_nested_module_occurrence
                if nested_child is not None:
                    return nested_child
        return None


    def get_absolute_url(self):
        for c in self.get_all_children_ordered(with_volatile=True):
            url = c.get_absolute_url()
            if url is not None:
                return url

        return None


    def walk_structure(self, subcollection_callback, module_callback):
        if subcollection_callback is not None:
            subcollection_callback(self)

        for subcollection in self.subcollections.all():
            subcollection.walk_structure(subcollection_callback, module_callback)

        if module_callback is not None:
            for module_occurrence in self.module_orders.all():
                module_callback(module_occurrence)





class CategoryMixin(ModelMixin):

    @property
    def short_descriptor(self):
        return { 'identifier': self.identifier, 'version': str(self.version), 'category': self.category }

    def as_driver(self, drivers):
        return drivers.bind(self.category, self.identifier, self.version)

    def as_content_driver(self):
        import content.objects
        return content.objects.drivers.convert(self)

    @property
    def deep_dependencies(self):
        dependencies = list(self.dependencies)
        return filter_unique_drivers(itertools.chain([self], dependencies, itertools.chain.from_iterable(itertools.imap(lambda d: d.deep_dependencies, dependencies))))

    @classmethod
    def merge_deep_dependencies(cls, objects):
        return filter_unique_drivers(itertools.chain.from_iterable(itertools.imap(lambda o: o.deep_dependencies, objects)))



class MetadataMixin(CategoryMixin):

    @property
    def identifier(self):
        return self.md_content_id

    @property
    def version(self):
        return self.md_version


def referred_womis_silenced(obj):
    try:
        return obj.referred_womis
    except Http404:
        return []


class CollectionMixin(MetadataMixin, common.objects.BareDriverDegradableMixin):

    category = 'collection'

    STYLESHEET_NORMALIZATION_MAPPING = {alias: aliases[0] for aliases in (
        ('ge',),
        ('standard-2',),
        ('standard-2-matematyka',),
        ('standard-2-przyroda',),
        ('standard-2-uwr',),
        ('standard-2-tutorial',),
        ) for alias in aliases}

    VARIANT_IDENTIFIERS_MAP = {
        'student': 'dla ucznia',
        'student-canon': 'dla ucznia',
        'student-expanding': 'z treściami rozszerzającymi dla ucznia',
        'student-supplemental': 'z treściami uzupełniającymi dla ucznia',
        'teacher': 'dla nauczyciela',
        'teacher-canon': 'dla nauczyciela',
        'teacher-expanding': 'z treściami rozszerzającymi dla nauczyciela',
        'teacher-supplemental': 'z treściami uzupełniającymi dla nauczyciela',
    }


    @property
    def nice_variant_name(self):
        return self.VARIANT_IDENTIFIERS_MAP.get(self.variant, 'nieznany wariant')


    def get_number_of_chapters(self):
        from common import models
        return len(models.SubCollection.objects.filter(parent_collection__id=self.root_collection.id))


    def get_number_of_modules(self):
        return self.root_collection.get_number_of_modules()

    def get_all_modules(self, with_volatile=True):
        return self.root_collection.get_all_modules(with_volatile=with_volatile)

    def get_all_module_occurrences(self, with_volatile=True):
        return self.root_collection.get_all_module_occurrences(with_volatile=with_volatile)


    def get_module_by_id(self, identifier):

        for m in self.modules:
            if m.identifier == identifier:
                return m

        raise KeyError('module %s not found' % identifier)

    def get_module_occurrence_or_404(self, md_content_id, with_volatile=True):

        for o in self.get_all_module_occurrences(with_volatile=with_volatile):
            if (md_content_id is None) or (o.module.identifier == md_content_id):
                return o
        raise Http404('No ModuleOccurrence %s found in %s' % (md_content_id, self))


    def has_any_inside(self):
        return any(self.get_all_module_occurrences(with_volatile=False))

    @property
    def base_url(self):
        return '//%s.%s/content/collection/%s/%s/%s/' % (self.CONFIG.SUBDOMAIN, settings.TOP_DOMAIN, self.identifier, self.version, self.variant)


    @classmethod
    def static_get_absolute_url(cls, md_content_id, md_version, variant):
        return reverse_full('www', cls.CONFIG.VARIANT_DETAILS_VIEW, view_kwargs={
            'collection_id': md_content_id,
            'version': int(md_version),
            'variant': variant})

    def get_xml_url(self):
        return url_providers.get_collection_universal_xml_url(self.CONFIG.SUBDOMAIN, self.identifier, self.version, self.variant)



    def get_absolute_url(self):
        return 'http:' + self.static_get_absolute_url(self.identifier, self.version, self.variant)


    def get_most_specific_library_url(self):
        if self.education_code is None:
            return None
        return reverse('front.views.new_index', kwargs={ 'subject': None, 'level': self.md_school_ep_class_or_none, 'education_level': self.education_code })




    @property
    def transformation_switches(self):
        return ['svg-glyphs'] if self.identifier == '18186' else []


    @cached_property
    def sibling_variants(self):
        from common import models
        return models.Collection.objects.filter(md_content_id=self.md_content_id, md_version=self.md_version).order_by('variant')


    @cached_property
    def has_siblings(self):
        return len(self.sibling_variants) > 1


    @property
    def is_emergency_hosted_collection(self):
        return self.identifier in settings.EPO_EMERGENCY_HOSTED_COLLECTIONS


    @cached_property
    def metadata_xml(self):
        from repository.utils import MetadataXml
        return MetadataXml(self.CONFIG.SUBDOMAIN, self.identifier, self.md_version)


    @context_cache.wrap_with_assure_active
    def _sync_static(self, checker):
        from common import models

        for specification_code, specification in models.CollectionStaticFormat.FORMATS_DICT.items():
            try:
                try:
                    static_format = models.CollectionStaticFormat.objects.get(collection=self, specification_code=specification_code)
                    if not checker(static_format):
                        static_format.delete()
                        info('deleted %s', static_format)
                except models.CollectionStaticFormat.DoesNotExist:
                    static_format = models.CollectionStaticFormat(collection=self, specification_code=specification_code)
                    if checker(static_format):
                        static_format.mark_last_changed()
                        static_format.assume_presentation_defaults()
                        static_format.save()
                        info('created %s', static_format)
            except Exception as e:
                error('error occurred while syncing %s of %s: %s', specification_code, self, e)


    def sync_static_from_metadata(self):
        self._sync_static(lambda s: s.check_declared())


    def sync_static(self):
        self._sync_static(lambda s: s.check_existance())


    @property
    def environment_type_config(self):
        return settings.EPO_ENVIRONMENT_TYPE_CONFIGS.get(self.ep_environment_type, settings.EPO_ENVIRONMENT_TYPE_DEFAULT_CONFIG)


    def does_contain_module(self, module_id, version):
        for m in self.get_all_modules():
            if (m.identifier == module_id) and (int(m.version) == int(version)):
                return True
        return False


    @property
    def education_code(self):
        if self.md_school is not None:
            return self.md_school.education_code
        return 0

    @property
    def class_code(self):
        if self.md_school is not None:
            return self.md_school.ep_class
        return 0

    def get_static_formats_for_interface(self):
        return sorted(filter(lambda f: f.present_in_interface, self.static_formats.all()), key=operator.attrgetter('order'))

    def get_static_formats_for_category(self, category):
        return [f for f in self.static_formats.all() if f.specification.category == category]

    def get_static_format_or_none(self, specification_code):
        try:
            return self.static_formats.get(specification_code=specification_code)
        except ObjectDoesNotExist as e:
            return None

    @property
    def normalized_ep_stylesheet(self):
        return self.STYLESHEET_NORMALIZATION_MAPPING.get(self.ep_stylesheet, 'standard')

    @property
    def is_official(self):
        return False

    @property
    def modules(self):
        return self.get_all_modules()


    @property
    def referred_womis_in_structure(self):
        return filter_unique_drivers(itertools.chain(self.referred_womis, itertools.chain.from_iterable([subcollection.referred_womis for subcollection in self.subcollections.all()])))

    @property
    def referred_womis_overall(self):
        return filter_unique_drivers(itertools.chain(self.referred_womis_in_structure, itertools.chain.from_iterable([module.referred_womis for module in self.get_all_modules()])))

    @property
    def referred_womis_deep_overall(self):
        womis = list(self.referred_womis_overall)
        return filter_unique_drivers(itertools.chain(womis, itertools.chain.from_iterable([referred_womis_silenced(womi) for womi in womis])))




    @property
    def dependencies(self):
        return itertools.chain(self.referred_womis_in_structure, self.get_all_modules())



    @property
    def cover_womi(self):
        try:
            return self.womi_references_prefetch_related_womi.get(kind=self.CONFIG.MODELS.WomiReference.COLLECTION_COVER_KIND).womi
        except ObjectDoesNotExist as e:
            return None

    @property
    def is_source(self):
        return self.variant == SOURCE_VARIANT

    def bind_default_presentation(self, allow_non_fixed_version=False):
        # TODO: optimize here
        return self.CONFIG.get_presentations().bind_collection_or_404(self.identifier, self.version, self.variant, allow_non_fixed_version=allow_non_fixed_version)

    def walk_structure(self, subcollection_callback, module_callback):
        self.root_collection.walk_structure(subcollection_callback, module_callback)

    @cached_property
    def collxml_url(self):
        return url_providers.get_collection_variant_xml_url(self.CONFIG.SUBDOMAIN, self.identifier, self.version, self.variant)

    @cached_property
    def parsed_xml(self):
        from repository.utils import fetch_and_parse_xml
        return fetch_and_parse_xml(self.collxml_url)

    @property
    def title(self):
        return self.md_title

    @property
    def md_school_ep_class_or_none(self):
        if self.md_school is None:
            return None
        return self.md_school.ep_class

    @cached_property
    def kind_nice(self):
        if self.kind == self.EXTRA_KIND:
            return 'zasoby dodatkowe'
        return None



class ModuleOccurrenceMixin(TOCElementMixin):


    def get_absolute_url(self):
        # TODO: optimize here
        return self.CONFIG.get_presentations().bind_module_occurrence_or_404(self.collection.identifier, self.collection.version, self.collection.variant, self.module.identifier).url


    @property
    def collection(self):
        return self.sub_collection.collection

    # @property
    # def collection_id(self):
    #     return self.collection.md_content_id

    @property
    def order_value(self):
        return self.value

    @property
    def is_title(self):
        # return False
        return self.module.identifier == 'title'

    # @property
    # def module_id(self):
    #     return self.module.identifier

    @property
    def html_url(self):
        return url_providers.get_module_occurrence_html_url(self.collection.CONFIG.SUBDOMAIN, self.collection.identifier, self.collection.version, self.collection.variant, self.module.identifier)

    @property
    def epxml_url(self):
        return url_providers.get_module_occurrence_xml_url(self.collection.CONFIG.SUBDOMAIN, self.collection.identifier, self.collection.version, self.collection.variant, self.module.identifier, self.module.version)

    @cached_property
    def parsed_xml(self):
        from repository.utils import fetch_and_parse_xml
        return fetch_and_parse_xml(self.epxml_url)

    @property
    def dependencies_url(self):
        return reverse_full('www', self.CONFIG.view_name('module_dependencies'),
                            view_kwargs={'module_id': self.module.identifier, 'version': self.module.version})

    def resource_url(self, resource_name):
        return reverse_full('www', self.CONFIG.VIEWS_BASE_NAME + '_' + resource_name, view_kwargs={
            'collection_id':  self.collection.identifier,
            'version': self.collection.version,
            'variant': self.collection.variant,
            'module_id': self.module.identifier,
        })

    @property
    def is_module(self):
        return True

    @property
    def md_title(self):
        return self.module.md_title

    @property
    def parent(self):
        return self.sub_collection

    @property
    def path_key(self):
        return 'c:%s:v:%s:t:%s:m:%s' % (self.collection.identifier, self.collection.version, self.collection.variant, self.module.identifier)

    @property
    def subdomain(self):
        return '//' + self.CONFIG.SUBDOMAIN + '.' + settings.TOP_DOMAIN + '/'

    @property
    def source(self):
        return self.module if self.collection.is_source else self

    @property
    def identifier(self):
        return self.module.identifier






class WomiMixin(CategoryMixin, common.objects.BareDriverDegradableMixin):

    category = 'womi'

    @property
    def manifest_url(self):
        from repository.utils import ManifestJsonFileProvider

        return ManifestJsonFileProvider.url(self.CONFIG.SUBDOMAIN, self.identifier, self.version)

    @property
    def metadata_url(self):
        return url_providers.get_womi_metadata_url(self.CONFIG.SUBDOMAIN, self.identifier, self.version)


    @property
    def md_title(self):
        return self.title

    @property
    def md_content_id(self):
        return self.womi_id

    @property
    def identifier(self):
        return self.womi_id

    @property
    def md_version(self):
        return self.version

    @property
    def base_url(self):
        return 'http://%s.%s/content/womi/%s/' % (self.CONFIG.SUBDOMAIN, settings.TOP_DOMAIN, self.womi_id)

    def path_url(self, path):
        return get_womi_file_url(self.CONFIG.SUBDOMAIN, self.identifier, self.version, path)

    @property
    def dependencies(self):
        return filter_unique_drivers(self.referred_womis)


    @property
    def referrences_number(self):
        return self.using_womi_references.count()

    @property
    def classic_resolutions(self):
        resolutions = []
        if self.manifest and 'parameters' in self.manifest and 'classic' in self.manifest['parameters']:
            classic = self.manifest['parameters']['classic']
            if 'resolution' in classic and 'mimeType' in classic and 'svg' not in classic['mimeType']:
                resolutions = classic['resolution']
        return resolutions


    def get_image_url(self, format='classic', resolution=None):
        from common.utils import content_type_to_extension
        try:
            params = self.manifest['parameters']['classic']
            if resolution is None:
                resolution = max(params['resolution'])
            extension = content_type_to_extension(params['mimeType'])
            filename = '%s%s' % (format, ('-%s.%s' % (resolution, extension)) if extension != 'svg' else '.svg')
            return self.path_url(filename)
        except Exception as e:
            return None





class WomiReferrerMixin(ModelMixin):

    @property
    def referred_womis(self):
        for womi_reference in self.womi_references_prefetch_related_womi.all():
            yield womi_reference.womi

    def single_referred_womi_or_none(self, kind):
        try:
            return self.womi_references_prefetch_related_womi.filter(kind=kind)[0].womi
        except IndexError as e:
            return None

    @property
    def womi_references_prefetch_related_womi(self):
        return self.womi_references


class WomiReferenceMixin(ModelMixin):

    @property
    def nice_kind(self):
        return self.KIND_NICE_NAMES[self.kind]

    def get_absolute_url(self):
        if isinstance(self.referrer, ModuleOccurrenceMixin):
            if self.kind == self.REGULAR_KIND:
               return self.referrer.get_absolute_url()
            if self.kind == self.PLAY_AND_LEARN_UNBOUND_KIND:
               return 'http:' + self.referrer.resource_url('autonomic_womi_reader')
        return None



CurriculumDimension = namedtuple('CurriculumDimention', ['key', 'value'])


def xml_to_curriculum_dimension(xml):
    if xml is None:
        return CurriculumDimension('', '')

    return CurriculumDimension(xml.get(NS_EP('key'), ''), xml.text)


def legacy_xml_to_curriculum_dimension(xml):
    return CurriculumDimension('', xml.text)


class CurriculumEntry(object):
    """This class represents the core curriculum entry.

    It supports both old-style and new-style curriculum presentation.
    It has 5 main attributes: stage, subject, school, version and ability, each of them with two attributes: key and value.
    It also has a authors_comment attribute and is_main (to represent main point of CC).

    If read from an old-style XML representation, some leaf fields may be empty ('' or None).
    """

    def __init__(self, xml):

        xml_ed = xml.find(NS_MD('education-level'))
        if xml_ed is not None:
            self.stage = legacy_xml_to_curriculum_dimension(xml_ed)
        else:
            self.stage = xml_to_curriculum_dimension(xml.find(NS_EP('core-curriculum-stage')))

        self.subject = xml_to_curriculum_dimension(xml.find(NS_EP('core-curriculum-subject')))
        self.school = xml_to_curriculum_dimension(xml.find(NS_EP('core-curriculum-school')))
        self.version = xml_to_curriculum_dimension(xml.find(NS_EP('core-curriculum-version')))

        xml_cc = xml.find(NS_EP('core-curriculum-code'))
        if xml_cc is not None:
            self.ability = CurriculumDimension(xml_cc.text, xml.find(NS_EP('core-curriculum-keyword')).text)
            self.is_main = False
        else:
            xml_ability = xml.find(NS_EP('core-curriculum-ability'))
            self.ability = xml_to_curriculum_dimension(xml_ability)
            self.is_main = (xml_ability.get(NS_EP('core-curriculum-main'), '') == 'true') if xml_ability is not None else False

        comment = xml.find(NS_EP('authors-comment'))
        if comment is not None:
            allstr = []

            for i in comment.iter():
                if i.text is not None:
                    allstr.append(i.text)
                if 'newline' in i.tag:
                    allstr.append('<br/>')
                if i.tail is not None:
                    allstr.append(i.tail)

            comment = ''.join(allstr)

        self.authors_comment = comment



class ModuleMixin(MetadataMixin, common.objects.BareDriverDegradableMixin):

    category = 'module'

    CURRICULUM_ENTRIES_XPATH = NS_CNXML('metadata') + '/' + NS_EP('e-textbook-module') + '/' + NS_EP('core-curriculum-entries')

    @property
    def core_curriculum_entries(self):

        entries = self.parsed_xml.find(self.CURRICULUM_ENTRIES_XPATH)
        if entries is None:
            return []

        return [CurriculumEntry(e) for e in entries]

    @property
    def epxml_url(self):
        if self.is_auto_generated:
            collection_identifier, collection_version, module_kind = self.identifier.split('_')
            return url_providers.get_auto_module_xml_url(self.CONFIG.SUBDOMAIN, collection_identifier, collection_version, self.identifier)
        else:
            return url_providers.get_module_xml_url(self.CONFIG.SUBDOMAIN, self.identifier, self.version)

    @cached_property
    def parsed_xml(self):
        from repository.utils import fetch_and_parse_xml
        return fetch_and_parse_xml(self.epxml_url)

    @property
    def occurrences_number(self):
        return self.module_order.count()

    @property
    def dependencies(self):
        return filter_unique_drivers(self.referred_womis)

    @property
    def title(self):
        return self.md_title


class AuthorMixin(ModelMixin):

    PERSON_KIND = 0
    ORGANIZATION_KIND = 1

    KINDS = (
        (PERSON_KIND, 'person'),
        (ORGANIZATION_KIND, 'organization'),
    )

    def assert_kind(self, kind):
        if kind != self.kind:
            raise InvalidAuthorKindException('invalid kind referenced, while found %s' % self.get_kind_display())

    @property
    def fullname(self):
        return self.md_full_name

    @property
    def shortname(self):
        self.assert_kind(self.ORGANIZATION_KIND)
        return self.md_first_name

    @property
    def firstname(self):
        self.assert_kind(self.PERSON_KIND)
        return self.md_first_name

    @property
    def surname(self):
        self.assert_kind(self.PERSON_KIND)
        return self.md_surname

    @property
    def email(self):
        self.assert_kind(self.PERSON_KIND)
        return self.md_email

    @property
    def is_person(self):
        return self.kind == self.PERSON_KIND

    @property
    def is_organization(self):
        return self.kind == self.ORGANIZATION_KIND



class CollectionStaticFormatMixin(ModelMixin):

    PDF = 'pdf'
    EPUB = 'epub'
    EPUB_COLOR = 'epub-color'
    ODT = 'odt'
    RELIEF = 'relief'
    ODT_PACKAGE = 'odt-package'
    MOBILE_480 = 'mobile-480'
    MOBILE_980 = 'mobile-980'
    MOBILE_1440 = 'mobile-1440'
    MOBILE_1920 = 'mobile-1920'
    OFFLINE_EE = 'offline-ee'

    class Format(object):
        def __init__(self, order, name, filename, extension, nice_name, default_present_in_interface, default_present_in_api, category, public_name=None, private_name=None):
            self.order = order
            self.name = name
            self.filename = filename
            self.extension = extension
            self.nice_name = nice_name
            self.default_present_in_interface = default_present_in_interface
            self.default_present_in_api = default_present_in_api
            self.category = category
            self.public_name = public_name
            self.private_name = private_name
            self.effective_public_name = self.public_name if self.public_name else self.name


    FORMATS_DICT = {
        PDF: Format(0, 'pdf', 'collection.pdf', 'pdf', 'PDF', True, True, 'pdf'),
        MOBILE_480: Format(4, 'mobile 480', 'mobile-480.zip', 'zip', 'mobile 480', False, False, 'mobile', 'ZIP-480', '480'),
        MOBILE_980: Format(5, 'mobile 980', 'mobile-980.zip', 'zip', 'mobile 980', False, False, 'mobile', 'ZIP-980', '980'),
        MOBILE_1440: Format(6,'mobile 1440', 'mobile-1440.zip', 'zip', 'mobile 1440', False, False, 'mobile', 'ZIP-1440', '1440'),
        MOBILE_1920: Format(7, 'mobile 1920', 'mobile-1920.zip', 'zip', 'mobile 1920', False, False, 'mobile', 'ZIP-1920', '1920'),
        OFFLINE_EE: Format(10, 'offline ee', 'collection-ee.zip', 'zip', 'offline EE', True, False, 'offline-ee'),
    }

    DEFAULT = Format(100, 'unknown', 'collection.unknown', 'unknown', 'unknown', False, False, 'unknown')

    CATEGORIES = ('pdf', 'epub', 'odt', 'braille')

    FORMATS = [(k, v.name) for k, v in FORMATS_DICT.items()]

    @property
    def specification(self):
        return self.get_specification(self.specification_code)

    @classmethod
    def get_specification(cls, specification_code):
        return cls.FORMATS_DICT.get(specification_code, cls.DEFAULT)

    def assume_presentation_defaults(self):
        self.present_in_interface = self.specification.default_present_in_interface
        self.present_in_api = self.specification.default_present_in_api

    def __unicode__(self):
        return u'%s for %s' % (self.specification.name, self.collection)

    def get_absolute_url(self):
        return url_providers.get_static_format_url(self.CONFIG.SUBDOMAIN, self.collection.identifier, self.collection.version, self.collection.variant, self.specification.filename)

    @property
    def order(self):
        return self.specification.order



    def check_existance(self):
        try:
            r = requests.head(self.get_absolute_url(), timeout=5, headers = { 'X-HEAD': '1' })
            r.raise_for_status()
            return True
        except requests.exceptions.RequestException:
            return False


    def check_declared(self):
        return bool(self.specification_code in self.collection.metadata_xml.static_formats)

    def mark_last_changed(self):
        self.last_changed = timezone.now()
        self.save()

    @property
    def guid(self):
        return uuid.uuid3(uuid.NAMESPACE_OID, (u'%s/%s/%s/%s/%s' % (self.collection.identifier, self.collection.version, self.collection.variant, self.specification_code, self.last_changed)).encode())

    @property
    def filename(self):
        return '%s_%s_%s_%s.%s' % (slugify(self.collection.md_school.for_details()) if self.collection.md_school is not None else 'brak', slugify(self.collection.md_subject.md_name) if self.collection.md_subject is not None else 'brak', slugify(self.collection.md_title), slugify(self.collection.nice_variant_name), self.specification.extension)


class SchoolLevelMixin(ModelMixin):

    @property
    def education_code(self):
        return self.CODE_MAPPINGS.get(self.md_education_level, None)

