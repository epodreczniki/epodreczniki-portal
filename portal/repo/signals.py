# coding=utf-8
from __future__ import absolute_import

import store.signals
from . import views

store.signals.connect_presentation_purges(store.signals.object_purge, views, sender='repo')


