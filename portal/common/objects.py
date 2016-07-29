# coding=utf-8
from __future__ import absolute_import


class BareDriver(object):

    user = None

    def __init__(self, category, identifier, version):
        self.category = category
        self.identifier = str(identifier)
        self.version = int(version)


    @classmethod
    def bind(cls, category, identifier, version, user=None):
        # user is being discarded
        return cls(category, identifier, version)


    def __str__(self):
        return '%s:%s:%s' % (self.category, self.identifier, self.version)

    def __repr__(self):
        return 'BareDriver(%s, %s, %s)' % (self.category, self.identifier, self.version)

class BareDriverDegradableMixin(object):

    def as_bare_driver(self):
        return BareDriver.bind(self.category, self.identifier, self.version)


bind = BareDriver.bind
