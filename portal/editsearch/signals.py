# coding=utf-8
from __future__ import absolute_import

import store.signals
from django.conf import settings
from . import utils
from common.objects import BareDriver

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

def index_kzd_womi(sender, driver, **kwargs):
    repo_driver = repo.objects.drivers.convert(driver)
    if repo_driver.is_kzd():
        info("scheduling indexing of KZD womi %s/%s" % (driver.identifier, driver.version))
        utils.get_index_driver().index_object.delay(repo_driver)

def remove_kzd_womi(sender, category, identifier, version, **kwargs):
    driver = repo.objects.drivers.bind(category, identifier, version)
    if sender == 'repo' and driver.is_kzd():
        info("scheduling removal of KZD womi %s/%s from index" % (identifier, version))
        utils.get_index_driver().remove_object.delay(driver)

if settings.EPO_ENABLE_EDITSEARCH:
    store.signals.object_reload.connect(index_kzd_womi)
    store.signals.object_deleted.connect(remove_kzd_womi)

def purge_latest(sender, category, identifier, version, **kwargs):
    utils.find_latest_version.purge(category, identifier, only_sealed=True)
    utils.find_latest_version.purge(category, identifier, only_sealed=False)

store.signals.object_purge.connect(purge_latest)


