# coding=utf-8
from __future__ import absolute_import

from common.utils import extension_to_content_type
from django.conf import settings
from django.utils.functional import cached_property
import os.path
import requests
import fnmatch

TEXT_FILE_EXTENSIONS = ('xml', 'json')

class FileDriver(object):

    check_content_change = False

    def __init__(self, driver, filename):
        self.driver = driver
        self.filename = filename


    def __reduce__(self):
        return (self.__class__, (self.driver, self.filename))

    def rebind_filename(self, filename):
        return self.__class__(self.driver, filename)

    @cached_property
    def content_type(self):
        return extension_to_content_type(self.extension)

    @property
    def exists(self):
        raise NotImplementedError()


    def __str__(self):
        return '%s(%s)' % (self.__class__.__name__, self.filename)

    __repr__ = __str__

    def get_url(self, subdomain):
        return 'http://%s.%s/content/%s/%s/%s/%s' % (subdomain,
            settings.TOP_DOMAIN, self.driver.category, self.driver.identifier, self.driver.version, self.filename)

    @cached_property
    def preview_url(self):
        return self.get_url('preview')

    def compute_size(self):
        raise NotImplementedError('compute_size in %s' % self.__class__.__name__)

    @cached_property
    def size(self):
        return self.compute_size()

    @cached_property
    def basename(self):
        return os.path.basename(self.filename)

    @cached_property
    def extension(self):
        return os.path.splitext(self.filename)[1][1:]

    @cached_property
    def pattern_filename(self):
        return '%s/%s' % (self.driver.category, self.filename)


    def does_match_patterns(self, patterns):
        for pattern in patterns:
            if fnmatch.fnmatchcase(self.pattern_filename, pattern):
                return True
        return False


    @cached_property
    def is_text_file(self):
        return self.extension in TEXT_FILE_EXTENSIONS

    def exists_in_subdomain(self, subdomain, fail_on_headers=None, pure_head=False):
        if pure_head:
            headers = { 'X-HEAD': '1' }
        else:
            headers = {}
        r = requests.head(self.get_url(subdomain), headers=headers)
        if r.status_code == 200:
            if fail_on_headers:
                for k, v in fail_on_headers.items():
                    if r.headers.get(k) == v:
                        return False

            return True

        return False
