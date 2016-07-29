# coding=utf-8
from __future__ import absolute_import

from editcommon.objects import ContentDriverMixin

class RepoObjectDriver(object):

    def __init__(self, category, identifier, version):
        self.category = category
        self.identifier = identifier
        self.version = version

    def __repr__(self):
        return 'RepoObjectDriver(%r, %r, %r)' % (self.category, self.identifier, self.version)
