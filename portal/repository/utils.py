# coding=utf-8
from __future__ import absolute_import

import sys
from xml.etree import ElementTree
from lxml import etree as letree
from common.utils import repair_date, int_or_none
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction, IntegrityError
from django.conf import settings
from dateutil.parser import parse
import requests
from requests.exceptions import HTTPError
from surround.django.utils import Timer
import common.models
from django.http import Http404
from surround.django import coroutine
from common.url_providers import *
from common import url_providers
import json
from surround.django import context_cache
from StringIO import StringIO
from .namespaces import *
from surround.django import redis, execution
from surround.django.utils import CacheKey
from common.model_mixins import SOURCE_VARIANT
from django.utils.functional import cached_property
import functools
from collections import namedtuple
from common.todo import HARDCODED_WOMI_VERSION_ONE
import re

from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())

LEGACY_AUTHORSHIP_FORMAT_ROLE_TYPE = 'author'

ModuleReference = namedtuple('ModuleReference', ['type', 'identifier', 'section', 'local'])

class ModuleReferenceManager(object):

    def __init__(self, source_identifier, kind, xml):
        self.source_identifier = source_identifier
        self.kind = kind
        self.xml = xml

    @cached_property
    def reference(self):

        try:
            if self.kind == 'link':
                document = self.xml.get(NS_EP('document'))
                return ModuleReference(
                    type='link',
                    identifier=document if document is not None else self.source_identifier,
                    section=self.xml.get(NS_CNXML('target-id')),
                    local=document is None,
                )
            else:
                local = self.xml.get(NS_EP('local-reference')) == 'true'
                ep_id = self.xml.get(NS_EP('id'))
                if local:
                    identifier, _para = ep_id.split('_')
                else:
                    _type, identifier, _para = ep_id.split('_')

                return ModuleReference(type=self.kind, identifier=identifier, section=ep_id, local=local)
        except Exception as e:
            debug('invalid module reference found in %s', self.source_identifier)
            return ModuleReference(type='invalid', identifier='?', section='?', local=True)

    @property
    def identifier(self):
        return self.reference.identifier

    @identifier.setter
    def identifier(self, value):

        if self.kind == 'link':
            if value == self.source_identifier:
                try:
                    del self.xml.attrib[NS_EP('document')]
                except:
                    pass
            else:
                self.xml.set(NS_EP('document'), value)
        else:
            ep_id = self.xml.get(NS_EP('id'))
            if self.reference.local:
                identifier, _para = ep_id.split('_')
                new_ep_id = '_'.join([value, _para])
            else:
                _type, identifier, _para = ep_id.split('_')
                new_ep_id = '_'.join([_type, value, _para])
            self.xml.set(NS_EP('id'), new_ep_id)

        del self.reference
        # return self.reference.identifier

    def __repr__(self):
        return repr(self.reference)


def set_if_present(model, field, element, name):
    value = element.findtext(name)
    if value is not None:
        setattr(model, field, value)


def set_if_attribute_present(model, field, element, name):
    value = element.get(name)
    if value is not None:
        setattr(model, field, value)


class JsonUnavailable(Http404):
    pass

class WomiJsonUnavailable(JsonUnavailable):
    pass

class XmlUnavailable(Http404):
    pass

class ModuleXmlUnavailable(XmlUnavailable):
    pass

class CollectionXmlUnavailable(XmlUnavailable):
    pass

class MetadataXmlUnavailable(XmlUnavailable):
    pass

class EmptyVariantsList(Http404):
    pass

class VariantUnavailable(Http404):
    pass

class ImportFailure(Exception):
    pass

class ParseFailure(ImportFailure):
    pass

@context_cache.cached
def fetch_xml(url):
    try:
        with Timer('%s xml fetched in' % url, debug):
            debug('fetching %s' % url)
            r = requests.get(url, headers={'Accept': 'application/xml'}, verify=False, timeout=30)
            r.raise_for_status()
            return r.content
    except HTTPError as e:
        raise XmlUnavailable('failed to get: %s' % url)

def parse_json(url, json_content):
    return json.loads(json_content)

def parse_xml(url, xml_content, engine=ElementTree):
    with Timer('%s xml parsed in ' % url, debug):
        try:
            if isinstance(xml_content, unicode):
                xml_content = xml_content.encode('utf8')
            xml = engine.fromstring(xml_content)

            if engine is ElementTree:
                for p in xml.iter():
                    for c in p:
                        c.parent = p

            return xml

        except engine.ParseError as e:
            # error('failed to parse %s: %s', url, e)
            raise ParseFailure('failed to parse %s: %s' % (url, e))

def just_parse_xml(xml_content):
    return parse_xml('<unknown>', xml_content)


def stringify_children(node):
    stringified = letree.tostring(node)
    ns = node.nsmap[node.prefix]
    tag = node.tag
    if ns:
        tag = tag.replace('{%s}' % ns, '%s:' % node.prefix)

    stringified = re.sub(r'<[/]{0,1}%s[^>]*>' % tag, '', stringified)

    return stringified


def get_or_add_xml_node(xml, tag):
    node = xml.find(tag)
    if node is not None:
        return node
    return ElementTree.SubElement(xml, tag)


@context_cache.cached
def fetch_and_parse_xml(url):
    return parse_xml(url, fetch_xml(url))


@context_cache.cached
def fetch_and_parse_xml_with_lxml(url):
    return parse_xml(url, fetch_xml(url), engine=letree)


def stringify_element(element):
    return letree.tostring(element)


class FileProvider(object):

    url_provider = None
    timeout = 30
    exception_class = None
    parser = None

    @classmethod
    def _url(cls, args):
        return cls.url_provider(*args)

    @classmethod
    def url(cls, *args):
        return cls._url(args)

    @classmethod
    def fetched(cls, *args):
        return cls._fetched(cls._url(args))

    @classmethod
    @context_cache.cached
    def _fetched(cls, url):
        try:
            with Timer('%s xml fetched in' % url, debug):
                debug('fetching %s' % url)
                r = requests.get(url, headers={'Accept': 'application/xml'}, verify=False, timeout=cls.timeout)
                r.raise_for_status()
                return r.content
        except HTTPError as e:
            raise cls.exception_class('failed to get: %s' % url)

    @classmethod
    def force_fetch(cls, value, *args):
        cls._fetched._force(value, [cls, cls._url(args)])

    @classmethod
    def parsed(cls, *args):
        url = cls._url(args)
        return cls.parser(url, cls._fetched(url))

    @classmethod
    def lxml_parsed(cls, *args):
        url = cls._url(args)
        return cls.parser(url, cls._fetched(url), engine=letree)


class XmlFileProvider(FileProvider):
    parser = staticmethod(parse_xml)

class CollectionXmlFileProvider(XmlFileProvider):

    exception_class = CollectionXmlUnavailable
    url_provider = staticmethod(url_providers.get_collection_xml_url)


class ModuleXmlFileProvider(XmlFileProvider):
    exception_class = ModuleXmlUnavailable

class CollectionUniversalXmlFileProvider(CollectionXmlFileProvider):
    url_provider = staticmethod(url_providers.get_collection_universal_xml_url)

class ModuleSourceXmlFileProvider(ModuleXmlFileProvider):
    url_provider = staticmethod(url_providers.get_module_xml_url)

class AutoModuleSourceXmlFileProvider(ModuleXmlFileProvider):
    url_provider = staticmethod(url_providers.get_auto_module_xml_url)

class ModuleOccurrenceXmlFileProvider(ModuleXmlFileProvider):
    url_provider = staticmethod(url_providers.get_module_occurrence_xml_url)

class MetadataXmlFileProvider(XmlFileProvider):
    url_provider = staticmethod(url_providers.get_metadata_xml)
    exception_class = MetadataXmlUnavailable

class JsonFileProvider(FileProvider):
    parser = staticmethod(parse_json)
    exception_class = JsonUnavailable

class ManifestJsonFileProvider(JsonFileProvider):
    url_provider = staticmethod(url_providers.get_womi_manifest_url)
    exception_class = WomiJsonUnavailable

class MetadataJsonFileProvider(JsonFileProvider):
    url_provider = staticmethod(url_providers.get_womi_metadata_url)
    exception_class = WomiJsonUnavailable



def fetch_and_parse_json(url):
    try:
        debug('fetching %s' % url)
        r = requests.get(url, timeout=5)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        error('failed to fetch and parse json %s', url)
        raise ImportFailure('failed to fetch and parse json %s: %s' % (url, e))


@context_cache.cached
def fetch_and_parse_metadata_json(subdomain, womi_id, version):
    return fetch_and_parse_json(url_providers.get_womi_metadata_url(subdomain, womi_id, version))


def print_xml(xml):
    root = ElementTree.ElementTree(xml)
    out = StringIO()
    root.write(out, encoding='UTF-8', xml_declaration=True)
    return out.getvalue() + '\n'

def wrap_with_transaction(func):

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        return inside_db_transaction(func, *args, **kwargs)

    return wrapper

def inside_db_transaction(func, *args, **kwargs):
    if transaction.is_managed():
        return func(*args, **kwargs)
    else:
        try:
            with transaction.atomic():
                return func(*args, **kwargs)
        except (TypeError, IntegrityError, NameError, Exception), e:
            error('exception occurred during import: %s', e)
            raise ImportFailure, ImportFailure('exception occurred during import in database transaction: %s' % e), sys.exc_info()[2]


def try_import(func):

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            try:
                return func(*args, **kwargs)
            except (ValueError, AttributeError) as e:
                exc_info = sys.exc_info()

                # import traceback ; traceback.print_exc()
                raise ImportFailure, ImportFailure('import failure: %s' % e), exc_info[2]
        except ImportFailure as e:
            error('import failure in: %s(%s, %s): %s', func.__name__, args, kwargs, e)
            raise

    return wrapper

def ignore_problems(func):

    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except (KeyError, AttributeError, ValueError, ImportFailure) as e:
            debug('ignoring problem: %s', e)
            pass

    return wrapper


def dummy_logging(*args, **kwargs):
    pass

class ParserMetaclass(type):


    def __init__(cls, name, bases, attrs):
        super(ParserMetaclass, cls).__init__(name, bases, attrs)

        cls.imported_collection = staticmethod(cls.wrap_import(cls.models.Collection, cls.import_collection, 'c:{identifier}:v:{version}', cls.collection_timeout, { 'identifier': 'md_content_id', 'version': 'md_version' }))
        cls.imported_collection_variant = staticmethod(cls.wrap_import(cls.models.Collection, cls.import_collection_variant, 'c:{identifier}:v:{version}:t:{variant}', cls.collection_variant_timeout, { 'identifier': 'md_content_id', 'version': 'md_version' }))
        cls.imported_module = staticmethod(cls.wrap_import(cls.models.Module, cls.import_module, 'm:{identifier}:v:{version}', cls.module_timeout, { 'identifier': 'md_content_id', 'version': 'md_version' }))
        cls.imported_womi = staticmethod(cls.wrap_import(cls.models.Womi, cls.import_womi, 'w:{identifier}:v:{version}', cls.womi_timeout, { 'identifier': 'womi_id' }))

        if cls.lazy_references:
            # cls.reference_imported_module = execution.LazyFactory(cls, 'imported_module', { 'category': 'module', 'short_descriptor': cls.models.Module.short_descriptor })
            # cls.reference_imported_womi = execution.LazyFactory(cls, 'imported_womi', { 'category': 'womi', 'short_descriptor': cls.models.Womi.short_descriptor })
            cls.reference_imported_collection = execution.LazyFactory(cls, 'imported_collection', { 'category': 'collection' })
            cls.reference_imported_module = execution.LazyFactory(cls, 'imported_module', { 'category': 'module' })
            cls.reference_imported_womi = execution.LazyFactory(cls, 'imported_womi', { 'category': 'womi' })
        else:
            cls.reference_imported_collection = cls.imported_collection
            cls.reference_imported_module = cls.imported_module
            cls.reference_imported_womi = cls.imported_womi

        if cls.creation_logging == 'INFO':
            cls.log_created = staticmethod(info)
        elif cls.creation_logging == 'DEBUG':
            cls.log_created = staticmethod(debug)
        else:
            cls.log_created = staticmethod(dummy_logging)


class ContentParser(object):

    __metaclass__ = ParserMetaclass

    models = common.models
    subdomain = 'content'

    keys_root = CacheKey('dummy')
    cache_imports = False
    import_reuse = True
    lazy_references = False

    collection_timeout = 0
    collection_variant_timeout = 0
    module_timeout = 0
    womi_timeout = 0
    use_transactions = True
    automatically_collect_static_formats = False

    parse_volatile_info = False

    creation_logging = 'INFO'

    collxml_provider = CollectionUniversalXmlFileProvider

    def __init__(self):
        raise AssertionError('this class is not meant to be instantiated')

    @staticmethod
    def postprocess_subcollection(subcollection):
        if subcollection.md_title == '':
            new_title = u'Brak tytułu'
            debug('repairing title of %s to: %s', subcollection, new_title)
            subcollection.md_title = new_title
            subcollection.save()


    @staticmethod
    def get_module_id_from_xml_element(element):
        return element.get('document'), int(element.get(NS_CNXSI('version-at-this-collection-version'), '1'))


    @classmethod
    def import_collection(cls, identifier, version):
        return cls.import_collection_helper(identifier, version, SOURCE_VARIANT)

    @classmethod
    def import_collection_variant(cls, identifier, version, variant):
        return cls.import_collection_helper(identifier, version, variant)

    @classmethod
    @try_import
    @context_cache.wrap_with_assure_active
    def import_collection_helper(cls, identifier, version, variant):
        collxml = cls.collxml_provider.parsed(cls.subdomain, identifier, version, variant)

        lxml_collxml = cls.collxml_provider.lxml_parsed(cls.subdomain, identifier, version, variant)

        meta = collxml.find(NS_COLXML('metadata'))

        lxml_meta = lxml_collxml.find('col:metadata', namespaces=dict(col='http://cnx.rice.edu/collxml'))

        if meta is None:
            raise ImportFailure('missing metadata node')

        collection = cls.models.Collection(md_content_id=identifier, md_version=version, variant=variant)
        cls.parse_collection_meta(meta, collection)
        cls.parse_collection_meta_lxml(lxml_meta, collection)
        cls.import_object_metadata(collection)

        # TODO EPP-6694 if metadata.xml does not exist an 404-error is thrown below; it should probably be caught
        try:
            metadata_xml = cls.get_metadata_xml(identifier, version)
            collection.transformation_notifications = metadata_xml.transformation_notifications
        except MetadataXmlUnavailable:
            collection.transformation_notifications = []

        if not collection.is_source:
            occurrence_parameters = execution.MultiParameters()

            for m in collxml.findall('.//' + NS_COLXML('module')):
                module_id, version = cls.get_module_id_from_xml_element(m)
                occurrence_parameters.bind(module_id, cls.subdomain, collection.md_content_id, collection.md_version, collection.variant, module_id, version)

            with Timer('for collection %s/%s/%s: %s %s xmls prefetched in' % (identifier, version, variant, len(occurrence_parameters), 'occurrence'), info):
                coroutine.execute_all(context_cache.wrap_with_current(ModuleOccurrenceXmlFileProvider.fetched), occurrence_parameters)


        root_collection = cls.models.SubCollection(md_title=collection.md_title, parent_collection=None)
        root_collection.save()
        collection.root_collection = root_collection
        collection.save()

        ep_cover = meta.find(NS_EP('e-textbook') + '/' + NS_EP('cover'))
        if ep_cover is not None and ep_cover.text:
            cls.add_womi_reference(collection, ep_cover.text, HARDCODED_WOMI_VERSION_ONE, cls.models.WomiReference.COLLECTION_COVER_KIND)
            set_if_attribute_present(collection, 'ep_cover_type', ep_cover, NS_EP('cover-type'))

        collection.volume = int_or_none(meta.findtext(NS_EP('e-textbook') + '//' + NS_EP('volume')))

        for ep_reference in meta.findall(NS_EP('e-textbook') + '//' + NS_EP('reference')):
            if ep_reference.parent.tag == NS_EP('collection-header'):
                kind = cls.models.WomiReference.COLLECTION_HEADER_KIND
                title_presentation = ep_reference.parent.get(NS_EP('title-presentation'))
                if title_presentation:
                    cls.add_attribute(collection, name='collection-header-title-presentation', value=title_presentation, present_in_toc=True)
            elif ep_reference.parent.tag == NS_EP('collection-toc'):
                kind = cls.models.WomiReference.COLLECTION_TOC_KIND
                links = ' '.join(['%s:%s' % (link.get(NS_EP('toc-id')), link.get(NS_EP('module-id'))) for link in ep_reference.findall(NS_EP('link'))])
                cls.add_attribute(collection, name='collection-toc-mappings', value=links, present_in_toc=True)
            else:
                raise ImportFailure('ep:reference found in bad place: %s', ep_reference.parent.tag)

            cls.add_womi_reference(collection, ep_reference.get(NS_EP('id')), HARDCODED_WOMI_VERSION_ONE, kind, 'unbound')

        collection.save()

        root_collection.collection_variant = collection
        root_collection.save()
        cls.save_actors(meta, collection)


        cls.parse_collection_content(collection, 1, collxml.find(NS_COLXML('content')), collection.root_collection)

        if not collection.is_source and cls.automatically_collect_static_formats:
            cls.collect_all_static_formats(collection)

        cls.postprocess_subcollection(collection.root_collection)

        if collection.md_title == '':
            collection.md_title = collection.root_collection.md_title
            collection.save()

        if (collection.get_number_of_modules() == 1) and (next(collection.get_all_modules()).md_title == u'Treści w przygotowaniu...'):
            collection.ep_dummy = True
            collection.save()

        return collection




    @classmethod
    def get_metadata_xml(cls, identifier, version):
        return MetadataXml(cls.subdomain, identifier, version)


    @classmethod
    @try_import
    def parse_collection_content(cls, collection, idx, el, parent_collection):
        if el.tag == NS_COLXML('content'):
            for index, i in enumerate(el, 1):
                cls.parse_collection_content(collection, index, i, parent_collection)

        if el.tag == NS_COLXML('subcollection'):
            sub_collection = cls.models.SubCollection(md_title=el.findtext(NS_MD('title'), ''), order_value=idx, parent_collection=parent_collection, collection_variant=collection)
            view_attributes = el.find(NS_EP('view-attributes'))

            sub_collection.save()

            is_panorama = False
            if view_attributes is not None:
                for view_attribute in view_attributes.findall(NS_EP('view-attribute')):
                    type_ = view_attribute.get(NS_EP('type'))

                    if type_ == 'panorama':
                        identifier = view_attribute.get(NS_EP('id'))
                        is_panorama = True
                        cls.add_attribute(sub_collection, name='panorama-womi-id', value=identifier, present_in_toc=True)
                        cls.add_womi_reference(sub_collection, identifier, HARDCODED_WOMI_VERSION_ONE, cls.models.WomiReference.SUBCOLLECTION_PANORAMA_KIND)

                    elif type_ == 'icon':
                        identifier = view_attribute.get(NS_EP('id'))
                        cls.add_attribute(sub_collection, name='icon-womi-id', value=identifier, present_in_toc=True)
                        cls.add_womi_reference(sub_collection, identifier, HARDCODED_WOMI_VERSION_ONE, cls.models.WomiReference.SUBCOLLECTION_ICON_KIND)


            sub_collection.save()
            for index, i in enumerate(el, 1):
                if i != el:
                    cls.parse_collection_content(collection, index, i, sub_collection)

            cls.postprocess_subcollection(sub_collection)

            if is_panorama:
                for index, m in enumerate(sorted(filter(lambda i: isinstance(i, cls.models.ModuleOccurrence), sub_collection.module_orders.all()), key=lambda mo: mo.value), 1):
                    cls.add_attribute(m, name='panorama-order', value=str(index), present_in_toc=True)


        elif el.tag == NS_COLXML('module'):


            # TODO: EPP-1438 should it be that attribute read here?
            module_id, version = cls.get_module_id_from_xml_element(el)

            if collection.ep_environment_type == 'ee':
                if module_id.endswith('_ignore'):
                    # temporary hack, to be removed in EPP-3504
                    cls.log_created('ignoring module %s during import due to _ignore sufix', module_id)
                    return


            module = cls.reference_imported_module(identifier=module_id, version=version)

            module_occurrence = cls.models.ModuleOccurrence(value=idx, module=module, sub_collection=parent_collection)
            module_occurrence.save()

            if not collection.is_source:
                cls.parse_module_occurrence(module_occurrence)

    AUTO_MODULE_IDENTIFIER = re.compile(r'(?P<identifier>\w+)_(?P<version>\d+)_(?P<kind>bibliography|biography|concept|event|glossary)')


    @classmethod
    def wrap_import(cls, model_class, collector_routine, key_suffix, timeout, temp_mapping={}):

        if cls.use_transactions:
            wrapped_into_transaction = wrap_with_transaction(collector_routine)
        else:
            wrapped_into_transaction = collector_routine

        if cls.import_reuse:

            @functools.wraps(collector_routine)
            def wrapped_into_reuse(**kwargs):
                transformed_kwargs = {temp_mapping.get(k, k): v for k, v in kwargs.items()}
                try:
                    return model_class.objects.get(**transformed_kwargs)
                except ObjectDoesNotExist:
                    return wrapped_into_transaction(**kwargs)
        else:
            wrapped_into_reuse = wrapped_into_transaction

        wrapped_into_cache = (redis.cache_result if cls.cache_imports else redis.dummy_cache_result)(
                timeout=timeout,
                key=cls.keys_root + key_suffix,
                exceptions_include=((ImportFailure, 60), ),
            )(wrapped_into_reuse)

        return wrapped_into_cache

    @classmethod
    def add_womi_reference(cls, referrer, identifier, version, kind, position=None):
        if not identifier:
            warning('skipping womi reference addition into %s due to empty identifier', referrer)
            return None


        womi = cls.reference_imported_womi(identifier=identifier, version=version)

        womi_reference = cls.models.WomiReference(womi=womi, referrer=referrer, kind=kind, section_id=position)
        womi_reference.save()
        cls.log_created('create womi %s in %s to %s', womi_reference.nice_kind, referrer, identifier)
        return womi_reference


    @classmethod
    def add_attribute(cls, attribute_owner, name, value, present_in_toc=False):
        if value is None:
            return

        attribute = cls.models.Attribute(attribute_owner=attribute_owner, name=name, value=value, present_in_toc=present_in_toc)
        cls.log_created('create attribute %s in %s', attribute, attribute_owner)
        attribute.save()
        return attribute


    @classmethod
    def parse_module_source(cls, module_source, xml):

        module_ep_presentation = xml.find(NS_CNXML('metadata') + '/' + NS_EP('e-textbook-module') + '/' + NS_EP('presentation'))
        if module_ep_presentation is not None and module_ep_presentation.findtext('./' + NS_EP('template')) == 'tiled':
            # TODO: throw more appropriate exception on missing value
            layout = dict()
            for name in ('width', 'height'):
                layout[name] = int(module_ep_presentation.findtext(NS_EP(name)))
            tiles = []
            layout['tiles'] = tiles

            for section_ep_parameters in xml.findall(NS_CNXML('content') + '/' + NS_CNXML('section') + '/' + NS_EP(
                    'parameters')):
                if section_ep_parameters.findtext(NS_EP('tile')) == 'tile':
                    tiles.append({name: int(round(float(section_ep_parameters.findtext(NS_EP(name))))) for name in
                                ('left', 'top', 'width', 'height')})

            cls.add_attribute(module_source, name='tile-layout', value=str(layout), present_in_toc=True)


        for ep_reference in xml.findall(NS_CNXML('content') + '//' + NS_EP('reference')):
            section_id = None
            iterator = ep_reference.parent
            while iterator != xml:
                if iterator.tag == NS_CNXML('section'):
                    section_id = iterator.get('id')
                    break
                iterator = iterator.parent

            cls.add_womi_reference(module_source, ep_reference.get(NS_EP('id')).lstrip('0'), HARDCODED_WOMI_VERSION_ONE, cls.models.WomiReference.REGULAR_KIND, section_id)


        for ep_reference in xml.findall(NS_CNXML('metadata') + '/' + NS_EP('e-textbook-module') + '//' + NS_EP('reference')):
            if ep_reference.parent.tag == NS_EP('module-header'):
                kind = cls.models.WomiReference.MODULE_HEADER_UNBOUND_KIND
                cls.add_attribute(module_source, name='module-header-title-presentation', value=ep_reference.parent.get(NS_EP('title-presentation')), present_in_toc=True)
                cls.add_attribute(module_source, name='module-header-title-position', value=ep_reference.parent.get(NS_EP('title-position')), present_in_toc=True)
            elif ep_reference.parent.tag == NS_EP('play-and-learn'):
                kind = cls.models.WomiReference.PLAY_AND_LEARN_UNBOUND_KIND
            elif ep_reference.parent.tag == NS_EP('external'):
                kind = cls.models.WomiReference.EXTERNAL_UNBOUND_KIND
            else:
                raise ImportFailure('ep:reference found in bad place: %s', ep_reference.parent.tag)

            cls.add_womi_reference(module_source, ep_reference.get(NS_EP('id')), HARDCODED_WOMI_VERSION_ONE, kind, 'unbound')


        module_source.save()

        if cls.parse_volatile_info:
            module_source.referables = []
            # ignore auto-generated modules
            generated_type_node = xml.find('.//%s/%s' % (NS_EP('e-textbook-module'), NS_EP('generated-type')))
            module_source.generated_type = generated_type_node.text if generated_type_node is not None else None
            if generated_type_node is None:
                for bookmark in xml.findall('.//' + NS_EP('bookmark')):
                    module_source.referables.append({'kind': 'bookmark', 'id': bookmark.attrib[NS_EP('id')], 'name': bookmark.get(NS_EP('name'))})
                for bibliography in xml.findall('.//' + NS_BIB('entry')):
                    cls._add_referable(module_source.referables, 'bibliography', bibliography, 'id', '@' + NS_EP('target-name'))
                for biography in xml.findall(cls._get_xpath_for_element_having_glossary(NS_EP('biography'))):
                    cls._add_referable(module_source.referables, 'biography', biography)
                for concept in xml.findall(cls._get_xpath_for_element_having_glossary(NS_EP('concept'))):
                    cls._add_referable(module_source.referables, 'concept', concept, 'id', NS_CNXML('term'))
                for definition in xml.findall(cls._get_xpath_for_element_having_glossary(NS_CNXML('definition'))):
                    cls._add_referable(module_source.referables, 'definition', definition, 'id', NS_CNXML('term'))
                for event in xml.findall(cls._get_xpath_for_element_having_glossary(NS_EP('event'))):
                    cls._add_referable(module_source.referables, 'event', event)
                for rule in xml.findall(cls._get_xpath_for_element_having_glossary(NS_CNXML('rule'))):
                    cls._add_referable(module_source.referables, 'rule', rule, 'id', NS_CNXML('title'))

            module_source.module_references = [reference_manager.reference for reference_manager in cls.find_module_references(module_source.identifier, xml)]





    @classmethod
    def _get_xpath_for_element_having_glossary(cls, tag_name):
        return './/%s[@%s="true"]' % (tag_name, NS_EP('glossary'))


    @classmethod
    def _add_referable(cls, dest, kind, xml_element, name_of_id_attr=NS_EP('id'), name_of_name_element=NS_EP('name')):
        id = xml_element.get(name_of_id_attr)
        if id is not None:
            if kind in ['definition', 'rule']:
                id_prefix = 'glossary_'
            else:
                id_prefix = kind + '_'

            if name_of_name_element[0] != '@':
                el = xml_element.find(name_of_name_element)
                name = re.sub(r"\s+", ' ', extract_text_from_all_nodes(el)).strip() if el is not None else ''
            else:
                name = xml_element.get(name_of_name_element[1:])

            key_element = xml_element.find(NS_EP('sorting-key'))
            key = key_element.text if key_element is not None else name
            dest.append({'kind': kind, 'id': id_prefix + id, 'name': name, 'key': key})


    @classmethod
    def parse_module_occurrence(cls, module_occurrence):
        collection = module_occurrence.collection

        xml = ModuleOccurrenceXmlFileProvider.parsed(cls.subdomain, collection.identifier, collection.version, collection.variant, module_occurrence.module.identifier, module_occurrence.module.version)

        cls.parse_module_source(module_occurrence, xml)

        module_occurrence.ep_skip_numbering = (xml.findtext(NS_CNXML('metadata') + '/' + NS_EP('e-textbook-module') + '/' + NS_EP('presentation') + '/' + NS_EP('numbering')) == 'skip')

        # more info about that in EPP-3417
        if module_occurrence.collection.ep_environment_type == 'ee':
            contexts = list(map(lambda e: e.parent, filter(lambda e: e.text == 'true', xml.findall('.//' + NS_EP('reference') + '/' + NS_EP('context')))))
            if contexts:
                identifiers = []
                for c in contexts:
                    identifier = str(c.get(NS_EP('id')))
                    cls.add_womi_reference(module_occurrence, identifier, HARDCODED_WOMI_VERSION_ONE, cls.models.WomiReference.EXTERNAL_WORK_SHEET_KIND, position=len(identifiers))
                    identifiers.append(identifier)

                cls.add_attribute(module_occurrence, name='ee-external-work-sheet', value=','.join(identifiers), present_in_toc=True)

        module_occurrence.save()


    @classmethod
    @try_import
    def import_womi(cls, identifier, version):
        womi = cls.models.Womi(womi_id=identifier)
        womi.version = version
        cls.import_object_metadata(womi)

        womi.save()

        metadata = MetadataJsonFileProvider.parsed(cls.subdomain, womi.womi_id, womi.version)
        manifest = ManifestJsonFileProvider.parsed(cls.subdomain, womi.womi_id, womi.version)

        if cls.models.Config.store_womi_manifest_and_metadata:
            womi.metadata = metadata
            womi.manifest = manifest

        womiIds = manifest.get('womiIds', None)
        if womiIds:
            for womiId in map(str, womiIds):
                if womiId == identifier:
                    raise ImportFailure('womi contains a self-reference')
                cls.add_womi_reference(womi, womiId, HARDCODED_WOMI_VERSION_ONE, cls.models.WomiReference.GENERIC_NESTED_KIND)

        title = metadata.get("title")
        womi.title = '<undefined>' if title is None else title[:256]

        womi_type = metadata.get("womiType", "<undefined>")

        try:
            womi.womi_type = cls.models.WomiType.objects.get(name=womi_type)
        except ObjectDoesNotExist:
            error('womi type %s of womi %s is unknown', womi_type, womi)

        womi.save()
        cls.save_authors(metadata.get('author'), womi)

        return womi


    @classmethod
    def collect_static_format(cls, collection, specification_code, must_exist=False):
        specification = cls.models.CollectionStaticFormat.get_specification(specification_code)

        # psnieg: I know that this code is horrible
        if specification.category == 'mobile':
            if collection.variant != collection.metadata_xml.mobile_variant:
                return

        static_format = cls.models.CollectionStaticFormat(collection=collection, specification_code=specification_code)
        if must_exist and not static_format.check_existance():
            raise ValueError("files of static format '%s' does not exist for %s" % (specification_code, collection))

        static_format.mark_last_changed()

        # psnieg: and that also
        if static_format.specification.category == 'mobile':
            mobile_pack = collection.metadata_xml.xml.find('.//mobile-packs/mobile-pack[@resolution="%s"]' % specification.private_name)
            if mobile_pack is not None:
                static_format.uncompressed_size = mobile_pack.get('size')

        static_format.assume_presentation_defaults()
        static_format.save()
        cls.log_created('created %s', static_format)


    @classmethod
    def collect_all_static_formats(cls, collection):
        for specification_code in collection.metadata_xml.static_formats:
            cls.collect_static_format(collection, specification_code)


    @classmethod
    @try_import
    def import_module(cls, identifier, version):

        module = cls.models.Module(md_content_id=identifier, md_version=version)
        module.is_auto_generated = (cls.AUTO_MODULE_IDENTIFIER.match(identifier) is not None)

        if module.is_auto_generated:
            collection_identifier, collection_version, module_kind = identifier.split('_')
            xml = AutoModuleSourceXmlFileProvider.parsed(cls.subdomain, collection_identifier, collection_version, identifier)
        else:
            xml = ModuleSourceXmlFileProvider.parsed(cls.subdomain, identifier, version)
            cls.import_object_metadata(module)

        meta = xml.find(NS_CNXML('metadata'))
        cls.parse_module_meta(meta, module)
        module.save()
        cls.save_actors(meta, module)
        cls.parse_module_source(module, xml)

        return module


    @classmethod
    @ignore_problems
    def save_actors(cls, el, content):
        # debug('saving actors of %s', content)
        actors = el.find(NS_MD('actors'))
        roles = el.find(NS_MD('roles'))
        if actors is None or roles is None:
            return

        authors_map = { actor.get('userid'): cls.add_actor(actor) for actor in actors }

        parsed_roles = []
        new_mode = False

        for role_number, role in enumerate(roles.findall(NS_MD('role')), 1):
            role_type = role.get('type')
            try:
                userids = role.text.split(' ')

                if role_type != LEGACY_AUTHORSHIP_FORMAT_ROLE_TYPE or len(userids) > 1:
                    new_mode = True

                parsed_roles.append((role_number, role_type, userids))
            except Exception as e:
                # this should be warning at least, but there is a great many of
                # GE collections with broken actors section
                debug('failed to parse authors for %s', content)
                continue

        authors_added = 0
        for role_number, role_type, userids in parsed_roles:
            for userid in userids:
                authors_added += 1

                authorship = cls.models.Authorship(
                    authored_content=content,
                    author=authors_map[userid],
                    order_number=authors_added,
                    role_number=role_number if new_mode else 1,
                    role_type=role_type if new_mode else 'Autorzy',
                )
                authorship.save()


        content.save()


    @classmethod
    def add_actor(cls, xml):

        if xml.tag == NS_MD('person'):
            author, created = cls.models.Author.objects.get_or_create(
                kind=cls.models.Author.PERSON_KIND,
                md_email=xml.findtext(NS_MD('email')),
                md_full_name=xml.findtext(NS_MD('fullname')),
                md_first_name=xml.findtext(NS_MD('firstname')),
                md_surname=xml.findtext(NS_MD('surname'), 'nieznany'),
                md_institution='',
            )
        else:
            author, created = cls.models.Author.objects.get_or_create(
                kind=cls.models.Author.ORGANIZATION_KIND,
                md_full_name=xml.findtext(NS_MD('fullname')),
                md_first_name=xml.findtext(NS_MD('shortname')),
                md_surname='',
                md_email='',
                md_institution='',
            )
        if created:
            cls.log_created('created new author: %s', author)
        return author


    @classmethod
    @ignore_problems
    def save_authors(cls, meta_authors, content):

        class MetaAuthor:
            fullname = ""
            firstname = ""
            surname = ""

            def __init__(self, fullname):
                self.fullname = fullname
                self.firstname, self.surname = fullname.rsplit(' ',1)

        authors = []
        if isinstance(meta_authors, basestring):
            meta_authors = [author.strip() for author in meta_authors.split(',')]
        if isinstance(meta_authors, (list, tuple)):
            authors.extend(meta_authors)

        authors = [ cls.add_author(MetaAuthor(author)) for author in authors ]

        authors_added = 0
        for author in authors:
            authors_added += 1
            authorship = cls.models.Authorship(
                authored_content=content,
                author=author,
                order_number=authors_added,
                role_number=1,
                role_type='Autorzy',
            )
            authorship.save()

        content.save()


    @classmethod
    def add_author(cls, author):

        db_author, created = cls.models.Author.objects.get_or_create(
            kind=cls.models.Author.PERSON_KIND,
            md_full_name=author.fullname,
            md_first_name=author.firstname,
            md_surname=author.surname,
            md_email='',
            md_institution='',
        )
        if created:
            cls.log_created('created new author: %s', db_author)
        return db_author


    @classmethod
    def parse_meta(cls, el, content):

        md_repository = el.find(NS_MD('repository'))

        md_content_url = el.find(NS_MD('content-url'))
        #collection.md_content_id

        content_id = el.findtext(NS_MD('content-id'))
        version = int(el.findtext(NS_MD('version'), 1))

        if content.md_content_id != content_id:
            # warning('mismatching identifier: %s and %s' % (content.md_content_id, content_id))
            raise ImportFailure('mismatching identifier: %s and %s' % (content.md_content_id, content_id))
        if int(content.md_version) != version:
            # warning('mismatching version: %s and %s' % (content.md_version, version))
            raise ImportFailure('mismatching version: %s and %s' % (content.md_version, version))


        content.md_title = el.findtext(NS_MD('title'), '')

        #2013/04/04 04:21:23.149 GMT-5
        content.md_created = repair_date(parse(el.findtext(NS_MD('created')), fuzzy=True))

        content.md_revised = repair_date(parse(el.findtext(NS_MD('revised')), fuzzy=True))

        content.md_license = el.find(NS_MD('license')).get('url')

        md_abstract = el.find(NS_MD('abstract'))
        if md_abstract is not None and md_abstract.text is not None:
            content.md_abstract = md_abstract.text
        else:
            content.md_abstract = None

        content.md_language = el.findtext(NS_MD('language'))

        if cls.parse_volatile_info:
            origin_id = el.findtext(NS_EP('origin-id'))
            origin_version = el.findtext(NS_EP('origin-version'), '1')
            if origin_id is not None:
                content.origin = cls.reference_imported_function(content.category)(origin_id, origin_version)
            else:
                content.origin = None


    @classmethod
    def parse_collection_meta(cls, el, content):
        cls.parse_meta(el, content)

        subtitle = el.find(NS_MD('subtitle'))
        if subtitle is not None:
            content.md_subtitle = subtitle.text

        institution = el.find(NS_MD('institution'))
        if institution is not None:
            content.md_institution = institution.text

        subject_list = el.find(NS_MD('subjectlist'))
        subject = None
        if subject_list is not None:
            subject_tag = subject_list.find(NS_MD('subject'))
            if subject_tag is not None and subject_tag.text is not None:
                subject = cls.models.Subject.objects.get(md_name__iexact=subject_tag.text)
                if subject is not None:
                    content.md_subject = subject

        education_level_list = el.find(NS_MD('education-levellist'))
        education_level = None

        if education_level_list is not None and len(education_level_list) != 0:
            education_level = education_level_list[0].text

        e_textbook = el.find(NS_EP('e-textbook'))
        ep_class = None
        ep_stylesheet = None

        if e_textbook is not None:
            content.ep_content_status = e_textbook.get(NS_EP('content-status'))
            content.ep_recipient = e_textbook.get(NS_EP('recipient'))
            content.ep_version = float(e_textbook.get(NS_EP('version')))
            ep_class = e_textbook.find(NS_EP('class'))
            ep_stylesheet = e_textbook.find(NS_EP('stylesheet'))
            set_if_present(content, 'ep_environment_type', e_textbook, NS_EP('environment-type'))

        if education_level is not None:
            try:
                content.md_school = cls.models.SchoolLevel.objects.get(md_education_level=education_level,
                                                            ep_class=(ep_class.text if ep_class is not None else None))
            except ObjectDoesNotExist:
                pass

        if ep_stylesheet is not None:
            content.ep_stylesheet = ep_stylesheet.text



    @classmethod
    def parse_module_meta(cls, el, module):
        cls.parse_meta(el, module)

        if not module.md_title:
            module.md_title = u'Anonimowy moduł'

        e_textbook_module = el.find(NS_EP('e-textbook-module'))
        module.ep_content_status = e_textbook_module.get(NS_EP('content-status'))
        module.ep_recipient = e_textbook_module.get(NS_EP('recipient'))
        module.ep_version = float(e_textbook_module.get(NS_EP('version')))

        ep_presentation = e_textbook_module.find(NS_EP('presentation'))
        if ep_presentation is not None:
            module.ep_presentation_type = ep_presentation.findtext(NS_EP('type'), None)

        module.ep_presentation_template = el.findtext('.//' + NS_EP('e-textbook-module') + '/' + NS_EP('presentation') + '/' + NS_EP('template'), 'linear')

        return module

    @classmethod
    def reference_imported_function(cls, category):

        if category == 'collection':
            return cls.reference_imported_collection

        if category == 'module':
            return cls.reference_imported_module

        if category == 'womi':
            return cls.reference_imported_womi

        raise Exception('unknown category: %s' % category)


    @classmethod
    def imported_function(cls, category):

        if category == 'collection':
            return cls.imported_collection

        if category == 'module':
            return cls.imported_module

        if category == 'womi':
            return cls.imported_womi

        raise Exception('unknown category: %s' % category)


    @classmethod
    def purge_receiver(cls, sender, category, identifier, version, **kwargs):
        cls.imported_function(category).purge(identifier, version)

    @classmethod
    def find_module_references(cls, source_identifier, xml):

        for reference_node in xml.findall('.//' + NS_CNXML('link')):
            yield ModuleReferenceManager(source_identifier, 'link', reference_node)

        for referable_type in ('bibliography', 'biography', 'concept', 'glossary', 'event'):
            reference_tag_name = NS_EP(referable_type + '-reference')
            for reference_node in xml.findall('.//' + reference_tag_name):
                yield ModuleReferenceManager(source_identifier, referable_type, reference_node)

    @classmethod
    def import_object_metadata(cls, obj):
        import repo.objects
        obj.edition_timestamp = repo.objects.drivers.bind(obj.category, obj.identifier, obj.version).get_edition_timestamp()

    @classmethod
    def parse_collection_meta_lxml(cls, meta, collection):
        sig = meta.find('.//ep:signature', namespaces=dict(ep='http://epodreczniki.pl/'))
        collection.ep_signature = stringify_children(sig) if sig is not None else None


def import_collection_helper(collection_id, version, variant):
    if variant == 'all':
        return [import_collection_helper(collection_id, version, v) for v in MetadataXml('content', collection_id, version).variant_names]

    collection = inside_db_transaction(ContentParser.import_collection_variant, collection_id, version, variant)

    status_code = 500 if collection is None else 201

    return {'status_code': status_code,
            'content': {'statistics': {}}}


@wrap_with_transaction
def reimport_collection(collection_id, version):
    collections = list(common.models.Collection.objects.filter(md_content_id=collection_id, md_version=version))
    published = collections[0].md_published
    variants = [c.variant for c in collections]

    for c in collections:
        c.delete()

    # for o in common.models.ModuleOccurrence.objects.all():
    #     info('remaining occurrence: %s', o)

    new_collections = []

    for v in variants:
        collection = ContentParser.import_collection_variant(collection_id, version, v)
        new_collections.append(collection)
        collection.md_published = published
        collection.save()

    return new_collections





class MetadataXml(object):
    def __init__(self, subdomain, collection_id, version):
        self.subdomain = subdomain
        self.collection_id = collection_id
        self.version = version

    def _variants(self):
        variants = self.xml.find('variants')
        if variants is None:
            return []
        return variants.findall('variant')

    @cached_property
    def xml(self):
        return MetadataXmlFileProvider.parsed(self.subdomain, self.collection_id, self.version)

    @cached_property
    def variant_names(self):
        return [v.get('name') for v in self._variants()]

    @cached_property
    def static_formats(self):
        node = self.xml.find('static-formats')
        if node is None or node.text is None:
            return []
        return node.text.split(' ')

    @cached_property
    def mobile_variant(self):
        if not bool(self.variant_names):
            return None
        return ('teacher-canon' if 'teacher-canon' in self.variant_names else self.variant_names[0])

    @cached_property
    def transformation_notifications(self):
        node = self.xml.find('notifications')
        if node is None:
            return []
        return [{ 'type': n.get('type'), 'message': n.get('message') } for n in node]



def map_as_drivers(drivers, iterable):
    for i in iterable:
        yield i.as_driver(drivers)

def filter_category(category, objects):
    for obj in objects:
        if obj.category == category:
            yield obj

def validate_collection(collection):

    for module in collection.modules:
        for reference in module.module_references:
            if reference.identifier != module.identifier:
                try:
                    referenced_module = collection.get_module_by_id(reference.identifier)
                except KeyError:
                    error('referenced module %s not found', reference.identifier)


def extract_text_from_all_nodes(root):
    texts = []
    if root.text is not None:
        texts.append(root.text)
    for el in root:
        sub = extract_text_from_all_nodes(el)
        if len(sub) > 0:
            texts.append(sub)
        if el.tail is not None:
            texts.append(el.tail)
    return ' '.join(texts)


