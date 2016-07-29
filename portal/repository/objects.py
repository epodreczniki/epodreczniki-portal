# coding=utf-8
from __future__ import absolute_import

from django.utils.functional import cached_property
from surround.django import execution
from django.conf import settings
from django.core.urlresolvers import reverse
import common.objects


class CategoryDriver(object):

    def __init__(self, identifier, version, user=None):
        self.identifier = str(identifier)
        self.version = int(version)
        self.user = user


    def __key(self):
        return tuple([self.__class__, self.category, self.identifier, self.version])


    def __hash__(self):
        return hash(self.__key())


    def __eq__(self, other):
        return self.__key() == other.__key() if other is not None else False


    def __reduce__(self):
        return (self.__class__, (self.identifier, self.version))


    def equals_pointer(self, other):
        return self.category == other.category and self.identifier == other.identifier and self.version == other.version

    @classmethod
    def bind(cls, identifier, version, user=None):
        return cls(identifier, version, user)

    def rebind(self, identifier, version):
        return self.bind(identifier, version, user=self.user)

    def rebind_self(self):
        return self.bind(self.identifier, self.version, user=self.user)

    def does_exist(self):
        raise NotImplementedError('does_exist')

    @property
    def preview_url(self):
        raise NotImplementedError()

    @property
    def exists(self):
        return self.does_exist()

    def raise_for_exists(self):
        # TODO: those exceptions should be moved to eepository
        from store import exceptions

        if not self.does_exist():
            raise exceptions.DoesNotExist('object does not exist: %s' % self)

    def bind_file_driver(self, filename, content=None):
        file_driver = self.store_file_class(self, filename)
        if content is not None:
            file_driver.content = content
        return file_driver

    @property
    def files(self):
        raise NotImplementedError('files not implemented in %s' % self.__class__)

    @property
    def leading_file(self):
        raise NotImplementedError()

    @property
    def main_file(self):
        raise NotImplementedError('main_file in %r' % self)

    @cached_property
    def repository(self):
        import repo
        return repo.repositories.match_repository_for_id_always(self.category, self.identifier)

    @property
    def does_support_versioning(self):
        return True if self.repository is None else (self.category in self.repository.does_support_versioning)

    @property
    def is_append_only(self):
        return True if self.repository is None else (self.category in self.repository.is_append_only)

    def __str__(self):
        return '%s:%s:%s' % (self.category, self.identifier, self.version)

    @classmethod
    def parse(cls, string):
        return cls(*string.split(':'))

    def __repr__(self):
        return '%s.%s(%s, %s)' % (self.__class__.__module__, self.__class__.__name__, self.identifier, self.version)

    @classmethod
    def get_parser(cls):
        raise NotImplementedError('get_parser in CategoryDriver (%s)' % cls)

    @classmethod
    def get_import_function(cls):
        return cls.get_parser().imported_function(cls.category)

    @property
    def reference_parsed_object(self):
        return self.get_parser().reference_imported_function(self.category)(self.identifier, self.version)

    @property
    def parsed_object(self):
        return self.parsed_object_result.return_result()

    def purge_parsed_object(self):
        self.get_import_function().purge(self.identifier, self.version)
        try:
            del self.parsed_object_result
        except AttributeError:
            pass

    @property
    def is_parsed_object_valid(self):
        return self.parsed_object_result.success

    @cached_property
    def parsed_object_result(self):
        return self.get_import_function().single(execution.parameters(self.identifier, self.version))

    @classmethod
    def multi_parse_objects(cls, drivers):

        parameters = execution.MultiParameters()

        for driver in drivers:
            parameters.bind(driver, driver.identifier, driver.version)

        results = cls.get_import_function().multi(parameters)

        for driver, parsed in results.items():
            driver.parsed_object_result = parsed

        return drivers

    @property
    def origin_driver(self):
        raise NotImplementedError('origin_driver in %r' % self.__class__)

    @property
    def title(self):
        try:
            return self.parsed_object.md_title
        except Exception as e:
            return u'Niepoprawny plik wejściowy'


    @property
    def effective_cover_url(self):
        from front.templatetags.collection_cover import repair_collection_cover_url
        return repair_collection_cover_url()


class XmlDriverMixin(object):


    @property
    def main_file(self):
        return self.leading_file

    @property
    def origin_driver(self):
        if self.parsed_object.origin is not None:
            return self.rebind(self.parsed_object.origin.identifier, self.parsed_object.origin.version)
        else:
            return None

    # @property
    # def files(self):
    #     return [self.bind_file_driver('%s.xml' % (self.category))]


class CollectionDriverMixin(object):

    category = 'collection'

    @property
    def leading_file(self):
        return self.bind_file_driver('collection.xml')

    @property
    def preview_url(self):
        if not settings.EPO_HAS_DEDICATED_SK:
            return None
        return reverse('preview_collection_details', args=[self.identifier, self.version])

    @property
    def effective_cover_url(self):
        from front.templatetags.collection_cover import cover_thumb_url, repair_collection_cover_url
        try:
            return cover_thumb_url(self.parsed_object)
        except Exception as e:
            return repair_collection_cover_url()

    @property
    def school(self):
        try:
            return self.parsed_object.md_school.get_md_education_level_display()
        except Exception as e:
            return u'?'

    @property
    def ep_class(self):
        try:
            return self.parsed_object.md_school.ep_class
        except Exception as e:
            return u'?'

    @property
    def subject(self):
        try:
            return self.parsed_object.md_subject.md_name
        except Exception as e:
            return u'?'



class ModuleDriverMixin(object):

    category = 'module'

    @property
    def leading_file(self):
        return self.bind_file_driver('module.xml')

    @property
    def preview_url(self):
        return None



class WomiDriverMixin(object):

    category = 'womi'

    @property
    def metadata_file(self):
        return self.bind_file_driver('metadata.json')

    @property
    def manifest_file(self):
        return self.bind_file_driver('manifest.json')

    @property
    def main_file(self):
        return self.metadata_file

    @property
    def leading_file(self):
        f = self.bind_file_driver('exercise.json')
        if f.exists:
            return f
        return None

    @property
    def origin_driver(self):
        return None

    @property
    def preview_url(self):
        return reverse('preview_womi_technical', args=[self.identifier, self.version])


class DriversMultiplexerMixin(object):

    def convert(self, source, lazy=True):

        if lazy and isinstance(source, self.get(source.category)):
            return source

        return self.bind(category=source.category, identifier=source.identifier, version=source.version, user=getattr(source, 'user', None))


class DriversMultiplexer(DriversMultiplexerMixin, object):

    def __init__(self, collection, module, womi):

        self.collection = collection
        self.module = module
        self.womi = womi


    def bind(self, category, identifier, version, user=None, **kwargs):

        driver = self.get(category)(identifier, version, user)

        for k, v in kwargs.items():
            setattr(driver, k, v)

        return driver


    def list_all_existing_as_drivers(self, category, user=None, list_all=True):
        raise NotImplementedError('list_all_existing_as_drivers')


    def validate(self, driver):
        if not isinstance(driver, self.get(driver.category)):
            raise Exception('invalid driver type')


    def get(self, category):
        if category == 'collection':
            return self.collection

        if category == 'module':
            return self.module

        if category == 'womi':
            return self.womi

        raise Exception('unknown category: %s', category)


