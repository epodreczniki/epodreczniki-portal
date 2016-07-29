# coding=utf-8
from __future__ import absolute_import

from editcommon.objects import ContentDriverMixin
import repository.objects
import requests
from requests.exceptions import RequestException
from repo.files import FileDriver
import editcommon.objects
from django.utils.functional import cached_property

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class RepoCategoryDriver(editcommon.objects.ContentDriverMixin, repository.objects.CategoryDriver):

    store_file_class = FileDriver
    is_repo_driver = True
    is_edition_driver = False


    def bind_next_version_driver(self):
        if (self.does_support_versioning or not self.is_append_only):
            return self.rebind(self.identifier, int(self.version) + 1)
        else:
            return self.repository.generate_new_object_line(category=self.category, user=self.user)

    def does_exist(self):
        try:
            r = requests.head(self.main_file.get_url('repo'), timeout=60)
            r.raise_for_status()
            return r.status_code == 200
        except RequestException as e:
            return False

    def _fill_json_state(self, result):
        result["place"] = 'repo'

    @classmethod
    def get_parser(cls):
        import editcommon.parsers
        return editcommon.parsers.EditCommonParser

    def get_edition_timestamp(self):
        return self.repository.get_edition_timestamp(self)



class CollectionDriver(repository.objects.CollectionDriverMixin, repository.objects.XmlDriverMixin, RepoCategoryDriver):

    @property
    def files(self):
        return [self.bind_file_driver('collection.xml')]


class ModuleDriver(repository.objects.ModuleDriverMixin, repository.objects.XmlDriverMixin, RepoCategoryDriver):

    @property
    def files(self):
        return [self.bind_file_driver('module.xml')]


class WomiDriver(repository.objects.WomiDriverMixin, RepoCategoryDriver):


    @property
    def files(self):
        for source in self.repository.list_womi_content(self.identifier, self.version):
            file_driver = self.bind_file_driver(source.filename)
            file_driver.content_provider = source
            yield file_driver



drivers = repository.objects.DriversMultiplexer(CollectionDriver, ModuleDriver, WomiDriver)
