from surround.django import platform_cache
from django.conf import settings
import requests
from surround.django.platform_cache import internal_redirect
from collections import namedtuple
import re
import datetime
from django.utils import timezone

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

MODIFICATION_IN_TOTAL_PAST = timezone.utc.localize(datetime.datetime(1970, 1, 1))

CategoryIdentifier = namedtuple('CategoryIdentifier', ['regex', 'compiled'])

def objecify(kwargs):
    return type('objectified', (object,), kwargs)


class BaseDriver(object):

    can_create_new_objects_lines = ( 'collection', 'module', 'womi' )
    can_seal_objects = ( 'collection', 'module', 'womi' )

    does_support_versioning = ('collection', 'module', 'womi')
    is_append_only = ('collection', 'module', 'womi')

    def __init__(self, name, **kwargs):
        self.name = name
        self.config = kwargs

        # canSeal = self.config.get('canSeal', False)
        # self.can_seal = objecify({c: (canSeal if type(canSeal) == bool else canSeal.get(c, False)) for c in ['collection', 'module', 'womi']})

        self.backend = self.config["backend"]
        self.enabled = self.config.get("enabled", True)

        self.identifiers = {}
        for k, v in self.config.get("identifiers", {}).items():
            i = CategoryIdentifier(regex=v['regex'], compiled=re.compile('^%s$' % v['regex']))
            for c in k.split(','):
                self.identifiers[c] = i

        try:
            self._host_header = kwargs["api"]["readDomain"]
        except KeyError:
            self._host_header = None

        try:
            self.api_write_root = self.config["api"]["writeRoot"]
        except KeyError:
            self.api_write_root = None

    @property
    def domain(self):
        return settings.BACKEND_ADDRESS[self.name + '_repository']

    def internal_redirect(self, request, url, content_type=None):
        return internal_redirect(request, 'http://%s%s' % (self.domain, url), content_type=content_type, host_header=self._host_header)

    def direct_internal_url(self, url):
        return 'http://%s%s' % (self.domain, url)

    def get_request_from_backend(self, url, timeout=5, attempts=1, quiet=False):
        full_url = self.direct_internal_url(url)

        while True:
            try:
                r = requests.get(full_url, timeout=timeout, headers={'Host': self._host_header})
                r.raise_for_status()
            except requests.exceptions.RequestException as e:
                attempts -= 1
                if attempts <= 0:
                    if not quiet:
                        error('failed to fetch "%s"', full_url)
                    raise
                else:
                    if not quiet:
                        warning('failed to fetch "%s", retrying', full_url)
            else:
                return r

    def list_all_objects(self, category):
        raise NotImplementedError()


    def list_all_verified_objects(self, category):
        import repo
        if not self.enabled:
            return

        for obj in self.list_all_objects(category):
            if repo.repositories.match_repository_for_id_non_throwing(obj.category, obj.identifier) == self:
                yield obj
            else:
                warning('encountered not matching %s identifier %s', obj.category, obj.identifier)


    def list_womi_content(self, womi_id, version):
        raise NotImplementedError()

    def generate_new_object_line(self, category, user):
        raise NotImplementedError()


    def seal_object(self, driver):
        raise NotImplementedError()

    def find_latest_version(self, category, identifier):
        raise NotImplementedError()

    def raise_for_object_importability(self, driver):
        pass

    def get_edition_timestamp(self, driver):
        return MODIFICATION_IN_TOTAL_PAST

