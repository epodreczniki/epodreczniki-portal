# coding=utf-8
from __future__ import absolute_import


import datetime
import io
import zipfile
import json

from .storage import Storage
from editstore import exceptions
from . import keys
from os import path
from django.template import loader, Context
from django.conf import settings
from repository.utils import fetch_and_parse_xml, print_xml, map_as_drivers
from repository.namespaces import *
from django.core.urlresolvers import reverse
from collections import OrderedDict
import store.objects
import store.files
import store.signals
from editstore import locks
from surround.django.utils import ExtendedOrigin, get_arg_from_post_then_get
import editcommon.objects
from common import url_providers
from surround.django.utils import always_string
from django.utils.functional import cached_property
from django.contrib.auth.models import User
from . import models
from repo.drivers.base import MODIFICATION_IN_TOTAL_PAST
from common.objects import BareDriver

from . import utils
from . import files
from . import history

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

DEFAULT_TEMPLATE_CODE = 'standard'

PRESENTATION_SIBLINGS_MAX = 10


class ObjectLabel(unicode):
    pass


class UserLabel(ObjectLabel):
    is_user = True


class AutoLabel(ObjectLabel):
    is_user = False


class EditorPresentationDriver(object):

    presentation_kind = 'editor'

    def __init__(self, driver, label, url):
        self.driver = driver
        self.presentation_label = label
        self.presentation_url = url

    @property
    def presentation_siblings(self):
        return (self.driver.presentation_editors, False)


    @property
    def presentation_parent(self):
        return self.driver





class CategoryListingDriver(object):

    presentation_kind = 'listing'

    def __init__(self, space_driver, category, user=None):
        self.category = category
        self.space_driver = space_driver
        self.user = user

    @classmethod
    def bind(cls, space_driver, category, user=None):
        return cls(space_driver, category, user)

    @property
    def presentation_siblings(self):
        return ([self.bind(self.space_driver, category, user=self.user) for category in ('collection', 'module', 'womi')], False)


    @property
    def presentation_parent(self):
        return self.space_driver


    @cached_property
    def presentation_label(self):
        return self.driver_class.nice_plural

    @cached_property
    def objects_count(self):
        return self.space_driver.db_space.content_objects.filter(category=self.category).count()


    @cached_property
    def presentation_url(self):
        return reverse('editres.views.listing', args=[self.space_driver.identifier, self.category])

    @cached_property
    def driver_class(self):
        return drivers.get(self.category)


    @cached_property
    def nice_single(self):
        return self.driver_class.nice_single

    @cached_property
    def nice_plural(self):
        return self.driver_class.nice_plural


class UserInSpaceDriver(object):

    def __init__(self, space_driver, username, user=None):
        self.space_driver = space_driver
        self.username = username
        self.user = user


    @cached_property
    def bound_user(self):
        return User.objects.get(username=self.username)


    @classmethod
    def bind(cls, space_driver, username, user=None):
        return cls(space_driver, username, user=user)


    @classmethod
    def bind_from_object(cls, space_driver, bound_user, user=None):
        driver = cls(space_driver, bound_user.username, user=user)
        driver.bound_user = bound_user
        return driver


    @cached_property
    def roles(self):
        return {role.role: role.get_role_display() for role in models.UserRoleInSpace.objects.filter(space=self.space_driver.db_space, user=self.bound_user)}



class CategoryDriverMixin(history.StreamMixin, editcommon.objects.ContentDriverMixin):


    storage = Storage
    is_repo_driver = False
    is_edition_driver = True
    models = models
    _space = None

    presentation_kind = 'object'

    @classmethod
    def template_description(cls):
        return {
            'category': cls.category,
            'nice_plural': cls.nice_plural,
        }

    @classmethod
    def get_parser(cls):
        import editcommon.parsers
        return editcommon.parsers.EditCommonParser


    _lock = None

    def send_object_signal(self, signal):
        signal.send_robust(sender='edition', category=self.category, identifier=self.identifier, version=self.version)

    def notify_added(self):
        self.send_object_signal(store.signals.object_added)

    def notify_modified(self):
        self.send_object_signal(store.signals.object_modified)

    def notify_deleted(self):
        self.send_object_signal(store.signals.object_deleted)

    def does_exist_in_repo(self):
        import repo.objects
        return repo.objects.drivers.convert(self).does_exist()

    def raise_for_space(self):
        if self.db_object.space != self.space:
            raise exceptions.MismatchingSpaceException()

    def does_exist_anywhere(self):
        return self.does_exist() or self.does_exist_in_repo()



    def _create_from_template(self, template_name):
        raise NotImplementedError()

    def create_from_template(self, template_name=DEFAULT_TEMPLATE_CODE):
        if not template_name in self.TEMPLATES.values():
            raise exceptions.InvalidOperationException('invalid template name')

        self._create_from_template(template_name)

    # TODO: is this simple as below? think about caching or storing large zips
    @staticmethod
    def in_memory_zip(files):
        archive = io.BytesIO()
        zf = zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED)
        try:
            for f in files:
                zf.writestr(f.filename, f.content)
        finally:
            zf.close()

        archive.seek(0)
        return archive.read()

    def generate_package(self):
        return self.in_memory_zip(self.files)


    @property
    def spaceid(self):
        return self.space.identifier


    @cached_property
    def editor_url(self):
        return reverse('editres.views.edit', args=[self.spaceid, self.category, self.identifier, self.version])


    @property
    def lock(self):
        if self._lock is not None:
            return self._lock

        return self.bind_lock(origin=ExtendedOrigin.empty())

    def bind_lock_from_request(self, request):
        return self.bind_lock(lockid=get_arg_from_post_then_get(request, 'lockid', None), origin=ExtendedOrigin.from_request(request))

    def bind_lock(self, lockid=None, origin=None):
        self._lock = locks.ObjectLockManager(lockid=lockid, user=self.user, origin=origin, driver=self)
        return self._lock

    @cached_property
    def leading_editor(self):
        return self.leading_file.specialized_editor


    def _fill_json_state(self, result):
        result["place"] = 'edit'
        editor = self.leading_file.specialized_editor
        if editor is not None:
            result["editor"] = {
                "url": editor.presentation_url,
                "text": editor.presentation_label,
            }



    def seal(self):

        store.signals.object_purge.send_robust('repo', category=self.category, identifier=self.identifier, version=self.version)

        for dependency in self.parsed_object.dependencies:
            dependency_driver = dependency.as_driver(editcommon.objects.drivers)
            bare_driver = BareDriver.bind(dependency.category, dependency.identifier, dependency.version)

            if dependency_driver is None:
                raise exceptions.DependencyDoesNotExist(str(bare_driver), dependency=bare_driver)
            if not dependency_driver.is_repo_driver:
                raise exceptions.DependencyNotSealed(str(dependency_driver), dependency=bare_driver)

        sealed_driver = self.repository.seal_object(self)

        store.signals.object_purge.send_robust(sender='repo', category=sealed_driver.category, identifier=sealed_driver.identifier, version=sealed_driver.version)

        sealed_driver = sealed_driver.rebind_self()

        for file in self.files:
            sealed_file = sealed_driver.bind_file_driver(file.filename)
            if not sealed_file.exists:
                raise exceptions.SealedFileMismatch('file %s is missing after sealing %s' % (file.filename, self))

            if not file.compare_content(sealed_file):
                raise exceptions.SealedFileMismatch('sealed file %s differs between %s and %s' % (file.filename, self, sealed_driver))


        self.delete()

        return sealed_driver


    def create_from(self, source):
        source.raise_for_exists()
        return self._create_from(source)


    def create_from_edition(self, source):
        return self.create_from(source)


    def create_from_repository(self, source):
        import repo.objects
        repo.objects.drivers.validate(source)

        if (source.category == 'womi') and (source.parsed_object.womi_type.name != 'interactive'):
            raise exceptions.UnsupportedObjectImportFailure('import of womi %s/%s of type %s is not supported' % (source.identifier, source.version, source.parsed_object.womi_type))

        source.repository.raise_for_object_importability(source)

        if repo.objects.drivers.convert(self).does_exist():
            raise exceptions.ObjectAlreadyExistInRepository('%s %s/%s already exists in repository' % (self.category, self.identifier, self.version))

        # from IPython import embed ; embed()
        if not source.does_exist():
            raise exceptions.ObjectDoesNotExistInRepository('%s %s/%s does not exist in repository' % (source.category, source.identifier, source.version))

        return self._create_from(source)

    @cached_property
    def is_sealable(self):
        return self.category in self.repository.can_seal_objects

    def rename_from_edition(self, source):
        import repo.objects
        self.space = source.space
        drivers.validate(source)

        if repo.objects.drivers.convert(self).does_exist():
            raise exceptions.ObjectAlreadyExistInRepository('%s %s/%s already exists in repository' % (self.category, self.identifier, self.version))

        if not source.does_exist():
            raise exceptions.ObjectDoesNotExistInRepository('%s %s/%s does not exist in edition' % (source.category, source.identifier, source.version))

        return self._create_from(source)

    def log(self, level, message, *args, **kwargs):
        self.lock.log(level, message, *args, **kwargs)

    @cached_property
    def user_effective_roles(self):
        if self.user is None:
            return []
        return self.space_driver.user_effective_roles

    def fill_db_object_on_creation(self, db_object):
        db_object.space = self.space

    @property
    def space(self):
        if self._space is None:
            if self.does_exist():
                self._space = self.db_object.space
        return self._space

    @space.setter
    def space(self, value):
        self._space = value

    @cached_property
    def space_driver(self):
        return SpaceDriver.bind_db_object(self.db_object.space, self.user)

    @cached_property
    def category_driver(self):
        return CategoryListingDriver.bind(self.space_driver, self.category, user=self.user)

    @cached_property
    def user_driver(self):
        return UserDriver(self.user.username)


    @property
    def has_read_perm(self):
        return not self.does_exist() or self.space_driver.has_read_perm

    @property
    def has_write_perm(self):
        return not self.does_exist() or self.space_driver.has_write_perm
        # return (self.user is not None) and (not self.user.is_anonymous()) and (self.user.is_staff or self.user.has_perm('common.can_access_all_%s' % self.category) or (not self.does_exist()) or self.db_object.space.users.filter(user=self.user).exists())

    def raise_for_read_perm(self):
        self.space_driver.raise_for_read_perm()

    def raise_for_write_perm(self):
        self.space_driver.raise_for_write_perm()

    def clear_origin(self):
        raise NotImplementedError()



    @property
    def presentation_siblings(self):

        objects = list(self.space_driver.db_space.content_objects.filter(category=self.category)[:PRESENTATION_SIBLINGS_MAX + 1])
        return ([obj.bind_driver(user=self.user, space=self.space_driver.db_space) for obj in objects[:PRESENTATION_SIBLINGS_MAX]], len(objects) > PRESENTATION_SIBLINGS_MAX)



    @property
    def presentation_parent(self):
        return CategoryListingDriver.bind(self.space_driver, self.category, user=self.user)


    @cached_property
    def presentation_label(self):
        return self.title


    @cached_property
    def presentation_url(self):
        return self.editor_url


    @cached_property
    def presentation_editors(self):
        return [self.leading_editor, self.leading_file.text_editor]


    def get_edition_timestamp(self):
        return MODIFICATION_IN_TOTAL_PAST


    def push_history_entry(self, template_name, style=None, extra=None, all_streams=True):
        context = { 'driver': self }
        if extra:
            context.update(extra)

        history.push_entry(template_name, context, style=style, streams=[self, self.space_driver, self.user_driver])


    @cached_property
    def stream_key(self):
        return '-'.join(['object', self.category, self.identifier])




class XmlDriverMixin(object):

    def _create_from_template(self, template_name):

        template = loader.get_template('editstore/objects/new_%s_template_%s.xml' % (self.category, template_name))
        context = Context({
            self.category + '_id': self.identifier,
            self.category + '_version': self.version,
            'identifier': self.identifier,
            'version': self.version,
            'timestamp': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'),
            'author_user': self.user,
            'title': self.title_template_pattern,
        })
        rendered = unicode(template.render(context)).encode('utf-8')

        self.create([store.files.SimpleInMemoryFileDriver(self.category + '.xml', rendered)])


    def _setup_identifiers(self, xml, source):
        from repository.utils import get_or_add_xml_node
        metadata = xml.find(self.metadata_xml_namespace('metadata'))

        metadata.find(NS_MD('content-id')).text = str(self.identifier)
        metadata.find(NS_MD('version')).text = str(self.version)

        if self.identifier != source.identifier:
            get_or_add_xml_node(metadata, NS_EP('origin-id')).text = str(source.identifier)
            get_or_add_xml_node(metadata, NS_EP('origin-version')).text = str(source.version)


    def clear_origin(self):
        with self.main_file.change_parsed_content() as xml:
            metadata = xml.find(self.metadata_xml_namespace('metadata'))
            for node_names in ('origin-id', 'origin-version'):
                node = metadata.find(NS_EP(node_names))
                if node is not None:
                    metadata.remove(node)





class CollectionDriver(XmlDriverMixin, CategoryDriverMixin, store.objects.CollectionDriver):


    store_file_class = files.CollectionXmlFileDriver

    metadata_xml_namespace = NS_COLXML

    TEMPLATES = OrderedDict([
        ('pusta kolekcja', 'standard'),
    ])

    title_template_pattern = 'Nowa kolekcja'
    nice_single = u'kolekcja'
    nice_plural = u'kolekcje'

    @classmethod
    def bind(cls, identifier, version, user=None):

        if DummyCollectionDriver.is_dummy_identifier(identifier):
            return DummyCollectionDriver(identifier, version, user)

        return cls(identifier, version, user)


    def available_modules(self):
        o = self.parsed_object
        modules = []

        def lookup(subcoll):
            for sc in subcoll.subcollections.all():
                lookup(sc)

            for mo in subcoll.module_orders.all():
                d = drivers.bind('module', mo.module.md_content_id, mo.module.md_version, self.user)
                module = {'identifier': mo.module.md_content_id, 'version': mo.module.md_version, 'object': d, 'exists': False}
                if d.does_exist():
                    module['exists'] = True
                modules.append(module)

        lookup(o.root_collection)
        return modules


    def _create_from(self, source):
        xml = fetch_and_parse_xml(url_providers.get_collection_xml_url('preview', source.identifier, source.version))

        self._setup_identifiers(xml, source)

        # idea behing that logic is described in EPP-6040
        editor = xml.find(NS_COLXML('metadata') + '/' + NS_EP('e-textbook') + '/' + NS_EP('editor'))
        if editor is not None:
            if editor.text == 'edition-online':
                pass
            elif editor.text == 'external-final':
                info('importing collection in external-final editor state')
                editor.text = 'edition-online'
            elif editor.text == 'external-in-progress':
                error('attempt to import collection in external-in-progress editor state')
                raise exceptions.InvalidEditorStateObjectImportFailure('%s is in invalid editor state' % self)
        else:
            debug('collection has no ep:editor state set - leaving it that way')


        self.create([store.files.SimpleInMemoryFileDriver(self.category + '.xml', print_xml(xml))])

    def change_module_dependency(self, old_dependency, new_module):

        with self.main_file.change_parsed_content() as xml:
            for element in xml.findall('.//' + NS_COLXML('module')):
                that_dependency = editcommon.objects.drivers.bind('module', element.get('document'), int(element.get(NS_CNXSI('version-at-this-collection-version'), '1')))
                if that_dependency == old_dependency:
                    element.set('document', new_module.identifier)
                    element.set(NS_CNXSI('version-at-this-collection-version'), str(new_module.version))
                    if element.get('version') != 'latest':
                        element.set('version', str(new_module.version))







class DummyCollectionDriver(CollectionDriver):

    store_file_class = files.DummyCollectionXmlFileDriver

    def __init__(self, identifier, version, user=None):
        super(DummyCollectionDriver, self).__init__(identifier, version, user)
        self.module_identifier = identifier[5:]

    @staticmethod
    def get_dummy_collection_id(module_id):
        return 'dummy' + module_id


    @staticmethod
    def is_dummy_identifier(identifier):
        return identifier.startswith('dummy')





class ModuleDriver(XmlDriverMixin, CategoryDriverMixin, store.objects.ModuleDriver):

    TEMPLATES = OrderedDict([
        ('zwykły moduł', 'standard'),
        ('moduł kaflowy', 'tiles'),
    ])

    store_file_class = files.ModuleXmlFileDriver

    metadata_xml_namespace = NS_CNXML

    title_template_pattern = 'Nowy moduł'
    nice_single = u'moduł'
    nice_plural = u'moduły'

    @cached_property
    def first_referrencing_collection(self):

        drivers = self.space_driver.all_existing_in_category('collection')

        for d in drivers:
            try:
                if d.parsed_object.does_contain_module(self.identifier, self.version):
                    return d
            except Exception as e:
                debug('failed to check %s during search of referencing collections for %s: %s', d, self, e)

        return None

    def get_referencing_collections_drivers(self, list_all=False, with_dummy=False):

        if with_dummy:
            yield self.dummy_collection_driver

        if list_all:
            drivers = CollectionDriver.all_existing_as_drivers(user=self.user, list_all=True)
        else:
            drivers = self.space_driver.all_existing_in_category('collection')

        for d in drivers:
            try:
                if d.parsed_object.does_contain_module(self.identifier, self.version):
                    yield d
            except Exception as e:
                debug('failed to check %s during search of referencing collections for %s: %s', d, self, e)


    @cached_property
    def preview_url(self):
        if not settings.EPO_HAS_DEDICATED_SK:
            return None
        return reverse('editres.views.preview_module_selection', args=[self.spaceid, self.identifier, self.version])



    @property
    def dummy_collection_driver(self):
        return CollectionDriver.bind(DummyCollectionDriver.get_dummy_collection_id(self.identifier), self.version, self.user)

    ATTRIBUTES_CONTAINING_SELF_IDENTIFIER = {
        NS_EP('id'): (
            NS_EP('content'),
            NS_EP('command'),
            NS_EP('gallery'),
            NS_EP('technical-remarks'),
            NS_EP('alternative'),
            NS_EP('lead'),
            NS_EP('revisal'),
            NS_EP('effect'),
            NS_EP('biography'),
            NS_EP('student-work'),
            NS_EP('instruments'),
            NS_EP('instructions'),
            NS_EP('procedure-instructions'),
            NS_EP('conclusions'),
            NS_EP('objective'),
            NS_EP('event'),
            NS_EP('problem'),
            NS_EP('experiment'),
            NS_EP('observation'),
            NS_EP('hypothesis'),
            NS_EP('step'),
            NS_EP('intro'),
            NS_EP('tooltip'),
            NS_EP('tooltip-reference'),
            NS_EP('concept-reference'),
            NS_EP('biography-reference'),
            NS_EP('bibliography-reference'),
            NS_EP('glossary-reference'),
            NS_EP('experiment'),
            NS_EP('comment'),
            NS_EP('event'),
            NS_EP('prerequisite'),
            NS_EP('concept'),
            NS_EP('zebra-point'),
            NS_EP('fold-point'),
        ),
        NS_EP('instance-id'): (NS_EP('reference'),),
        'id': (
            NS_CNXML('para'),
            NS_CNXML('problem'),
            NS_CNXML('section'),
            NS_CNXML('list'),
            NS_CNXML('note'),
            NS_CNXML('exercise'),
            NS_CNXML('solution'),
            NS_CNXML('example'),
            NS_CNXML('equation'),
            NS_CNXML('quote'),
            NS_CNXML('definition'),
            NS_CNXML('meaning'),
            NS_CNXML('rule'),
            NS_CNXML('statement'),
            NS_CNXML('proof'),
            NS_CNXML('code'),
            NS_CNXML('commentary'),
            NS_CNXML('table'),
            NS_EP('concept'),
            NS_BIB('entry'),
            NS_QML('item'),
            NS_QML('answer')
        ),
        NS_EP('target-name'): (
            NS_BIB('entry'),
        ),
        NS_EDITOR('id'): (NS_EDITOR('comment'), NS_EDITOR('review')),
        'userid': (NS_MD('person'),),
        'answer': (NS_QML('key'),)
    }

    TEXT_NODES_CONTAINING_SELF_IDENTIFIER = (
        NS_MD('role'),
        NS_CNXML('title'),
        NS_MD('title'),
    )

    TEXT_NODES_CONTAINING_SELF_IDENTIFIER_ALLOWED = (
        NS_EP('origin-id'),
    )


    def _create_from(self, source):
        xml = fetch_and_parse_xml(url_providers.get_module_xml_url('preview', source.identifier, source.version))

        self._setup_identifiers(xml, source)
        xml.set('id', self.identifier)
        xml.set('module-id', self.identifier)

        if self.identifier != source.identifier:
            self._change_identifier(xml, source.identifier)

        self.create([store.files.SimpleInMemoryFileDriver(self.category + '.xml', print_xml(xml))])


    def _change_identifier(self, xml, source_identifier):
        total_count = 0
        proper_count = 0

        debug("changing module's self identifier occurrences in %s", self)

        def substitute_identifiers(value):
            return value.replace(source_identifier, self.identifier)

        for node in xml.iter():
            if node.text is not None:
                text_count = node.text.count(source_identifier)
                if text_count > 0:

                    if node.tag in self.TEXT_NODES_CONTAINING_SELF_IDENTIFIER_ALLOWED:
                        continue

                    total_count += text_count

                    if node.tag not in self.TEXT_NODES_CONTAINING_SELF_IDENTIFIER:
                        error('identifier still found in text of %s node in %s', node, self)
                        continue

                    node.text = substitute_identifiers(node.text)
                    proper_count += text_count


            for attribute, value in node.attrib.items():
                count = value.count(source_identifier)
                total_count += count
                if count == 0:
                    continue
                registered_attributes = self.ATTRIBUTES_CONTAINING_SELF_IDENTIFIER.get(attribute)
                if registered_attributes is None:
                    error('identifier found in unregistered attribute: %s="%s" of %s in %s', attribute, value, node, self)
                    continue

                if node.tag not in registered_attributes:
                    error('identifier found in attribute in unregistered node: %s="%s" of %s in %s', attribute, value, node, self)
                    continue

                node.set(attribute, substitute_identifiers(value))
                # sub
                # debug('identifier found in proper place: %s="%s" of %s in %s', attribute, value, node, )
                proper_count += count

        bad_count = total_count - proper_count
        if bad_count > 0:
            error('module %s self identifier occurrences found in %s unregistered places (out of %s)', self, bad_count, total_count)
            raise exceptions.ObjectImportFailure('module identifier found in unregistered places')



    def notify_deleted(self):
        super(ModuleDriver, self).notify_deleted()
        self.dummy_collection_driver.notify_deleted()

    @property
    def effective_cover_url(self):
        if self.first_referrencing_collection:
            return self.first_referrencing_collection.effective_cover_url
        else:
            from front.templatetags.collection_cover import repair_collection_cover_url
            return repair_collection_cover_url()



class WomiDriver(CategoryDriverMixin, store.objects.WomiDriver):

    store_file_class = files.WomiFileDriver
    nice_single = u'WOMI'
    nice_plural = u'WOMI'

    METADATA_TEMPLATE = {
        "author": "N/A",
        "title": u"Nie wypełniono",
        "keywords": [],
        "license": "CC0",
        "alternativeText": "N/A"
    }

    TEMPLATES = OrderedDict([
        ('puste womi', 'standard'),
        ('dgd-1', 'dgd-1.zip'),
        ('dgs-1', 'dgs-1.zip'),
        ('dgt-1', 'dgt-1.zip'),
        ('tmw-1', 'tmw-1.zip'),
        ('ut-1', 'ut-1.zip'),
        ('ut-2', 'ut-2.zip'),
        ('zj-1', 'zj-1.zip'),
        ('zw-1', 'zw-1.zip'),
        ('zw-2', 'zw-2.zip'),
    ])


    def _create_from_template(self, template_name):
        files = [store.files.SimpleInMemoryFileDriver('metadata.json', json.dumps(self.METADATA_TEMPLATE, indent=4))]

        if template_name != DEFAULT_TEMPLATE_CODE:
            template_zip = template_name
        else:
            template_zip = None

        if template_zip is not None:
            selected_zip = zipfile.ZipFile(
                path.join(path.dirname(path.realpath(__file__)), 'resources', template_zip))
            zip_files = [store.files.SimpleInMemoryFileDriver(name, selected_zip.read(name)) for name in selected_zip.namelist()]
            files += zip_files
        self.create(files)




    def _create_from(self, source):
        self.create(source.files)


    @property
    def auto_labels(self):
        labels = set()
        try:
            labels.add(AutoLabel(self.metadata_json["womiType"]))
        except Exception as e:
            pass
        return labels

drivers = store.objects.DriversMultiplexer(CollectionDriver, ModuleDriver, WomiDriver)

class RootPresentationDriver(object):

    presentation_kind = 'root'

    @cached_property
    def presentation_label(self):
        return 'Edycja Online'


    @cached_property
    def presentation_url(self):
        return reverse('editres.views.landing_page')


class UserDriver(history.StreamMixin):

    def __init__(self, username):
        self.username = username


    @classmethod
    def bind_from_object(cls, user):
        return cls(user.username)


    @cached_property
    def stream_key(self):
        return '-'.join(['user', self.username])


class SpaceDriver(history.StreamMixin):

    presentation_kind = 'space'

    def __init__(self, identifier, db_space, user):
        self.identifier = identifier
        self.user = user

        if db_space is not None:
            self.db_space = db_space

    @classmethod
    def bind(cls, identifier, user=None):
        return cls(identifier=identifier, db_space=None, user=user)

    @classmethod
    def bind_db_object(cls, db_space, user=None):
        return cls(identifier=db_space.identifier, db_space=db_space, user=user)

    @property
    def effective_cover_url(self):
        if self.leading_collection_driver:
            return self.leading_collection_driver.effective_cover_url
        else:
            from front.templatetags.collection_cover import repair_collection_cover_url
            return repair_collection_cover_url()


    def bind_category_driver(self, category):
        return CategoryListingDriver.bind(self, category, user=self.user)

    @cached_property
    def category_drivers(self):
        return [self.bind_category_driver('collection'), self.bind_category_driver('module'), self.bind_category_driver('womi')]


    def all_existing_in_category(self, category):
        for content_object in self.db_space.content_objects.filter(category=category):
            yield content_object.bind_driver(user=self.user, space=self.db_space)


    @cached_property
    def leading_collection_driver(self):
        try:
            return next(self.all_existing_in_category('collection'))
        except StopIteration:
            return None

    @property
    def presentation_siblings(self):
        if self.user is None:
            return [], False
        spaces = [self.bind(space.identifier, user=self.user) for space in models.Space.objects.filter(users__user=self.user).distinct().all()[:PRESENTATION_SIBLINGS_MAX + 1]]
        return (spaces[:PRESENTATION_SIBLINGS_MAX], len(spaces) > PRESENTATION_SIBLINGS_MAX)


    @property
    def presentation_parent(self):
        return RootPresentationDriver()


    @cached_property
    def presentation_label(self):
        return self.db_space.label


    @cached_property
    def presentation_url(self):
        return reverse('editres.views.space_main', args=[self.identifier])


    @cached_property
    def user_defined_roles(self):
        if self.user is None:
            return []

        return [user_in_role.role for user_in_role in self.db_space.users.filter(user=self.user)]


    @cached_property
    def user_effective_roles(self):
        if self.user is None:
            return []

        if self.user.is_staff or self.user.is_superuser or 'admin' in self.user_defined_roles:
            return models.UserRoleInSpace.ALL_ROLES
        else:
            return self.user_defined_roles


    @property
    def users_drivers(self):
        return [UserInSpaceDriver.bind(self, username, user=self.user) for username in self.db_space.users.all().order_by('user').values_list('user__username', flat=True).distinct()]

    @cached_property
    def stream_key(self):
        return '-'.join(['space', self.identifier])

    @property
    def has_read_perm(self):
        return self.has_write_perm


    @cached_property
    def db_space(self):
        return models.Space.objects.get(identifier=self.identifier)


    @property
    def has_write_perm(self):
        return (self.user is not None) and (not self.user.is_anonymous()) and (self.user.is_staff or self.user.is_superuser or self.db_space.users.filter(user=self.user).exists())


    def raise_for_read_perm(self):
        if not self.has_read_perm:
            raise exceptions.InsufficientPermissionsException()


    def raise_for_write_perm(self):
        if not self.has_write_perm:
            raise exceptions.InsufficientPermissionsException('user %s has no write permissions for %s' % (self.user, self))
