# coding=utf-8
from __future__ import absolute_import

import repo.files
from django.utils.functional import cached_property
import os.path
import subprocess
from django.conf import settings
import tempfile
import gzip
import zipfile
import requests
import shutil
from . import exceptions
import json
import sys
import traceback
from xml.etree import ElementTree
from contextlib import closing
from repo.exceptions import InvalidObjectException
import store.files

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


if settings.SURROUND_RUNNING_ON_PLATFORM:
    STATIC_COMPRESS_EXTENSIONS = set(('html', 'css', 'js', 'json', 'xml', 'svg', 'otf', 'eot', 'ttf'))
else:
    STATIC_COMPRESS_EXTENSIONS = set()


def validate_image(filepath):
    from PIL import Image
    image = Image.open(filepath)
    image.verify()


def validate_json(filepath):
    with open(filepath, 'r') as f:
        json.load(f)


def validate_xml(filepath):
    ElementTree.parse(filepath)


class FileDriver(repo.files.FileDriver):

    FILE_VALIDATORS = (
        (('womi/classic-*.*', 'womi/mobile-*.*'), validate_image),
        (('womi/*.json', ), validate_json),
        (('*/*.xml', ), validate_xml),
    )

    IGNORED_FILES = (
        'womi/*__MACOSX*',
    )

    @cached_property
    def system_filename(self):
        return os.path.join(*self.filename.split('/'))

    @cached_property
    def full_system_path(self):
        return os.path.join(self.driver.system_target_directory, self.system_filename)

    @property
    def does_validate(self):
        try:
            self.validate()
            return True
        except Exception as e:
            return False

    def as_content_file_driver(self):
        return self.driver.as_content_driver().bind_file_driver(self.filename)

    def content_url(self):
        return self.as_content_file_driver().content_url

    @cached_property
    def is_ignored(self):
        return self.does_match_patterns(self.IGNORED_FILES)

    def validate(self, location=None):
        if self.is_ignored:
            return

        if location is None:
            location = self.full_system_path

        for validation_patterns, validator in FileDriver.FILE_VALIDATORS:
            if self.does_match_patterns(validation_patterns):
                try:
                    validator(location)
                except Exception as e:
                    tb = sys.exc_info()[2]
                    exc = exceptions.InvalidFileError('file %s failes to validate: %s' % (location, e))
                    raise exc.__class__, exc, tb

    def redownload_if_invalid(self, propagate=True):
        if self.is_ignored:
            return
        if self.does_validate:
            return False

        warning('file %s is invalid - redownloading', self)
        self.download(with_validation=True, propagate=propagate)
        return True

    def propagate_to_others(self):
        if not settings.SURROUND_RUNNING_ON_PLATFORM:
            return
        from publication.utils import RemoteExecution
        with closing(RemoteExecution('static', other=True)) as remote:
            remote.put(self.full_system_path, recursive=False)
            if self.gziped_version_driver is not None:
                remote.put(self.gziped_version_driver.full_system_path, recursive=False)

    @cached_property
    def gziped_version_driver(self):
        if self.extension not in STATIC_COMPRESS_EXTENSIONS:
            return None
        return self.rebind_filename("%s.gz" % self.filename)

    def prepare_gziped_version_if_appropriate(self):
        if self.gziped_version_driver is not None:
            gzip.open(self.gziped_version_driver.full_system_path, "wb").writelines(open(self.full_system_path, "rb"))
            debug("gziped: %s", self.gziped_version_driver.full_system_path)
            os.chmod(self.gziped_version_driver.full_system_path, 0644)


    def download(self, with_validation=True, propagate=True):
        if self.is_ignored:
            info('ignoring file publishing: %s', self.get_url('repo'))
            return

        tmp_path = None
        parser_map = DEFAULT_PARSER_MAP.get(self.driver.category, None)
        info('publishing file: %s', self.get_url('repo'))

        try:

            system_target_dir = os.path.dirname(self.full_system_path)

            if os.path.isfile(system_target_dir):
                raise ValueError('path: "%s" is a file and should be directory' % system_target_dir)

            if not os.path.isdir(system_target_dir):
                os.makedirs(system_target_dir, 0755)
                debug("created dir: %s" % system_target_dir)

            if os.path.isfile(self.full_system_path):
                debug("removing target path %s", self.full_system_path)
                os.remove(self.full_system_path)


            tmp_path = tempfile.NamedTemporaryFile(delete=False).name if settings.EPO_PUBLICATION_BUFFER_IN_TMP else self.full_system_path

            self.download_to_file(tmp_path, fail_on_headers=self.driver.download_fail_on_headers)

            if with_validation:
                self.validate(location=tmp_path)


            if parser_map and self.basename in parser_map:
                info("uglyfing downloaded file '%s' with the use of function %s", self.basename, parser_map[self.basename].__name__)
                with open(tmp_path, "r") as read_file:
                    content = read_file.read()

                uglyfied_content = parser_map[self.basename](content)

                with open(tmp_path, "wb") as write_file:
                    write_file.write(uglyfied_content)


            if settings.EPO_PUBLICATION_BUFFER_IN_TMP:
                # debug("rename '%s' to '%s'", tmp_path, self.full_system_path)
                shutil.move(tmp_path, self.full_system_path)
                #os.rename(tmp_path, self.full_system_path)

            os.chmod(self.full_system_path, 0644)

            self.prepare_gziped_version_if_appropriate()


            if propagate:
                self.propagate_to_others()

        except (IOError, subprocess.CalledProcessError, Exception) as e:
            tb = sys.exc_info()[2]
            exc = exceptions.DownloadFailureError('failed to fetch file %s: %s' % (self, e))
            raise exc.__class__, exc, tb
        # except exceptions.FileDownloadError as e:
        #     raise
        finally:
            if settings.EPO_PUBLICATION_BUFFER_IN_TMP and tmp_path and os.path.isfile(tmp_path):
                os.remove(tmp_path)


class SourceGeneratorFileDriver(FileDriver):

    _default_filepath = 'source.zip'

    SPECIAL_INTERACTIVE_ENGINES = {
        'geogebra': 'geogebra.ggb',
        'swiffy': 'swiffy.html',
    }

    def __init__(self, driver):
        super(self.__class__, self).__init__(driver, self._default_filepath)

    def download_to_file(self, filepath, fail_on_headers=None):
        if fail_on_headers is not None:
            raise ValueError('argument fail_on_headers is not supported in %s.download_to_file' % self)
        identifier = self.driver.identifier
        version = self.driver.version
        advanced_driver = self.driver.repo_driver.repository # presume it is repo.drivers.AdvancedDriver

        temp_dir = tempfile.mkdtemp()
        local_files = []

        local_files.append(FileDriver(self.driver, 'manifest.json'))
        local_files.append(FileDriver(self.driver, 'metadata.json'))
        
        is_interactive = False
        try:
            for source_file in advanced_driver.list_womi_source_content_files(identifier, version):
                if source_file.normalized_filepath is not None:
                    dest = os.path.join(temp_dir, source_file.normalized_filepath)
                    store.files.LazyHttpFileDriver(dest, source_file.url).download_to_file(dest)
                else:
                    is_interactive = True
        except InvalidObjectException as e:
            raise exceptions.PublicationInvalid(e)

        if is_interactive:
            engine = self.driver.repo_driver.parsed_object.manifest.get('engine')
            files = advanced_driver.list_filenames_in_interactive_womi(identifier, version)
            if engine in self.SPECIAL_INTERACTIVE_ENGINES:
                files = list(files)
                if len(files) != 1:
                    raise exceptions.PublicationInvalid('interactive type %s is expected to consist of a single file, but %d files found' % (engine, len(files)))
                f = files[0]
                f_driver = FileDriver(self.driver, f)
                dest = os.path.join(temp_dir, self.SPECIAL_INTERACTIVE_ENGINES[engine])
                store.files.LazyHttpFileDriver(f, f_driver.get_url('preview')).download_to_file(dest)
            else:
                for filename in files:
                    file = FileDriver(self.driver, filename)
                    if os.path.isfile(file.full_system_path):
                        local_files.append(file)
                    else:
                        debug('skipping non-existing file for source.zip in womi %s/%s: %s' % (identifier, version, filename))

        info('zipping source.zip for womi %s/%s' % (identifier, version))
        zip = zipfile.ZipFile(filepath, 'w', zipfile.ZIP_DEFLATED, allowZip64=True)
        for root,dirs,files in os.walk(temp_dir):
            for f in files:
                source = os.path.join(root, f)
                debug('zipping %s as %s' % (source, f))
                zip.write(source, f)

        for f in local_files:
            debug('zipping %s as %s' % (f.full_system_path, f.system_filename))
            zip.write(f.full_system_path, f.system_filename)

        zip.close()
        shutil.rmtree(temp_dir, ignore_errors=True)


#UGLY BAD FUNCTION "TEMPORARY" for stripping bad tags from epxml
def _transform_epxml(xslt):

    def wrapper(xml):
        import lxml.etree as et
        from StringIO import StringIO
        dom = et.parse(StringIO(xml))
        transform = et.XSLT(et.parse(StringIO(xslt)))
        return str(transform(dom))
    return wrapper

def _remove_tags_json(tags):

    def wrapper(json_data):
        import json
        data = json.loads(json_data, encoding="utf-8")
        for x in tags:
            if x in data:
                del data[x]
        ret = json.dumps(data, encoding="utf-8", ensure_ascii=False, indent=1)
        ret = unicode(ret).encode("utf-8")
        #debug("Json after parsing: \n%s", ret)
        return ret
    return wrapper


DEFAULT_PARSER_MAP = {
    'module': {
        "module.xml":
               _transform_epxml("""\
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:ep="http://epodreczniki.pl/"
 xmlns:epe="http://epodreczniki.pl/editor"
 xmlns="http://cnx.rice.edu/cnxml" >

 <xsl:template match="ep:technical-remarks">
 </xsl:template>
 <xsl:template match="node() | @*">
   <xsl:copy>
     <xsl:apply-templates select="node() | @*"/>
   </xsl:copy>
 </xsl:template>

 <xsl:template match="epe:review">
     <xsl:apply-templates select="node()"/>
 </xsl:template>

 <xsl:template match="epe:*">
 </xsl:template>

</xsl:stylesheet>""")
    },
    'womi': {
        "metadata.json": _remove_tags_json(["customId", "verificationState", "verificationNotes"])
    }
}
