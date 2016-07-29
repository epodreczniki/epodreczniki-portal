# coding=utf-8
from __future__ import absolute_import
import sys

from django.utils.functional import cached_property

import repository.objects
from . import files
from . import exceptions

from surround.django.utils import getattr_if_not_none

import logging
from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class CategoryDriver(repository.objects.CategoryDriver):


    @classmethod
    def get_storage(cls):
        return cls.storage.get()


    def notify_added(self):
        pass


    def notify_modified(self):
        pass


    def notify_deleted(self):
        pass


    def touch(self):
        self.notify_modified()


    def create_from(self, source):
        raise NotImplementedError('create_from in %r' % self)


    def update(self, files):

        self.raise_for_write_perm()

        for f in files:
            fd = self.bind_file_driver(f.filename)
            debug("saving file %s in %s", fd.fullpath, self.storage.name)
            fd.content = f.content

        self.notify_modified()


    @property
    def has_read_perm(self):
        return self.has_write_perm


    @property
    def has_write_perm(self):
        return (self.user is not None) and (not self.user.is_anonymous()) and (self.user.is_staff or self.user.has_perm('common.can_access_all_%s' % self.category))

    def raise_for_read_perm(self):
        if not self.has_read_perm:
            raise exceptions.InsufficientPermissionsException()

    def raise_for_write_perm(self):
        if not self.has_write_perm:
            raise exceptions.InsufficientPermissionsException('user %s has no write permissions for %s' % (self.user, self))


    @property
    def revised(self):
        try:
            return self.parsed_object.md_revised
        except Exception as e:
            return None

    @property
    def basepath(self):
        return '%s/%s/%s' % (self.category, self.identifier, self.version)


    def does_exist_filesystem(self):
        return self.main_file.exists_filesystem


    def does_exist(self):
        return self.models.ContentObject.objects.filter(category=self.category, identifier=self.identifier, version=self.version).exists()


    @classmethod
    def all_existing_as_drivers(cls, user=None, list_all=False):
        content_objects = cls.models.ContentObject.objects.filter(category=cls.category)

        if not list_all:
            content_objects = content_objects.filter(space__users__user=user)

        for content_object in content_objects:
            yield cls.bind(content_object.identifier, content_object.version, user)


    @cached_property
    def db_object(self):
        return self.models.ContentObject.objects.get(category=self.category, identifier=self.identifier, version=self.version)


    def delete(self):
        info('deleting of object: %s', repr(self))
        self.raise_for_write_perm()
        for f in self.files:
            f.delete()

        self.db_object.delete()

        self.notify_deleted()
        self.log(logging.INFO, 'deleted object')

    def fill_db_object_on_creation(self, db_object):
        pass

    def create(self, files):

        if self.does_exist():
            raise exceptions.ObjectAlreadyExist('%s %s/%s already exists' % (self.category, self.identifier, self.version))

        db = self.models.ContentObject(category=self.category, identifier=self.identifier, version=self.version)
        self.fill_db_object_on_creation(db)
        db.save()

        # debug('creating object %s/%s', self.identifier, self.version)
        self.log(logging.INFO, 'creating object')

        try:
            self.update(files)
        except Exception as e:
            error('failed to create %s %s/%s: %s - aborting', self.category, self.identifier, self.version, e)
            failure = sys.exc_info()
            try:
                self.delete()
            except Exception:
                error('failed to abort creation %s %s/%s: %s', self.category, self.identifier, self.version, e)

            raise failure[0], failure[1], failure[2]
        else:
            self.notify_added()



    def log(self, level, message, *args, **kwargs):
        pass


    @property
    def json_descriptor(self):
        return {
            'category': self.category,
            'identifier': self.identifier,
            'version': self.version,
            'repository': getattr_if_not_none(self.repository, 'name'),
            'files': [{
                'path': f.filename,
                'content_type': f.content_type,
            } for f in self.files],
        }


    @property
    def files(self):
        return [self.bind_file_driver(f.filename) for f in self.db_object.content_files.all()]



class XmlDriverMixin(object):





    def update(self, files):
        files = list(files)
        if len(files) != 1:
            raise exceptions.InvalidOperationException('invalid number of files to update: %s' % len(files))

        files[0].filename = self.category + '.xml'

        super(XmlDriverMixin, self).update(files)
        self.log(logging.INFO, 'updated object')




class CollectionDriver(repository.objects.CollectionDriverMixin, repository.objects.XmlDriverMixin, XmlDriverMixin, CategoryDriver):

    store_file_class = files.CollectionXmlFileDriver
    nice_name = 'Kolekcja'



class ModuleDriver(repository.objects.ModuleDriverMixin, repository.objects.XmlDriverMixin, XmlDriverMixin, CategoryDriver):

    store_file_class = files.ModuleXmlFileDriver
    nice_name = u'Moduł'


class WomiDriver(repository.objects.WomiDriverMixin, CategoryDriver):

    store_file_class = files.WomiFileDriver
    nice_name = 'WOMI'




    @property
    def metadata_json(self):
        try:
            meta = json.loads(self.metadata_file.content)
            if 'title' in meta:
                return meta
            else:
                return self.METADATA_TEMPLATE
        except:
            return self.METADATA_TEMPLATE




class DriversMultiplexer(repository.objects.DriversMultiplexer):

    # def __init__(self, collection, module, womi, models):
    #     super(DriversMultiplexer, self).__init__(collection, module, womi)
    #     self.models = models



    def list_all_existing_as_drivers(self, category, user=None, list_all=True):
        for d in self.get(category).all_existing_as_drivers(user=user, list_all=list_all):
            yield d


drivers = DriversMultiplexer(CollectionDriver, ModuleDriver, WomiDriver)
