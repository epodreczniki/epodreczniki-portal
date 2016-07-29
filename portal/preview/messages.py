# coding=utf-8
from __future__ import absolute_import
from auth.utils import accept_agreement

from common import messaging
from preview import views, subdomain_views
import repo.views

from . import utils, tasks, parsers
import store.signals
from django.http import Http404
from . import presentations

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

registry = messaging.Registry()

@registry.json_callback
def collection_transformed(collection_id, collection_version, variant, format, **kwargs):
    if format == 'html':
        subdomain_views.preview_module_html.purge(collection_id=collection_id, version=collection_version, variant=variant, module_id='*')
        views.bound_views.reader.purge(collection_id=collection_id, version=collection_version, variant=variant, module_id='*')
        views.bound_views.reader.purge(collection_id=collection_id, version='latest', variant=variant, module_id='*')
    elif format == 'xml':
        collection_metadata_changed(collection_id, collection_version)

        subdomain_views.preview_transformed_collection_xml.purge(collection_id, collection_version, variant)
        subdomain_views.preview_transformed_module_xml.purge(collection_id=collection_id, version=collection_version, variant=variant, module_id='*')
        views.bound_views.volatile_module.purge(collection_id=collection_id, version=collection_version, variant=variant, module_id='*')
        # here should be invalidation of all volatile modules
        # views.preview.purge(collection_id=collection_id, version=collection_version, variant=variant, module_id='title')
        # views.preview.purge(collection_id=collection_id, version=collection_version, variant=variant, module_id=None)

        tasks.process_collection.delay(collection_id, collection_version, variant)
    elif format == 'pdf':
        subdomain_views.collection_emission_format.purge(collection_id, collection_version, variant, 'collection.pdf')
        subdomain_views.collection_emission_format.purge(collection_id, collection_version, variant, 'collection.cp-pdf.zip')
    elif format == 'epub':
        subdomain_views.collection_emission_format.purge(collection_id, collection_version, variant, 'collection.epub')
        subdomain_views.collection_emission_format.purge(collection_id, collection_version, variant, 'collection-color.epub')
    elif format in ('odt', 'odt-package'):
        subdomain_views.collection_emission_format.purge(collection_id, collection_version, variant, 'collection.odt')
        subdomain_views.collection_emission_format.purge(collection_id, collection_version, variant, 'collection-odt.zip')
    elif format == 'mobile':
        collection_metadata_changed(collection_id, collection_version)
        subdomain_views.collection_emission_format.purge(collection_id, collection_version, variant, 'mobile*')
    else:
        warning('unknown format: %s', format)


def collection_metadata_changed(collection_id, collection_version, **kwargs):
    from editcommon.parsers import EditCommonParser

    subdomain_views.collection_metadata_xml.purge(collection_id, collection_version)

    # utils.parsed_collection_metadata.force(collection_id, collection_version)

    parsers.PreviewContentParser.imported_collection.purge(collection_id, collection_version)
    parsers.PreviewContentParser.imported_collection_variant.purge(collection_id, collection_version, '*')

    EditCommonParser.imported_collection.purge(collection_id, collection_version)
    EditCommonParser.imported_collection_variant.purge(collection_id, collection_version, '*')


    views.bound_views.table_of_contents.purge(collection_id, collection_version, '*')
    views.bound_views.reader.purge(collection_id, collection_version, '*', '*')
    views.bound_views.collection_details.purge(collection_id, collection_version)
    views.bound_views.variant_details.purge(collection_id, collection_version, '*')

    try:
        if int(collection_version) == int(presentations.PreviewCollectionPresentationDriver.translate_non_fixed_version(collection_id, presentations.LATEST_VERSION_MODE)):
            views.bound_views.reader.purge(collection_id, presentations.LATEST_VERSION_MODE, '*', '*')
            views.bound_views.collection_details.purge(collection_id, presentations.LATEST_VERSION_MODE)
            views.bound_views.variant_details.purge(collection_id, presentations.LATEST_VERSION_MODE, '*')

    except Http404:
        pass


collection_metadata_changed.__name__ = 'collection_metadata-changed'

registry.json_callback(collection_metadata_changed)


def repository_message_callback(func):

    return registry.json_callback(messaging.repeat_json_message('repo')(func))

def callback_binder(signal, category, action):
    from repo.drivers.advanced import AdvancedDriver

    def callback(**kwargs):

        # TODO: EPB-212 I know this not look's good here, but I had no better
        # idea at the moment - sorry
        identifier = str(kwargs['%s_id' % category])
        if (category == 'module') and (AdvancedDriver.backend_identifier_separator in identifier):
            identifier, version = AdvancedDriver.split_identifier(identifier)
        else:
            version = str(kwargs.get('%s_version' % category, '1'))

        signal.send_robust(sender='repo', category=category, identifier=identifier, version=version)

    callback.__name__ = '%s_%s' % (category, action)
    return callback


for category in ('collection', 'module', 'womi'):
    for action in ('added', 'modified', 'deleted'):
        signal = getattr(store.signals, 'object_%s' % action)

        registry.json_callback(callback_binder(signal, category, action))


@registry.json_callback
def user_created(epouuid):
    accept_agreement(epouuid)
    info('user with epouuid: %s was created' % epouuid)
