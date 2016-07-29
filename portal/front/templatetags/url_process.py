from django import template
from surround.django.logging import setupModuleLogger
from django.conf import settings
from django.core.urlresolvers import NoReverseMatch, reverse
from django.template import TemplateSyntaxError
from django.template.base import kwarg_re
from django.template.defaulttags import URLNode
from django.utils.encoding import smart_text

setupModuleLogger(globals())

register = template.Library()




