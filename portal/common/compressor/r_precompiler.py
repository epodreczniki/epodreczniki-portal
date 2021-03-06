#!/usr/bin/env python
from __future__ import with_statement
from surround.django.templatetags.requirejs import requirejs


class RequireJSPrecompiler(object):
    """A filter whose output is always the string 'OUTPUT' """

    def __init__(self, content, attrs, filter_type=None, filename=None):
        self.content = content
        self.attrs = attrs
        self.filter_type = filter_type
        self.filename = filename

    def input(self, **kwargs):
        return requirejs(kwargs['basename'], True, False)
