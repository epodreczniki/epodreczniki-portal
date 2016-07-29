# coding=utf-8
from __future__ import absolute_import
from django.http import HttpResponse
from django.core.files.base import ContentFile
from django.utils.functional import cached_property
import json
import requests
import os
import re
from xml.etree import ElementTree
from django.conf import settings
import subprocess

from . import exceptions
import repository.files
import repository.utils

import logging
from surround.django.logging import setupModuleLogger
from surround.django.utils import always_string
setupModuleLogger(globals())


class StoreFileDriverMixin(object):


    def parse_content(self, content):
        return content

    def print_content(self, content):
        return content

    @property
    def has_read_perm(self):
        return self.driver.has_read_perm

    def get_storage(self):
        return self.driver.get_storage()

    @property
    def has_write_perm(self):
        return self.driver.has_write_perm

    def raise_for_write_perm(self):
        if not self.has_write_perm:
            raise exceptions.InsufficientPermissionsException()

    @property
    def fullpath(self):
        return os.path.join(self.driver.basepath, self.filename)


    def stream_read(self):
        self.raise_for_existance()
        return self.get_storage().open(self.fullpath)

    @property
    def content(self):
        self.raise_for_existance_filesystem()
        with self.get_storage().open(self.fullpath) as f:
            result = f.read()
            f.close()
        return result

    @content.setter
    def content(self, _content):
        self.raise_for_write_perm()

        if self.check_content_change and self.exists:
            if always_string(self.content) == always_string(_content):
                self.driver.log(logging.INFO, 'reassigned file: %s', self.filename)
                return

        try:
            _parsed_content = self.parse_content(_content)
        except Exception as e:
            raise exceptions.ValidationFailureException('niepoprawny plik: %s' % self.fullpath)

        self.validate_before_write(_content, _parsed_content)

        s = self.get_storage()
        if self.exists:
            with s.open(self.fullpath, 'wb') as f:

                # f.write(unicode().encode('UTF-8'))
                f.write(ContentFile(_content).read())
                f.close()
        else:
            db = self.driver.models.ContentFile(content_object=self.driver.db_object, filename=self.filename)
            db.save()
            s.save(self.fullpath, ContentFile(_content))

        self.driver.log(logging.INFO, 'changed file: %s', self.filename)
        self.driver.notify_modified()


    @property
    def parsed_content(self):

        return self.parse_content(self.content)

    @parsed_content.setter
    def parsed_content(self, value):

        if self.content_printer is None:
            raise NotImplementedError('setting parsed_content for %s' % self.__class__)

        self.content = self.print_content(value)


    @property
    def exists_filesystem(self):
        return self.get_storage().exists(self.fullpath)


    @property
    def exists(self):
        if not self.driver.exists:
            return False
        return self.driver.models.ContentFile.objects.filter(content_object=self.driver.db_object, filename=self.filename).exists()

    def raise_for_existance_filesystem(self):
        if not self.exists_filesystem:
            raise exceptions.FileNotFound(self.fullpath)

    def raise_for_existance(self):
        if not self.exists:
            raise exceptions.FileNotFound(self.fullpath)

    def delete(self):
        self.raise_for_write_perm()
        self.raise_for_existance()
        self.get_storage().delete(self.fullpath)
        self.db_object.delete()
        self.driver.notify_modified()

    def as_http_response(self):
        return HttpResponse(self.content, content_type=self.content_type)

    def validate_before_write(self, new_content, new_parsed_content):
        pass

    @cached_property
    def db_object(self):
        return self.driver.models.ContentFile.objects.get(content_object=self.driver.db_object, filename=self.filename)




class FileDriverMixin(object):

    content_referals_number = 0

    def __str__(self):
        return "%s('%s')" % (self.__class__.__name__, self.filename)

    @property
    def content(self):
        self.content_referals_number += 1
        return self._content


    @property
    def was_content_accessed(self):
        return self.content_referals_number > 0

    def download(self, filepath):
        raise NotImplementedError('download in %s' % self.__class__.__name__)

    __repr__ = __str__


class LazyHttpFileDriver(FileDriverMixin):
    def __init__(self, filename, url):
        self.filename = filename
        self.url = url

    @property
    def _content(self):
        r = requests.get(self.url)
        return r.content

    WGET_HEADER_SPLIITER = re.compile('^\ +(?P<header>[^:]+):\ (?P<value>.*)$')

    def download_to_file(self, filepath, fail_on_headers=None):

        self.content_referals_number += 1
        debug('downloading file %s from %s', filepath, self.url)
        if settings.EPO_USE_WGET_FOR_PUBLICATIONS_DOWNLOAD:
            output = subprocess.check_output(['wget', '-S', '-q', self.url, '-O', filepath], close_fds=True, stderr=subprocess.STDOUT)
            if fail_on_headers:
                for header_line in output.split('\n')[1:]:
                    header_match = self.WGET_HEADER_SPLIITER.match(header_line)
                    if header_match is not None:
                        header = header_match.group('header')
                        value = header_match.group('value')
                        for k, v in fail_on_headers.items():
                            if k.lower() == header.lower():
                                if v == value:
                                    # TODO: nice exception type
                                    raise Exception('fail on header value %s: %s' % (header, value))
        else:
            with open(filepath, "wb") as file_handler:
                ret = requests.get(self.url, stream=True)
                for block in ret.iter_content(8192):
                    if not block:
                        break
                    file_handler.write(block)


class SimpleInMemoryFileDriver(FileDriverMixin):

    def __init__(self, filename, content):
        self.filename = filename
        self._content = content


    def download_to_file(self, filepath, fail_on_headers=None):
        debug('downloading file %s', filepath)
        with open(filepath, 'wb') as file_handler:
            file_handler.write(self.content)


FIRST_DIR = re.compile(r'^[\w\s_-]+\/')


def read_files_from_request(files, trim_first_dir=True):
    for f in files:
        filename = f.fullname
        if trim_first_dir:
            filename = re.sub(FIRST_DIR, '', filename)

        yield SimpleInMemoryFileDriver(filename, f.read())

        # self.bind_file_driver(re.sub(FIRST_DIR, '', new_file.fullname, 1)).content = new_file.read()


class XmlFileDriverMixin(object):


    def parse_content(self, content):
        #         content = content.encode('utf8')
        return repository.utils.just_parse_xml(content)

    def print_content(self, content):
        return repository.utils.print_xml(content)


    @property
    def parsed_xml(self):
        from repository.utils import fetch_and_parse_xml
        return fetch_and_parse_xml(self.preview_url)


class CollectionXmlFileDriver(XmlFileDriverMixin, StoreFileDriverMixin, repository.files.FileDriver):
    pass


class ModuleXmlFileDriver(XmlFileDriverMixin, StoreFileDriverMixin, repository.files.FileDriver):
    pass


class WomiFileDriver(StoreFileDriverMixin, repository.files.FileDriver):

    def parse_content(self, content):
        if self.extension == 'json':
            return json.loads(content)
        else:
            return content

    def print_content(self, content):
        if self.extension == 'json':
            return json.dumps(content)
        else:
            return content


