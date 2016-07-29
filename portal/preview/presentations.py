# coding=utf-8
from __future__ import absolute_import

from .volatile_models import Config
import common.presentations
import editsearch.utils
from django.http import Http404
from common.presentations import FIXED_VERSION_MODE
from common.presentations import LATEST_VERSION_MODE
from preview.exceptions import EditedVersionDoesNotExist
from django.core.urlresolvers import reverse

EDITED_VERSION_MODE = 'edited'

class PreviewPresentationMixin(object):
    config = Config

class PreviewModuleOccurrencePresentationDriver(PreviewPresentationMixin, common.presentations.ModuleOccurrencePresentationDriver):
    pass


class PreviewCollectionPresentationDriver(PreviewPresentationMixin, common.presentations.CollectionPresentationDriver):


    @classmethod
    def translate_non_fixed_version(cls, identifier, version_mode):

        if version_mode == LATEST_VERSION_MODE:
            driver = editsearch.utils.find_latest_version('collection', identifier, only_sealed=True)
            if driver is None:
                raise Http404('no latest version for %s found' % identifier)

            return driver.version

        if version_mode == EDITED_VERSION_MODE:
            driver = editsearch.utils.find_latest_version('collection', identifier, only_sealed=False)
            if driver is None:
                raise Http404('no edited version for %s found' % identifier)
            if not driver.is_edition_driver:
                raise EditedVersionDoesNotExist('latest existing version of %s is not being edited' % identifier, identifier=identifier)

            return driver.version

        raise Http404('invalid version given: %s' % version_mode)

    module_occurrence_presentation_driver_class = PreviewModuleOccurrencePresentationDriver

class WomiPresentationDriver(PreviewPresentationMixin, common.presentations.WomiPresentationDriver):
    pass


bind_collection_or_404 = PreviewCollectionPresentationDriver.bind_collection_or_404
bind_womi_or_404 = WomiPresentationDriver.bind_or_404
bind_module_occurrence_or_404 = PreviewCollectionPresentationDriver.bind_module_occurrence_or_404
