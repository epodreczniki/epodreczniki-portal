# coding=utf-8
from __future__ import absolute_import

import repo.objects
import repository.objects
import repository.utils
from . import models
from django.utils.functional import cached_property
import common.models
from .models import Publication
from .files import FileDriver, SourceGeneratorFileDriver
from django.conf import settings
from django.core.urlresolvers import reverse
import os.path
import editstore.objects
from django.http import Http404
from . import exceptions
from contextlib import closing
import common.objects
from repository.utils import MetadataXmlUnavailable
from common.model_mixins import CollectionStaticFormatMixin



from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


if settings.SURROUND_RUNNING_ON_PLATFORM:
    STATIC_COMPRESS_EXTENSIONS = set(('html', 'css', 'js', 'json', 'xml', 'svg', 'otf', 'eot', 'ttf'))
else:
    STATIC_COMPRESS_EXTENSIONS = set()


class PublicationProcessDriver(common.objects.BareDriverDegradableMixin):

    has_files = False
    verifying_max_time = 60 * 30
    independent_max_time = 60 * 60 * 3
    aspect_command = u'Wykonaj'
    aspect_title = u'Operacja'
    download_fail_on_headers = None

    def __init__(self, *args, **kwargs):
        raise NotImplementedError('override __init__ in %s' % self.__class__.__name__)


    @property
    def db_category(self):
        return models.Publication.CATEGORY_RDICT[self.category]


    @cached_property
    def published_url(self):
        return None

    @cached_property
    def preview_url(self):
        return None

    @cached_property
    def context(self):
        from .utils import PublicationContext
        return PublicationContext.bind_driver(self)

    def rebind_aspect(self, aspect):
        return drivers.bind(self.category, self.identifier, self.version, aspect, user=self.user)

    def raise_for_invalid(self):
        pass

    @property
    def is_invalid(self):
        try:
            self.raise_for_invalid()
        except exceptions.PublicationInvalid:
            return True
        else:
            return False

    def execute_independent_operation(self):
        debug('executing dummy independent operation of %s', self)

    def execute_dependent_operation(self):
        debug('executing dummy dependent operation of %s', self)

    def execute_verifying_operation(self):
        debug('executing dummy verifying operation of %s', self)

    def publication_dependencies(self):
        raise NotImplementedError('publication_dependencies in %s' % self.__class__.__name__)

    @property
    def current_target_status(self):
        raise NotImplementedError('current_target_status in %s' % self.__class__.__name__)


    def __key(self):
        return tuple([self.__class__, self.category, self.identifier, self.version, self.aspect])


    def __hash__(self):
        return hash(self.__key())


    def __eq__(self, other):
        return self.__key() == other.__key() if other is not None else False

    def __str__(self):
        return '%s:%s:%s:%s' % (self.category, self.identifier, self.version, self.aspect)

    @cached_property
    def repo_driver(self):
        return repo.objects.drivers.bind(self.category, self.identifier, self.version)

    @property
    def title(self):
        return self.repo_driver.title

    def get_notification_recipients(self, user=False, observers=False, extra=False, other_instance=False):
        result = []
        if user and self.context.publication_user is not None:
            result.append(self.context.publication_user.email)
        if observers:
            result.extend(settings.EPO_PUBLICATION_OBSERVERS)
        if extra:
            result.extend(settings.EPO_PUBLICATION_SUCCESS_EXTRA_OBSERVERS)
        if other_instance:
            result.extend(settings.EPO_PUBLICATIONS_OTHER_INSTANCE_OBSERVERS)
        return result

    @property
    def sibling_aspects(self):
        return [drivers.bind(self.category, self.identifier, self.version, aspect, user=self.user) for aspect in drivers.list_aspects(self.category)]

    def has_execute_permission(self):
        return self.user is not None and (self.user.is_superuser or self.user.is_staff)

    @property
    def email_history_line(self):
        return 'publication-mailer-daemon-%s-%s-%s' % (self.category, self.identifier, self.version)

    @property
    def does_exist_in_edition(self):
        return editstore.objects.drivers.convert(self).does_exist()



class DownloadFilesDriverMixin(object):

    has_files = True
    directory_files_propagation = True
    store_file_class = FileDriver

    @property
    def are_files_ready(self):
        return True


    @cached_property
    def system_target_directory(self):
        root = os.path.join(settings.EPO_PUBLISH_DIRECTORY, self.category, self.identifier)
        if self.category == 'womi':
            return root
        else:
            return os.path.join(root, str(self.version))


    def bind_file_driver(self, filename):
        return self.store_file_class(self, filename)


    def download_files(self, propagate=True):

        per_file_files_propagation = propagate and not self.directory_files_propagation
        for f in self.publication_files:
            f.download(propagate=per_file_files_propagation)
        self.as_content_driver().freeze_listing(propagate=per_file_files_propagation)

        if propagate and self.directory_files_propagation:
            self.propagate_files_to_others()


    def propagate_files_to_others(self):
        if not settings.SURROUND_RUNNING_ON_PLATFORM:
            return
        from publication.utils import RemoteExecution
        info('propagating files of %s to other static servers', self)
        with closing(RemoteExecution('static', other=True)) as remote:
            remote.put(self.system_target_directory, recursive=True, clean=True)


    def validate_files(self):
        for f in self.publication_files:
            f.validate()

    def execute_independent_operation(self):
        self.download_files(propagate=True)
        # TODO this is to much here, but let it be for now
        self.as_content_driver().delay_purge_cache()

    def as_content_driver(self):
        import content.objects
        return content.objects.drivers.bind(self.category, self.identifier, self.version)


class PortalPublicationDriver(DownloadFilesDriverMixin, PublicationProcessDriver):

    aspect = 'portal'
    independent_queue = 'static'
    aspect_title = 'Portal'
    aspect_command = u'Publikuj'

    def __init__(self, identifier, version, user=None):
        self.identifier = identifier
        self.version = version
        self.user = user


    @property
    def repository_files(self):
        for f in self.repo_driver.files:
            yield self.bind_file_driver(f.filename)




    @cached_property
    def preview_url(self):
        return self.repo_driver.preview_url


    @property
    def current_target_status(self):
        source_state = self.repo_driver.parsed_object_result.map_state(Publication.SEALED, (repository.utils.ImportFailure, Publication.INVALID), (Http404, Publication.MISSING))

        objects = self.as_content_driver().filter_imported_objects()
        if objects.exists():
            if source_state != Publication.SEALED:
                return Publication.PUBLISHED

            source_edition_timestamp = self.repo_driver.parsed_object.edition_timestamp
            if self.category == 'womi':
                if objects[0].edition_timestamp is not None and source_edition_timestamp is not None and objects[0].edition_timestamp == source_edition_timestamp:
                    return Publication.PUBLISHED
                else:
                    return Publication.STALE
            else:
                return Publication.PUBLISHED

        if source_state == Publication.INVALID:
            return Publication.INVALID

        if source_state == Publication.MISSING:
            return Publication.MISSING

        if self.does_exist_in_edition:
            return Publication.EDITED

        if self.is_invalid:
            return Publication.INVALID

        # source_state == Publication.SEALED:

        if self.are_files_ready:
            return Publication.READY
        else:
            return Publication.SEALED



    def updated_imported(self):
        for obj in self.as_content_driver().filter_imported_objects():
            repository.utils.ContentParser.import_object_metadata(obj)
            obj.save()


    def execute_dependent_operation(self):
        self.execute_import()
        self.updated_imported()


    @property
    def publication_dependencies(self):
        for object_dependency in self.repo_driver.parsed_object.dependencies:
            yield drivers.bind(object_dependency.category, object_dependency.identifier, object_dependency.version, 'portal')


class CollectionPublicationMixin(object):

    def raise_for_invalid(self):
        if self.metadata_xml is None:
            return
        if self.metadata_xml.transformation_notifications:
            raise exceptions.PublicationInvalid('transformation notifications exist: %s' % ', '.join(map((lambda n: '%s: %s' % (n['type'], n['message'].encode('utf-8'))), self.metadata_xml.transformation_notifications)))

    @cached_property
    def metadata_xml(self):
        from editcommon.parsers import EditCommonParser
        try:
            metadata_xml = EditCommonParser.get_metadata_xml(self.identifier, self.version)
            metadata_xml.xml
            return metadata_xml
        except MetadataXmlUnavailable as e:
            return None




class CollectionPublishedFlagDriver(CollectionPublicationMixin, PublicationProcessDriver):

    category = 'collection'
    independent_max_time = 60 * 60 * 24

    def __init__(self, identifier, version, published, user=None):
        self.identifier = str(identifier)
        self.version = int(version)
        self.published = published
        self.user = user

    @property
    def aspect(self):
        return 'show' if self.published else 'hide'

    @property
    def aspect_title(self):
        return u'Włączenie do biblioteki' if self.published else u'Usunięcie z bibloteki'

    @property
    def aspect_command(self):
        return u'Włącz do biblioteki' if self.published else u'Usuń z bibloteki'


    def __reduce__(self):
        return (self.__class__, (self.identifier, self.version, self.published))

    @property
    def publication_dependencies(self):
        return [self.rebind_aspect('portal')]

    def execute_dependent_operation(self):
        from . import signals
        for obj in self.filter_imported_variants():
            obj.md_published = self.published
            obj.save()

        signals.object_published.send_robust('publication', driver=self.as_bare_driver(), published=self.published)

    def filter_imported_variants(self):
        import content.objects
        return content.objects.drivers.bind(self.category, self.identifier, self.version).filter_imported_objects()

    @property
    def current_target_status(self):
        variants = self.filter_imported_variants()

        if variants.exists():
            if variants.exclude(md_published=self.published).exists():
                return Publication.READY
            else:
                return Publication.PUBLISHED

        if self.does_exist_in_edition:
            return Publication.EDITED

        if self.is_invalid:
            return Publication.INVALID

        return Publication.SEALED


    @cached_property
    def published_url(self):
        return self.repo_driver.parsed_object.get_most_specific_library_url()


class CollectionStaticFormatDriver(CollectionPublicationMixin, DownloadFilesDriverMixin, PublicationProcessDriver):

    category = 'collection'
    directory_files_propagation = False
    independent_queue = 'static'

    def __init__(self, identifier, version, format_category, user=None):
        self.identifier = str(identifier)
        self.version = int(version)
        self.format_category = format_category

        self.format_codes = [code for code, specification in CollectionStaticFormatMixin.FORMATS_DICT.items() if specification.category == self.format_category ]

        self.user = user

    @cached_property
    def aspect(self):
        return 'static_%s' % self.format_category



    @property
    def aspect_title(self):
        return u'Publikacja formatu statycznego %s' % self.format_category

    @property
    def aspect_command(self):
        return u'Opublikuj format'


    def __reduce__(self):
        return (self.__class__, (self.identifier, self.version, self.format_category))

    @property
    def publication_dependencies(self):
        return [self.rebind_aspect('portal')]

    def execute_dependent_operation(self):
        import repository.utils
        for variant in self.list_involved_variants(force_all=True):
            for format_code in self.format_codes:
                repository.utils.ContentParser.collect_static_format(variant, format_code)

        self.rebind_aspect('portal').as_content_driver().delay_purge_cache()



    @property
    def publication_files(self):


        if self.metadata_xml is None:
            return


        if self.format_codes[0] not in self.metadata_xml.static_formats:
            return

        yield self.bind_file_driver('metadata.xml')

        for variant in self.involved_variant_names:
            for format_code in self.format_codes:
                format_specification = CollectionStaticFormatMixin.get_specification(format_code)
                yield self.bind_file_driver('%s/%s' % (variant, format_specification.filename))


    @property
    def are_files_ready(self):
        result = all(map(lambda f: f.exists_in_subdomain('preview', pure_head=True), self.publication_files))
        if not result:
            from preview import utils
            monitor = utils.CollectionXMLReferenceMonitor(self.identifier, str(self.version))
            monitor.mark_failure()
        return result


    @property
    def current_target_status(self):

        if self.does_exist_in_edition:
            return Publication.EDITED

        if self.metadata_xml is None:
            return Publication.SEALED

        if self.is_invalid:
            return Publication.INVALID

        if self.format_codes[0] not in self.metadata_xml.static_formats:
            return Publication.PUBLISHED

        if self.imported_objects():
            return Publication.PUBLISHED

        if self.are_files_ready:
            return Publication.READY
        else:
            return Publication.SEALED

    @cached_property
    def published_url(self):
        return self.rebind_aspect('portal').published_url

    @cached_property
    def involved_variant_names(self):
        if self.format_category == 'mobile':
            return [self.metadata_xml.mobile_variant]
        return self.metadata_xml.variant_names


    def list_involved_variants(self, force_all):
        variants = list(self.rebind_aspect('portal').as_content_driver().filter_imported_objects().filter(variant__in=self.involved_variant_names))
        if force_all and len(variants) != len(self.involved_variant_names):
            raise exceptions.PublicationError('not all variants are available')
        return variants

    def imported_objects(self):
        result = []
        for variant in self.list_involved_variants(force_all=False):
            for format_code in self.format_codes:
                static_format = variant.get_static_format_or_none(format_code)
                if static_format is not None:
                    result.append(static_format)
        return result


class CollectionAllDriver(CollectionPublicationMixin, PublicationProcessDriver):

    category = 'collection'
    aspect = 'all'
    aspect_title = u'Wszystko (import + pdfy + włączenie do biblioteki)'
    aspect_command = u'Wykonaj'

    def __init__(self, identifier, version, user=None):
        self.identifier = str(identifier)
        self.version = int(version)
        self.user = user

    @property
    def publication_dependencies(self):
        result = [self.rebind_aspect('show'), self.rebind_aspect('static_pdf')]
        if settings.EPO_PUBLICATION_AUTO_MOBILE:
            result.append(self.rebind_aspect('static_mobile'))
        result.append(self.rebind_aspect('portal'))
        return result

    @property
    def current_target_status(self):
        if self.does_exist_in_edition:
            return Publication.EDITED

        if self.metadata_xml is None:
            return Publication.SEALED

        if self.is_invalid:
            return Publication.INVALID

        for dependency in self.publication_dependencies:
            if dependency.current_target_status != Publication.PUBLISHED:
                return Publication.READY
        return Publication.PUBLISHED


    @cached_property
    def published_url(self):
        return self.rebind_aspect('portal').published_url


class CollectioOtherInstanceDriver(CollectionPublicationMixin, PublicationProcessDriver):

    category = 'collection'
    aspect = 'other'
    # those are these 5 days between beta and production, that nobody cares about
    verifying_max_time = 60 * 60 * 24 * 5

    aspect_command = u'Zleć publikację'

    def __init__(self, identifier, version, user=None):
        self.identifier = str(identifier)
        self.version = int(version)
        self.user = user

    @property
    def publication_dependencies(self):
        return [self.rebind_aspect('show')]

    @property
    def current_target_status(self):
        if self.check_other_instance():
            return Publication.PUBLISHED

        if self.does_exist_in_edition:
            return Publication.EDITED

        if self.is_invalid:
            return Publication.INVALID

        return Publication.READY


    def check_other_instance(self):
        import requests
        try:
            info('verifying %s on other instance: %s', self, self.published_url)
            r = requests.head(self.published_url, timeout=2)
            r.raise_for_status()
            return True
        except requests.exceptions.RequestException:
            return False


    def execute_dependent_operation(self):

        from common.tasks import send_mail_template
        send_mail_template(
            subject='Zlecenie publikacji: %s (%s:%s) na platformie %s' % (self.title, self.identifier, self.version, settings.EPO_PUBLICATIONS_OTHER_INSTANCE_DOMAIN),
            to=self.get_notification_recipients(other_instance=True),
            template_name='publication/mails/other_platform.mail',
            history_line=self.email_history_line,
            context={
                'other_instance_domain': settings.EPO_PUBLICATIONS_OTHER_INSTANCE_DOMAIN,
                'driver': self,
                'TOP_DOMAIN': settings.TOP_DOMAIN,
            },
        )

    def execute_verifying_operation(self):
        if not self.check_other_instance():
            raise exceptions.OtherInstanceNotReadyError('%s is not ready yet on %s' % (self.repo_driver, settings.EPO_PUBLICATIONS_OTHER_INSTANCE_DOMAIN))

    @property
    def aspect_title(self):
        return u'Publikacja na platformie %s' % settings.EPO_PUBLICATIONS_OTHER_INSTANCE_DOMAIN

    @cached_property
    def published_url(self):
        return 'http://www.%s%s' % (settings.EPO_PUBLICATIONS_OTHER_INSTANCE_DOMAIN, reverse('reader_collection_details', args=[self.identifier, self.version]))





class CollectionDriver(CollectionPublicationMixin, PortalPublicationDriver):

    category = 'collection'
    download_fail_on_headers = { 'X-EPO-MATERIALIZED-MODULE-HTML': '1' }


    @property
    def publication_files(self):
        from editcommon.parsers import EditCommonParser

        for f in self.repository_files:
            yield f

        yield self.bind_file_driver('metadata.xml')

        for variant_name in self.metadata_xml.variant_names:
            collection_variant = EditCommonParser.imported_collection_variant(identifier=self.identifier, version=self.version, variant=variant_name)

            yield self.bind_file_driver('%s/collection.xml' % (variant_name))

            for module in collection_variant.modules:
                for module_format in ('xml', 'html'):
                    yield self.bind_file_driver('%s/%s/module.%s' % (variant_name, module.identifier, module_format))


    @cached_property
    def published_url(self):
        return reverse('reader_collection_details', args=[self.identifier, self.version])


    @property
    def are_files_ready(self):
        try:
            from editcommon.parsers import EditCommonParser

            collection_variant = EditCommonParser.imported_collection_variant(identifier=self.identifier, version=self.version, variant=self.metadata_xml.variant_names[0])
            module = next(collection_variant.modules)
            result = self.bind_file_driver('metadata.xml').exists_in_subdomain('preview') and self.bind_file_driver('%s/%s/module.html' % (collection_variant.variant, module.identifier)).exists_in_subdomain('preview', fail_on_headers=self.download_fail_on_headers)
        except Http404:
            result = False

        if not result:
            from preview import utils
            monitor = utils.CollectionXMLReferenceMonitor(self.identifier, str(self.version))
            monitor.mark_failure()

        return result


    def execute_import(self):
        for variant_name in self.metadata_xml.variant_names:
            variant = repository.utils.ContentParser.imported_collection_variant(identifier=self.identifier, version=self.version, variant=variant_name)
            variant.md_published = False
            if self.deduced_kind is not None:
                variant.kind = self.deduced_kind
            variant.save()


    @cached_property
    def deduced_kind(self):
        cols = common.models.Collection.objects.filter(md_content_id=self.identifier).exclude(md_version=self.version).leading().all_latest()
        if len(cols) == 1:
            return cols[0].kind
        else:
            return None



class ModuleDriver(PortalPublicationDriver):

    category = 'module'

    @property
    def publication_files(self):
        return self.repository_files

    def execute_import(self):
        repository.utils.ContentParser.imported_module(identifier=self.identifier, version=self.version)


class WomiDriver(PortalPublicationDriver):

    category = 'womi'

    @property
    def publication_files(self):
        return self.repository_files

    def execute_import(self):
        repository.utils.ContentParser.imported_womi(identifier=self.identifier, version=self.version)


    def execute_independent_operation(self):
        super(PortalPublicationDriver, self).execute_independent_operation()
        if settings.EPO_PUBLICATIONS_CREATE_WOMI_SOURCE_ZIPS:
            SourceGeneratorFileDriver(self).download()


class DriversMultiplexer(repository.objects.DriversMultiplexerMixin, object):

    def bind(self, category, identifier, version, aspect='all', user=None, **kwargs):
        if aspect == 'portal':
            if category == 'collection':
                driver = CollectionDriver(identifier, version, user=user)
            elif category == 'module':
                driver = ModuleDriver(identifier, version, user=user)
            elif category == 'womi':
                driver = WomiDriver(identifier, version, user=user)
            else:
                raise ValueError('invalid category')
        elif category == 'collection':
            if aspect == 'all':
                driver = CollectionAllDriver(identifier, version, user=user)
            elif aspect == 'show':
                driver = CollectionPublishedFlagDriver(identifier, version, published=True, user=user)
            elif aspect == 'hide':
                driver = CollectionPublishedFlagDriver(identifier, version, published=False, user=user)
            elif aspect == 'other' and settings.EPO_PUBLICATIONS_OTHER_INSTANCE_DOMAIN is not None:
                driver = CollectioOtherInstanceDriver(identifier, version, user=user)
            elif aspect.startswith('static_'):
                driver = CollectionStaticFormatDriver(identifier, version, format_category=aspect[7:], user=user)
            else:
                raise ValueError('invalid aspect given: %s' % aspect)
        else:
            raise ValueError('invalid driver specification: %s for category %s' % (aspect, category))

        for k, v in kwargs.items():
            setattr(driver, k, v)

        return driver

    def list_aspects(self, category):
        if category == 'collection':
            aspects = ['all', 'portal']
            if settings.EPO_PUBLICATIONS_OTHER_INSTANCE_DOMAIN is not None:
                aspects += ['other']
            aspects += ['show', 'hide', 'static_pdf', 'static_mobile']
            return aspects

        if category == 'module':
            return ['portal']
        if category == 'womi':
            return ['portal']
        raise ValueError('invalid category given: %s' % category)

drivers = DriversMultiplexer()
