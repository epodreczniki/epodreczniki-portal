from common.exceptions import NiceException
from common import messaging
from common.kzd import KZD_CATEGORIES
from surround.django.logging import setupModuleLogger
from django.utils.functional import cached_property
from django.core.files.base import ContentFile
from django.conf import settings
from ftplib import FTP, error_perm as FTP_error
import requests
from xml.etree import ElementTree as ET
from .storage import Storage


setupModuleLogger(globals())


class Resource:
    _storage = Storage()
    
    womi_id = None
    womi_version = None

    # files = []
    thumbnail_ftp_path = None
    title = None
    author = None
    description = None
    alt = None
    category = None
    learning_objectives = []
    keywords = None
    license = None
    origin = None
    recipient = None
    environments = []

    loaded = False


    def __init__(self, womi_id=None, womi_version=1, custom_id=None):
        if womi_id is not None and custom_id is None:
            self.womi_id = womi_id
            self.womi_version = womi_version
        elif womi_id is None and custom_id is not None:
            import repo
            self.womi_id = repo.repositories.content.get_womi_id_by_custom_id(custom_id)
            self.womi_version = womi_version
            assert self.womi_version == 1
            assert custom_id == self.custom_id
        else:
            raise ValueError('give either womi_id or custom_id')


    def __str__(self):
        return "Resource %s (WOMI %s/%s)" % (self.custom_id, self.womi_id, self.womi_version)


    def load(self):
        root = self.parsed_xml.find('resource')
        self.thumbnail_ftp_path = self._get_thumbnail_ftp_path_from_xml()
        self.title = root.find('title').text
        self.author = root.find('author').text
        self.description = root.find('description').text
        self.keywords = root.find('keywords').text
        self.alt = root.find('alt').text
        self.category = root.find('category').text
        self.license = root.find('license').text
        self.learning_objectives = [ el.text for el in root.find('learning-objectives').findall('uspp') ]
        # TODO EPB-645 parse other fields
        self.loaded = True


    def _get_thumbnail_ftp_path_from_xml(self):
        thumbnail_el = self.parsed_xml.find('.//resource/files/thumbnail')
        return thumbnail_el.get('path') if thumbnail_el is not None else None
        

    def save(self):
        if not self.loaded:
            raise Exception('cannot save not loaded resource')

        self.validate()

        tree = self.parsed_xml
        el = tree.find('resource')

        if self.thumbnail_ftp_path != self._get_thumbnail_ftp_path_from_xml():
            self.validate_ftp_path(self.thumbnail_ftp_path)
            files_el = el.find('files')
            thumbnail_el = files_el.find('thumbnail')
            if thumbnail_el is None:
                thumbnail_el = ET.Element('thumbnail')
                files_el.append(thumbnail_el)
            thumbnail_el.set('path', self.thumbnail_ftp_path)

        el.find('title').text = self.title
        el.find('author').text = self.author
        el.find('description').text = self.description
        el.find('keywords').text = self.keywords
        el.find('alt').text = self.alt
        el.find('category').text = self.category
        el.find('license').text = self.license
        lo = el.find('learning-objectives')
        for uspp in lo.findall('uspp'):
            lo.remove(uspp)
        for uspp_id in self.learning_objectives:
            child = ET.Element('uspp')
            child.text = uspp_id
            lo.append(child)
        # TODO EPB-645 save other fields
        str = ET.tostring(tree, encoding='utf-8')
        self._storage.get().delete(self.filename)
        self.save_raw(str)
        messaging.publish_json('resource.modified', 'kzd-editor', custom_id=self.custom_id, womi_id=self.womi_id, womi_version=self.womi_version)


    def save_raw(self, raw_xml):
        filename = self._storage.get().save(self.filename, ContentFile(raw_xml))
        logger.info("resource %s (WOMI %s/%s) saved to %s", self.custom_id, self.womi_id, self.womi_version, self.filename)


    def delete(self):
        logger.info('deleting %s', self)
        messaging.publish_json('resource.deleted', 'kzd-editor', custom_id=self.custom_id, womi_id=self.womi_id, womi_version=self.womi_version)
        self._storage.get().delete(self.filename)


    def validate(self):
        if KZD_CATEGORIES.get(self.category, None) is None:
            raise Exception('category "%s" is not valid' % self.category)
        for uspp in self.learning_objectives:
            validate_uspp(uspp)


    def validate_ftp_path(self, path):
        logger.debug("connecting to KZD MEN FTP to check for file existence: %s", path)
        try:
            ftp = FTP(settings.EPO_KZD_MEN_FTP_HOST, settings.EPO_KZD_MEN_FTP_USER, settings.EPO_KZD_MEN_FTP_PASSWORD, timeout=5)
            ftp.size(path) # returns size for files, raises FTP_error for directories and wrong paths
        except FTP_error:
            raise FtpFileNotFoundException()
        except Exception as e:
            logger.exception(e)
            raise FtpConnectionException(e)


    # for forms
    def get(self, field, default=None):
        return self.__dict__.get(field, default)


    @cached_property
    def custom_id(self):
        from repository.utils import MetadataJsonFileProvider
        subdomain = 'preview'
        metadata = MetadataJsonFileProvider.parsed(subdomain, self.womi_id, self.womi_version)
        custom_id = metadata.get('customId', None)
        if custom_id is None:
            raise ResourceNotFoundException('%s/%s' % (self.womi_id, self.womi_version))
        return custom_id


    @cached_property
    def parsed_xml(self):
        from repository.utils import just_parse_xml
        return just_parse_xml(self.xml)


    @cached_property
    def filename(self):
        return self.custom_id + '.xml'


    @cached_property
    def xml(self):
        try:
            with self._storage.get().open(self.filename) as f:
                return f.read()
        except IOError as e:
            logger.exception(e)
            raise ResourceNotFoundException(self.custom_id)


    @staticmethod
    def validate_raw_xml(raw_xml):
        from repository.utils import just_parse_xml
        parsed_xml = just_parse_xml(raw_xml)
        parsed_xml.find('resource').find('title').text



def validate_uspp(key):
    if key == 'ALL':
        return

    uspp_url = 'http://uspp.pl/api/descriptions/%s' % key
    r = requests.head(uspp_url, timeout=2)
    if r.status_code != 200:
        logger.exception('ussp returned status %d for key "%s"', r.status_code, key)
        raise Exception('uspp returned status %d for key "%s"' % (r.status_code, key))



class ResourceNotFoundException(NiceException):
    title = ''
    status = 404


    def __init__(self, custom_id):
        self.title = u"Nie znaleziono zasobu %s" % custom_id
        super(NiceException, self).__init__(self.title)



class FtpFileNotFoundException(Exception):
    pass

class FtpConnectionException(Exception):
    pass

