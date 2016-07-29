# coding=utf-8
from __future__ import absolute_import

import repository.files
import requests
from django.conf import settings
from django.utils.functional import cached_property

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class FileDriver(repository.files.FileDriver):

    def get_url(self, subdomain):
        return self.driver.get_url_root(subdomain) + self.filename

    @cached_property
    def content_url(self):
        return self.get_url('content')

    @cached_property
    def content(self):
        r = requests.get(self.content_url)
        r.raise_for_status()
        return r.content

    def compute_size(self):
        if settings.SURROUND_RUNNING_ON_PLATFORM:
            if 'content' not in self.__dict__:
                r = requests.head(self.get_url('content'))
                return int(r.headers['content-length'])

        return len(self.content)

    def purge_cache(self):
        from surround.django.platform_cache import purge_url
        url = self.get_url('content')
        info('purging content file: %s', url)
        purge_url(url)

