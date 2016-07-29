# coding=utf-8

from __future__ import absolute_import
from django.conf import settings
from surround.django.decorators import never_cache_headers
import re
import json
from .base import BaseDriver, MODIFICATION_IN_TOTAL_PAST
from ..exceptions import InvalidObjectException
from django.http import Http404
from django.http import HttpResponseNotFound
from common.utils import extension_to_content_type, content_type_to_extension
import zipfile
import requests
from common.utils import IMAGE_FILE_EXTENSION_FILTER
import random
import datetime
from repo.objects import drivers
from collections import namedtuple
import editstore.objects
import editstore.files
from repo import exceptions
from django.template.loader import render_to_string
from surround.django.utils import always_string
from common.todo import HARDCODED_WOMI_VERSION_ONE
from django.utils.http import urlencode
import dateutil.parser
from repository.namespaces import *
import fnmatch
import os.path
from django.utils.functional import cached_property

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

PREVIEW_WOMI_EXT_MATCHER = re.compile(r'^(?P<before_dot>.*?)(?:\.(?P<ext>\w+))?$')
PREVIEW_WOMI_IMAGE_IS_WOMI = re.compile(r'^(classic|mobile)')
PREVIEW_WOMI_IMAGE_SUBSTITUTE = re.compile(r"(?P<mode>\w+)-(?P<resolution>\d+)")



def rewrite_content_path(womi_id, womi_path):

    if womi_path == 'manifest.json':
        return ('/repo/womi-manifest/%s' % (womi_id), None)

    if womi_path == 'metadata.json':
        return ('/repo/womi-metadata/%s' % (womi_id), None)

    # TODO EPF-197: this 'if' should be changed to:
    # if womi_path == 'swiffy.html' or womi_path == 'geogebra.html':
    if womi_path == 'geogebra.html':
        return ('/repo/womi/%s/package/classic' % womi_id, None)

    womi_path_match = PREVIEW_WOMI_EXT_MATCHER.match(womi_path)
    if womi_path_match is None:
        raise Http404("invalid womi reference")
    ext = womi_path_match.group('ext')
    before_dot = womi_path_match.group('before_dot')

    if before_dot == 'icon':
        return ('/repo/womi/%s/icon/classic' % womi_id, None)

    if ext and IMAGE_FILE_EXTENSION_FILTER.match(ext) and PREVIEW_WOMI_IMAGE_IS_WOMI.match(before_dot):
        with_resolution = PREVIEW_WOMI_IMAGE_SUBSTITUTE.match(before_dot)
        if with_resolution:
            suffix = 'image/%s?res=%s' % (with_resolution.group('mode'), with_resolution.group('resolution'))
        else:
            suffix = 'image/' + before_dot
        # content_type is not returned here, because RT returns correct (?) content type by itself
        return ('/repo/womi/%s/%s' % (womi_id, suffix), None)

    return ('/repo/womi/%s/package/classic?path=%s' % (womi_id, womi_path),
            extension_to_content_type(ext))


COLLECTION_RESERVATION_IDENTIFIER = 'reservation'

class ReservationCollectionXmlFileDriver(editstore.files.CollectionXmlFileDriver):

    @property
    def content(self):
        return render_to_string('repo/advanced/collection_reservation.xml', {})

class ReservationCollectionDriver(editstore.objects.CollectionDriver):

    store_file_class = ReservationCollectionXmlFileDriver

    @classmethod
    def bind(cls, identifier, version, user=None):
        return cls(identifier, version, user)


    # def _generate_xml(self, template, context):
    #     template = loader.get_template(template)
    #     _context = Context(context)
    #     return (ContentFile(template.render(_context))).read()

# def properties_gen(props):
#     template = loader.get_template('publication.properties')
#     context = Context({'tuples': props})
#     return (ContentFile(template.render(context))).read()

class AdvancedDriver(BaseDriver):

    can_create_new_objects_lines = ( 'collection', 'module', ) if settings.EPO_REPO_ADVANCED_ENABLE_SEALING else ('module', )
    can_seal_objects = (( 'collection', 'module', 'womi') if settings.EPO_REPO_ADVANCED_ENABLE_SEALING else tuple())

    does_support_versioning = ('collection', 'module', )

    is_append_only = ('collection', 'module', )

    backend_identifier_separator = '__version__'

    def __init__(self, name, **kwargs):
        super(AdvancedDriver, self).__init__(name, **kwargs)
        self._host_header = None


    @classmethod
    def split_identifier(cls, backend_identifier):
        index = backend_identifier.find(cls.backend_identifier_separator)
        if index == -1:
            return backend_identifier, '1'
        else:
            return backend_identifier[:index], backend_identifier[(index + len(cls.backend_identifier_separator)):]


    @classmethod
    def merge_identifier(cls, identifier, version):
        if int(version) == 1:
            return identifier
        return '%s%s%s' % (identifier, cls.backend_identifier_separator, version)


    def generate_new_object_line(self, category, user=None):
        import editstore.objects
        if category == 'collection':
            driver = ReservationCollectionDriver.bind(COLLECTION_RESERVATION_IDENTIFIER, '1', user=user)
            ready_driver = self._upload_object(driver)
            return editstore.objects.drivers.bind('collection', ready_driver.identifier, '2', user=user)

        if category == 'module':
            return editstore.objects.drivers.bind('module', '%s%016x' % (self.config["namespacePrefix"], random.getrandbits(64)), '1', user=user)

        raise NotImplementedError()



    def present_womi_file(self, request, womi_id, version, womi_path):

        if int(version) != 1:
            return HttpResponseNotFound()

        req_url, content_type = rewrite_content_path(womi_id, womi_path)

        return self.internal_redirect(request, req_url, content_type=content_type)


    def present_module_xml(self, request, module_id, version):

        return self.internal_redirect(request, '/repo/module/%s' % self.merge_identifier(module_id, version), content_type='application/xml')

    def seal_object(self, driver):
        from editstore.exceptions import SealException
        try:
            sealed_driver = self._upload_object(driver)
            return drivers.convert(sealed_driver)
        except Exception as e:
            logger.exception('exception while sealing: %s', e)
            # error('failed to seal %s: %s', driver, e)
            raise SealException('failed to seal %s: %s' % (driver, e))

    def _upload_object(self, driver):
        import tempfile
        import os
        from os import path
        import subprocess
        from repository.utils import parse_xml
        from repository.utils import print_xml
        from editstore.exceptions import SealException

        info('uploading %s to advanced repository', driver)

        # if driver.category == 'module' and int(driver.version) != 1:
        #     raise SealException(u'Nie można zapieczętować wersji nr 2 i dalszych')

        if driver.category == 'collection' and int(driver.version) > 1:
            for version in xrange(1, int(driver.version)):
                previous_driver = drivers.bind('collection', driver.identifier, version, user=driver.user)

                if not previous_driver.does_exist():
                    raise SealException('Failed to seal collection version %s - version %s does not exist' % (driver.version, version))

        if driver.category in ('collection', 'module', 'womi'):

            nice_path_name = '%s-%s-%s' % (driver.category, driver.identifier, driver.version)
            temp = tempfile.mkdtemp(suffix=nice_path_name)

            try:
                out_dir = path.join(temp, nice_path_name)
                os.makedirs(out_dir)

                def write_file(name, content):
                    with open(path.join(out_dir, name), 'wb') as f:
                        f.write(always_string(content))

                def write_template(name, template_name, **kwargs):
                    write_file(name, render_to_string(template_name, kwargs))

                debug('using temporary path "%s" for upload to advanced repository', out_dir)

                # advanced_driver = driver.rebind(identifier=driver.identifier, version='1')
                # xml = parse_xml(repr(driver), driver.main_file.content)
                # advanced_driver.update_xml(xml)

                if driver.category == 'collection':
                    write_file('collection.xml', driver.main_file.content)

                    if driver.identifier == COLLECTION_RESERVATION_IDENTIFIER:
                        metadata_id = None
                    else:
                        metadata_id = driver.identifier

                    # if int(driver.version) == 2:
                    #     publication_id = driver.identifier
                    # else:
                    #     publication_id = None

                    write_template('publication.properties', 'repo/advanced/collection.properties',
                        date=datetime.datetime.now(),
                        identifier=driver.identifier,
                        publication_id=None,
                        # publication_id=publication_id,
                    )

                    editor_mode = driver.main_file.parsed_content.findtext(NS_COLXML('metadata') + '/' + NS_EP('e-textbook') + '/' + NS_EP('editor'))

                    write_template('metadata.xml', 'repo/advanced/collection_metadata.xml', metadata_id=metadata_id, editor_mode=editor_mode)

                elif driver.category == 'module':
                    backend_identifier = self.merge_identifier(driver.identifier, driver.version)
                    write_file('module.xml', driver.main_file.content)
                    write_template('publication.properties', 'repo/advanced/module.properties', date=datetime.datetime.now(), identifier=backend_identifier)
                    write_file('metadata.xml', '<?xml version="1.0" encoding="UTF-8"?><metadata></metadata>')

                elif driver.category == 'womi':
                    womi_dir = '%s_%s' % (driver.identifier, driver.version)
                    out_womi_dir = path.join(out_dir, womi_dir)
                    os.makedirs(out_womi_dir)

                    womi_zip_name = 'womi_%s_%s.zip' % (driver.identifier, driver.version)
                    formats = { 'INTERACTIVE_PACKAGE_CLASSIC': womi_zip_name }

                    os.makedirs(path.join(out_womi_dir, 'INTERACTIVE_PACKAGE_CLASSIC'))
                    with zipfile.ZipFile(path.join(out_womi_dir, 'INTERACTIVE_PACKAGE_CLASSIC', womi_zip_name), "w") as zf:
                        for f in driver.files:
                            if f.filename != 'metadata.json':
                                zf.writestr(f.filename, f.content)

                    metadata_json = json.loads(driver.metadata_file.content)

                    write_template('publication.properties', 'repo/advanced/womi/root_publication.properties')
                    write_template(path.join(out_womi_dir, 'publication.properties'), 'repo/advanced/womi/publication.properties', edition_id=driver.identifier, metadata_json=metadata_json)
                    write_template(path.join(out_womi_dir, 'multiFormat.xml'), 'repo/advanced/womi/multiformat.xml', formats=formats)
                    write_template(path.join(out_womi_dir, 'metadata.xml'), 'repo/advanced/womi/metadata.xml', parsed=driver.parsed_object, metadata_json=metadata_json)
                    # import os ; os.system('cat %s' % path.join(out_womi_dir, 'metadata.xml'))
                    # import os ; os.system('cat %s' % path.join(out_womi_dir, 'publication.properties'))

                extract_identifier = (driver.category == 'collection' and driver.identifier == COLLECTION_RESERVATION_IDENTIFIER)

                path_for_uploader = out_dir if driver.category == 'womi' else temp
                args = ['python', path.join(settings.DJANGO_PROJECT_PATH, 'manage.py'), 'advanced_uploader', '--directory', path_for_uploader]
                if extract_identifier:
                    args += ['--extract-identifier']

                result = subprocess.check_output(args, close_fds=True)

                if extract_identifier:
                    lines = result.split('\n')
                    driver.identifier = lines[0]

            except Exception as e:
                failed_temp = '%s-failed' % temp
                warning('failed to upload %s driver (saved in %s): %s', driver, failed_temp, e)
                os.rename(temp, failed_temp)
                raise

            info('uploaded %s to advanced repository', driver)

            os.rename(temp, '%s-success' % temp)

            if driver.category != 'womi':
                return driver
            else:
                return driver.rebind(driver.identifier, HARDCODED_WOMI_VERSION_ONE)

        raise NotImplementedError('sealing of %s objects not supported' % driver.name)



    def present_collection_xml(self, request, collection_id, version):
        return self.internal_redirect(request, '/repo/collxml/%s/%s' % (collection_id, version), content_type='application/xml')


    def get_womi_file(self, womi_id, version, filename, lazy):
        from store import files
        # TODO: fix this
        url = 'http://preview.%s/content/womi/%s/%s/%s' % (settings.TOP_DOMAIN, womi_id, version, filename)
        if lazy:
            return files.LazyHttpFileDriver(filename, url)
        else:
            try:
                file_request = requests.get(url)
                file_request.raise_for_status()
                return files.SimpleInMemoryFileDriver(filename, file_request.content)
            except Exception as e:
                raise exceptions.ObjectFileUnavailableException('failed to get womi file %s:%s %s under url %s: %s' % (womi_id, version, filename, url, e))


    def get_system_info(self, driver):
        import store.exceptions
        if driver.category == 'collection':
            address = '/repo/system-info/collection/%s/%s' % (driver.identifier, driver.version)
        elif driver.category == 'module':
            address = '/repo/system-info/module/%s' % self.merge_identifier(driver.identifier, driver.version)
        elif driver.category == 'womi':
            if int(driver.version) != 1:
                raise store.exceptions.DoesNotExist('cannot fetch system info for womi with version other than 1')
            address = '/repo/system-info/womi/%s' % driver.identifier
        else:
            raise Exception('invalid category')

        try:
            debug('checking info for %s', driver)
            return self.get_request_from_backend(address).json()
        except Exception as e:
            raise store.exceptions.DoesNotExist('no system info for %s' % driver)


    def get_edition_timestamp(self, driver):
        from django.utils import timezone
        try:
            # return timezone.get_current_timezone().localize(dateutil.parser.parse(self.get_system_info(driver)['lastModified']).replace(microsecond=0))
            return dateutil.parser.parse(self.get_system_info(driver)['lastModified']).replace(microsecond=0)
        except Exception as e:
            return MODIFICATION_IN_TOTAL_PAST


    def list_womi_source_content_files(self, identifier, version):
        if int(version) != 1:
            raise Http404('content repository does not support womi versions yet')

        womi_source = WomiSource(self, identifier)
        womi_source.load_multiformat()
        for id,file in womi_source.formats.iteritems():
            yield file


    def list_womi_content(self, womi_id, version):
        if int(version) != 1:
            raise Http404('content repository does not support womi versions yet')

        from store import files
        from StringIO import StringIO
        import contextlib

        content_was_accessed = False
        metadata_json = self.get_womi_file(womi_id, version, 'metadata.json', lazy=False)
        yield metadata_json
        if metadata_json.was_content_accessed:
            content_was_accessed = True

        metadata = json.loads(metadata_json.content)

        womi_type = metadata['womiType']

        womi_source = WomiSource(self, womi_id)
        womi_source.load_multiformat()

        manifest_json = self.get_womi_file(womi_id, version, 'manifest.json', lazy=False)
        yield manifest_json
        if manifest_json.was_content_accessed:
            content_was_accessed = True

        manifest = json.loads(manifest_json.content)


        if womi_type == 'interactive':
            downloaded_zip = False

            if content_was_accessed:
                package_classic_url = womi_source.formats['INTERACTIVE_PACKAGE_CLASSIC'].url
                package_length = int(requests.head(package_classic_url).headers['content-length'])

                if package_length < 1024 * 1024 * 32:
                    debug('switching to listing womi %s through zip file', womi_id)
                    downloaded_zip = True

                    zip_buffer = StringIO()
                    with contextlib.closing(requests.get(package_classic_url, stream=True)) as r:
                        for c in r.iter_content(chunk_size=1000000):
                            zip_buffer.write(c)

                    with zipfile.ZipFile(zip_buffer, "r") as zf:

                        for fileinfo in zf.filelist:
                            filename = fileinfo.filename.replace('\\', '/')
                            if filename.endswith('/'):
                                continue
                            if filename == 'metadata.json':
                                # this should not be here
                                continue

                            if filename == 'manifest.json':
                                continue

                            with zf.open(fileinfo.filename) as f:
                                yield files.SimpleInMemoryFileDriver(filename, f.read())

            if not downloaded_zip:
                for filename in self.list_filenames_in_interactive_womi(womi_id, version):
                    yield self.get_womi_file(womi_id, version, filename, lazy=True)

        if womi_type == 'graphics' or womi_type == 'movie' or womi_type == 'interactive':

            # for target_name in ('classic', 'mobile'):
            for target_name in ('classic',):
                target = manifest['parameters'].get(target_name, None)
                if target is None:
                    continue
                mimetype = target['mimeType']
                extension = content_type_to_extension(mimetype)

                if mimetype == 'image/svg+xml':
                    yield self.get_womi_file(womi_id, version, '%s.%s' % (target_name, extension), lazy=True)
                else:
                    for resolution in target['resolution']:
                        yield self.get_womi_file(womi_id, version, '%s-%s.%s' % (target_name, resolution, extension), lazy=True)


        if womi_type == 'icon':
            target = manifest['parameters']['classic']
            mimetype = target['mimeType']
            extension = content_type_to_extension(mimetype)

            yield self.get_womi_file(womi_id, version, 'icon.%s' % (extension), lazy=True)

        if womi_type == 'sound':
            # no more here
            pass


    def list_filenames_in_interactive_womi(self, womi_id, version):
        if int(version) != 1:
            raise Http404('content repository does not support womi versions yet')

        listing = self.get_request_from_backend('/repo/womi/%s/package/classic?list' % womi_id, quiet=True, timeout=10).json()
        for entry in listing['files']:
            filename = entry['path']
            if filename == 'manifest.json':
                continue
            if filename == 'metadata.json':
                # this should not be here
                continue
            if isinstance(filename, unicode):
                try:
                    filename = filename.decode('ascii')
                except UnicodeEncodeError:
                    continue
            yield filename


    def search_womis(self, folder):

        womi_batch_size = 50
        womi_page_number = 0

        while True:
            try:
                debug('fetching womi list batch number: %s', womi_page_number)
                womi_list = self.get_request_from_backend('/repo/searchwomi?' + urlencode({ 'folder': folder, 'pageIndex': womi_page_number, 'pageSize': womi_batch_size}), timeout=30, attempts=5).json()
            except Exception as e:
                info('encountered exception (last womi batch %s): %s', womi_page_number, e)
                break
            else:
                womi_page_number += 1
                for womi in womi_list['items']:
                    yield drivers.bind('womi', str(womi['id']), HARDCODED_WOMI_VERSION_ONE)
                # TODO EPB-792 this 'if' is just temporary...
                if len(womi_list['items']) < womi_batch_size:
                    info('presuming %d as last page' % womi_page_number)
                    break


    def get_kzd_womis(self):
        return self.search_womis(folder=settings.EPO_KZD_CONTENT_REPOSITORY_DIRECTORY_ID)


    def get_womi_id_by_custom_id(self, custom_id):
        resp = self.get_request_from_backend('/repo/searchwomi?customId=%s' % custom_id, timeout=20).json()
        assert resp['count'] == 1 and len(resp['items']) == 1
        assert resp['items'][0]['identifier'][0] == custom_id
        return resp['items'][0]['id']


    def list_all_objects(self, category):
        if category == 'collection':
            collections_list = self.get_request_from_backend('/repo/collections-list').json()
            for line in collections_list:
                for version in line['versions']:
                    yield drivers.bind('collection', str(line['id']), version)

        elif category == 'module':
            modules_list = self.get_request_from_backend('/repo/modules-list').json()
            for merged_identifier in modules_list:
                identifier, version = self.split_identifier(merged_identifier)
                yield drivers.bind('module', identifier, version)

        elif category == 'womi':
            for womi_driver in self.search_womis(folder='1'):
                yield womi_driver


    def raise_for_object_importability(self, driver):
        from editstore.exceptions import UnsupportedObjectImportFailure

        if driver.category == 'womi':
            manifest = json.loads(driver.bind_file_driver('manifest.json').content)
            engine = manifest.get('engine', None)
            if engine in ('geogebra', 'swiffy'):
                raise UnsupportedObjectImportFailure('import of womi %s/%s with engine %s is not supported' % (driver.identifier, driver.version, engine))

            womi_source = WomiSource(self, driver.identifier)
            womi_source.load_multiformat()

            for format_name in womi_source.formats.keys():
                if format_name != 'INTERACTIVE_PACKAGE_CLASSIC':
                    raise UnsupportedObjectImportFailure('import of womi %s/%s with format %s is not supported' % (driver.identifier, driver.version, format_name))


    def find_latest_version(self, category, identifier):
        import store.exceptions

        previous_version = None
        version = 1
        while True:
            try:
                info = self.get_system_info(drivers.bind(category, identifier, version))
            except store.exceptions.DoesNotExist as e:
                return previous_version

            previous_version = version
            version += 1





class WomiSource(object):

    class Format(object):

        NORMALIZATION_MAP = {
            '*_IMAGE_CLASSIC': {
                'filepath': 'classic',
                'extensions': ['png', 'jpg', 'svg']
            },
            '*_IMAGE_MOBILE': {
                'filepath': 'mobile',
                'extensions': ['png', 'jpg', 'svg']
            },
            '*_IMAGE_PDF': {
                'filepath': 'static',
                'extensions': ['png', 'jpg', 'svg']
            },
            '*_IMAGE_EBOOK': {
                'filepath': 'static-mono',
                'extensions': ['png', 'jpg', 'svg']
            },
            '*_ICON_CLASSIC': {
                'filepath': 'classic',
                'extensions': ['png', 'jpg', 'svg']
            },
            '*_ICON_MOBILE': {
                'filepath': 'mobile',
                'extensions': ['png', 'jpg', 'svg']
            },
            '*_ICON_PDF': {
                'filepath': 'static',
                'extensions': ['png', 'jpg', 'svg']
            },
            '*_ICON_EBOOK': {
                'filepath': 'static-mono',
                'extensions': ['png', 'jpg', 'svg']
            },
            '*_VIDEO_CLASSIC': {
                'filepath': 'video',
                'extensions': ['mp4']
            },
            '*_SUBTITLES_CLASSIC': {
                'filepath': 'subtitles',
                'extensions': ['vtt']
            },
            '*_CAPTIONS_CLASSIC': {
                'filepath': 'captions',
                'extensions': ['vtt']
            },
            '*_CHAPTERS_CLASSIC': {
                'filepath': 'chapters',
                'extensions': ['txt']
            },
            '*_AUDIO_CLASSIC': {
                'filepath': 'audio',
                'extensions': ['mp3', 'mp4', 'wav']
            },
            '*_DESCRIPTION_CLASSIC': {
                'filepath': 'description',
                'extensions': ['txt']
            },
            'ALTERNATIVES': {
                'filepath': 'alternatives',
                'extensions': ['zip']
            },
            '*_PACKAGE_CLASSIC': {
                'filepath': None,
                'extensions': ['zip']
            },
        }

        NORMALIZE_EXTENSION = {
            'jpeg': 'jpg',
        }
        
        def __init__(self, repo_root, womi_id, id, mainfile, use_id_in_url=True):
            self.id = id
            self.mainfile = mainfile
            if use_id_in_url:
                self.url = '%s/Content/%s/%s/%s' % (repo_root, womi_id, id, mainfile)
            else:
                self.url = '%s/Content/%s/%s' % (repo_root, womi_id, mainfile)

        def __str__(self):
            return "%s %s" % (self.__class__, vars(self))

        @property
        def mainfile_extension(self):
            return os.path.splitext(self.mainfile)[1][1:]

        @cached_property
        def normalized_filepath(self):
            map = self.get_normalization_map()
            ext = self.mainfile_extension.lower()
            ext = ext if ext not in self.NORMALIZE_EXTENSION else self.NORMALIZE_EXTENSION[ext]
            if ext not in map['extensions']:
                raise InvalidObjectException('extension %s is not allowed for %s' % (ext, self.id))
            if map['filepath'] is not None:
                return '%s.%s' % (map['filepath'], ext)
            else:
                return None

        def get_normalization_map(self):
            for key in self.NORMALIZATION_MAP:
                if fnmatch.fnmatchcase(self.id, key):
                    return self.NORMALIZATION_MAP[key]
            raise InvalidObjectException('not supported womi source format: %s' % self.id)


    def __init__(self, repo, womi_id):
        self.repo = repo
        self.womi_id = womi_id
        self.formats = {}


    @property
    def repo_root(self):
        domain = settings.FIRST_BACKEND_DIRECT_ADDRESS[self.repo.name + '_repository']
        # domain = self.repo.domain
        return 'http://%s/repo' % domain


    @property
    def multiformat_url(self):
        # return 'https://epodreczniki.pcss.pl/repo/Content/%s/multiFormat.xml' % (self.womi_id)
        return '%s/Content/%s/multiFormat.xml' % (self.repo_root, self.womi_id)


    def load_multiformat(self, timeout=22):
        import xml.etree.ElementTree as ET
        import requests

        try:
            multiformat = requests.get(self.multiformat_url, timeout=timeout)
            multiformat.raise_for_status()

            formats = ET.fromstring(multiformat.content)

            self.formats = {}
            for f in formats.findall('format'):
                id = f.get('id')
                mainfile = f.get('mainFile')
                self.formats[id] = WomiSource.Format(self.repo_root, self.womi_id, id, mainfile)

            alt = formats.find('./alternatives')
            if alt is not None and alt.get('exist', 'false') == 'true':
                id = 'ALTERNATIVES'
                mainfile = 'ALTERNATIVES.zip'
                self.formats[id] = WomiSource.Format(self.repo_root, self.womi_id, id, mainfile, use_id_in_url=False)

        except requests.exceptions.RequestException as e:
            from editstore.exceptions import ObjectDoesNotExistInRepository
            raise ObjectDoesNotExistInRepository('failed to fetch womi multiformat from %s: %s' % (self.multiformat_url, e))


