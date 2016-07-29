# coding=utf-8
from __future__ import absolute_import
from django.dispatch import Signal

from surround.django.logging import setupModuleLogger
from django.shortcuts import render
from reader.views import CollectionReader
from common.model_mixins import SOURCE_VARIANT
from preview import presentations
from preview.volatile_models import Config as config
from repository.utils import CollectionUniversalXmlFileProvider
from surround.django import context_cache
import preview.parsers
import repository.utils

setupModuleLogger(globals())


class CodingCollectionVariantXmlFileProvider(repository.utils.CollectionUniversalXmlFileProvider):
    # something interesting will happen here after introduction of builds
    pass


class CodingParser(preview.parsers.PreviewContentParser):

    collxml_provider = CodingCollectionVariantXmlFileProvider

    @classmethod
    def collect_all_static_formats(cls, collection):
        pass


before_render = Signal(providing_args=["view_name", "params"])


@context_cache.wrap_with_activate
def collection_index(request, identifier, version, variant):
    #from reader import build_tools
    #build_tools.init()

    collection = CodingParser.imported_collection_variant(identifier, version, variant)
    collection.prefetch_modules()

    presentation = presentations.PreviewCollectionPresentationDriver.bind_from_object(collection)
    module_id = next(presentation.collection.get_all_modules()).identifier
    module_presentation = presentation.bind_module_or_404(module_id)

    before_render.send(sender='collection_index', view_name='collection_index',
                       params={'identifier': identifier, 'version': version, 'variant': variant})

    return render(request, 'reader.html', {
        'presentation': presentation,
        'collection': presentation.collection,
        'module': module_presentation.module_occurrence.module,
        'module_occurrence': module_presentation.module_occurrence,
        'use_test': False,
        'endpoints': {},
        'use_static_ge': True,
    })


