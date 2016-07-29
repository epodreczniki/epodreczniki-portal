from __future__ import absolute_import

from django.utils.functional import cached_property
from django.conf import settings
from collections import OrderedDict
from copy import deepcopy
from django.utils.module_loading import import_by_path

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class Repos(object):



    def __init__(self):
        pass

    @cached_property
    def all(self):
        result = OrderedDict()

        for name, config in settings.EPO_CONTENT_REPOSITORIES_DESCRIPTOR.items():
            driver_class = import_by_path(config["driver"])
            conf = deepcopy(config)
            del conf["driver"]
            driver = driver_class(name, **conf)
            result[name] = driver

        return result

    @cached_property
    def dummy_repository(self):
        from repo.drivers.dummy import DummyDriver
        return DummyDriver('dummy', **{'backend': None, 'enabled': True, 'api': {}})

    def items(self):
        return self.all.items()

    def values(self):
        return self.all.values()

    def __getattr__(self, key):
        return self.all[key]

    def __getitem__(self, key):
        return self.all[key]

    def get(self, name):
        return self.all[name]

    def __dir__(self):
        return list(self.all.keys())


    def match_repository_for_id_non_throwing(self, category, identifier):

        for repository in self.values():
            if repository.identifiers[category].compiled.match(identifier):
                return repository

        return None


    def match_repository_for_id_always(self, category, identifier):

        repository = self.match_repository_for_id_non_throwing(category, identifier)
        if repository is not None:
            return repository
        else:
            return self.dummy_repository


    def match_repository_for_id(self, category, identifier):
        from .exceptions import RepositoryNotFound
        repository = self.match_repository_for_id_non_throwing(category, identifier)
        if repository is not None:
            return repository

        warning('%s identifier %s does not match to any repository', category, identifier)
        raise RepositoryNotFound("repository matching identifier %s not found" % identifier)



