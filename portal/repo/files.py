# coding=utf-8
from __future__ import absolute_import

import repository.files
from common.utils import extension_to_content_type
import requests
from django.utils.functional import cached_property
import store.files

class FileDriver(repository.files.FileDriver):

    content_provider = None

    @property
    def exists(self):
        return self.exists_in_subdomain('repo')


    def download_to_file(self, filepath, fail_on_headers=None):
        if self.content_provider is not None:
            return self.content_provider.download_to_file(filepath, fail_on_headers=fail_on_headers)

        # EPB-655 this should not be always preview
        return store.files.LazyHttpFileDriver(self.filename, url=self.get_url('preview')).download_to_file(filepath, fail_on_headers=fail_on_headers)

    @cached_property
    def content(self):
        if self.content_provider is not None:
            return self.content_provider.content

        r = requests.get(self.get_url('repo'))
        r.raise_for_status()
        return r.content
