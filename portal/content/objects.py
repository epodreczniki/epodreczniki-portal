# coding=utf-8
from __future__ import absolute_import

from editcommon.objects import ContentDriverMixin
from content.files import FileDriver
import repository.objects
from django.utils.functional import cached_property
import common.models
import json
import os.path
from surround.django import platform_cache
from django.conf import settings

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class ContentCategoryDriver(repository.objects.CategoryDriver):

    store_file_class = FileDriver
    is_repo_driver = False
    is_edition_driver = False

    def does_exist(self):
        return self.filter_imported_objects().exists()

    def as_publication_driver(self):
        import publication.objects
        return publication.objects.drivers.bind(self.category, self.identifier, self.version, 'portal')

    def get_url_root(self, subdomain):
        result = 'http://%s.%s/content/%s/%s/' % (subdomain, settings.TOP_DOMAIN, self.category, self.identifier)
        if self.category != 'womi':
            result += '%s/' % self.version
        return result

    @property
    def listing_file(self):
        return self.bind_file_driver('listing.json')

    @cached_property
    def listing(self):
        return json.loads(self.listing_file.content)

    def freeze_listing(self, propagate=True):
        from . import utils
        info('freezing listing for %s', self)
        listing = utils.generate_listing_manifest(self)
        publication_driver = self.as_publication_driver()
        listing_driver = publication_driver.bind_file_driver('listing.json')

        with open(listing_driver.full_system_path, 'w') as listing_output:
            json.dump(listing, listing_output, indent=4)

        listing_driver.prepare_gziped_version_if_appropriate()

        if propagate:
            listing_driver.propagate_to_others()


    def warm_cache(self):
        for file_driver in self.files:
            platform_cache.warm_cache(url=file_driver.get_url('content'))

    @property
    def files(self):
        from . import utils
        for f in self.listing:
            bound_file = self.bind_file_driver(f['path'])
            bound_file.size = f['size']
            yield bound_file


    def redownload_files_if_invalid(self, propagate=True):
        import publication.objects
        from . import utils
        publication_driver = publication.objects.drivers.convert(self)
        redownloaded = False
        for f in utils.generate_listing_manifest(self):
            publication_file = publication_driver.bind_file_driver(f['path'])
            if publication_file.redownload_if_invalid(propagate=propagate):
                redownloaded = True
        if redownloaded:
            self.freeze_listing(propagate=propagate)


    def purge_cache(self):
        from surround.django.platform_cache import purge_url
        url = self.get_url_root('content')
        info('purging content object: %s', url)
        purge_url(url)


    def delay_purge_cache(self):
        from . import tasks
        info('scheduling purge cache of %s', self)
        tasks.purge_cache.delay(driver=self)


class CollectionDriver(repository.objects.CollectionDriverMixin, repository.objects.XmlDriverMixin, ContentCategoryDriver):

    def filter_imported_objects(self):
        return common.models.Collection.objects.filter(md_content_id=self.identifier, md_version=self.version)

    @classmethod
    def list_all_objects(cls):
        return common.models.Collection.objects.leading().all()


    def purge_cache(self):
        collection = self.filter_imported_objects()[0]
        import front.views
        import reader.views
        from common.presentations import LATEST_VERSION_MODE

        if collection.md_school is not None:
            info('purging library elements for %s', self)

            subjects = [ None ]
            if collection.md_subject is not None:
                subjects += [ collection.md_subject.id ]

            levels = [ None ]
            if collection.md_school.ep_class is not None:
                levels += [ collection.md_school.ep_class ]
            else:
                levels += collection.md_school.list_specific_classes()

            for subject in subjects:
                for level in levels:
                    front.views.new_index.purge(education_level=collection.md_school.education_code, level=level, subject=subject)

        info('purging reader for %s', self)
        # TODO: check, whether this is the latest one
        for version in [LATEST_VERSION_MODE, collection.md_version]:
            reader.views.bound_views.collection_details.purge(self.identifier, version)
            reader.views.bound_views.variant_details.purge(self.identifier, version, '*')

            reader.views.bound_views.reader.purge(self.identifier, version, variant='*', module_id='*')
            reader.views.bound_views.volatile_module.purge(self.identifier, version, variant='*', module_id='*')

            reader.views.bound_views.table_of_contents.purge(self.identifier, version, '*')



class ModuleDriver(repository.objects.ModuleDriverMixin, repository.objects.XmlDriverMixin, ContentCategoryDriver):

    def filter_imported_objects(self):
        return common.models.Module.objects.filter(md_content_id=self.identifier, md_version=self.version)

    def freeze_listing(self, propagate=True):
        pass

    @property
    def files(self):
        return [self.bind_file_driver('module.xml')]

    @classmethod
    def list_all_objects(cls):
        return common.models.Module.objects.all()


class WomiDriver(repository.objects.WomiDriverMixin, ContentCategoryDriver):

    def filter_imported_objects(self):
        return common.models.Womi.objects.filter(womi_id=self.identifier)

    @classmethod
    def list_all_objects(cls):
        return common.models.Womi.objects.all()


class DriversMultiplexer(repository.objects.DriversMultiplexer):

    def list_all_objects(self, category):
        return self.get(category).list_all_objects()

    def list_all_drivers(self, category):
        for obj in self.get(category).list_all_objects():
            yield self.bind(category, obj.identifier, obj.version)


drivers = DriversMultiplexer(CollectionDriver, ModuleDriver, WomiDriver)

