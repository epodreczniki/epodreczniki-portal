# coding=utf-8
from __future__ import absolute_import

from . import exceptions
from os import path
from django.core.urlresolvers import reverse
import store.files
from repository.utils import ImportFailure
from django.template import loader, Context
import repository.utils
from contextlib import contextmanager
from django.utils.functional import cached_property
from . import utils
from surround.django.utils import always_string
from repository.namespaces import *

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class FileDriverMixin(object):

    def __str__(self):
        return "%s('%s')" % (self.__class__.__name__, self.filename)

    __repr__ = __str__

class StoreFileDriverMixin(object):

    is_editable = True
    is_removeable = True

    check_content_change = True


    @cached_property
    def specialized_editor(self):
        return None


    @contextmanager
    def change_parsed_content(self):
        content = self.parsed_content
        yield content
        self.parsed_content = content


    @cached_property
    def text_editor(self):
        from . import objects
        if not self.is_editable:
            return None

        return objects.EditorPresentationDriver(self.driver, 'Edytor tekstowy', reverse('edittext.views.edittext', args=[self.driver.spaceid, self.driver.category, self.driver.identifier, self.driver.version]) + '?file_path=' + self.filename)


    def compare_content(self, other):
        return utils.files_are_equal(always_string(self.content), always_string(other.content), self.content_type)


    def as_http_response(self):
        """ Realizes EPB-670. """
        response = super(StoreFileDriverMixin, self).as_http_response()
        response['X-EPO-EDITION'] = '1'
        return response



class XmlFileDriverMixin(object):

    is_editable = True
    is_removeable = False



class CollectionXmlFileDriver(XmlFileDriverMixin, StoreFileDriverMixin, store.files.CollectionXmlFileDriver):

    @cached_property
    def specialized_editor(self):
        from . import objects
        return objects.EditorPresentationDriver(self.driver, 'Edytor kolekcji', reverse('editcoll.views.editcoll', args=[self.driver.spaceid, self.driver.identifier, self.driver.version]))


    def validate_before_write(self, new_content, new_parsed_content):
        if self.driver.user is not None:
            # validate non-emptiness of col:modules' attributes
            modules = new_parsed_content.findall('.//' + NS_COLXML('module'))
            for module in modules:
                id = module.get('document')
                if id is None or len(id) == 0:
                    raise exceptions.ValidationFailureException('there is a module with empty identifier')

                version_at_this = module.get(NS_CNXSI('version-at-this-collection-version'))
                if version_at_this is None or len(version_at_this) == 0:
                    raise exceptions.ValidationFailureException('module %s has empty "version-at-this-collection-version" attribute' % id)

                version = module.get('version')
                if version is None or len(version) == 0:
                    raise exceptions.ValidationFailureException('module %s has empty "version" attribute' % id)



class DummyCollectionXmlFileDriver(CollectionXmlFileDriver):

    @property
    def content(self):
        from . import objects

        module = objects.ModuleDriver.bind(self.driver.module_identifier, self.driver.version)
        module.raise_for_exists()

        if module.parsed_object.ep_presentation_template == 'tiled':
            template = 'early_education'
        else:
            template = 'standard'

        template = loader.get_template('dummy_collection_%s.xml' % (template))
        context = Context({
            'collection_id': self.driver.identifier,
            'module_id': self.driver.module_identifier,
            'collection_version': self.driver.version,
            'module_version': self.driver.version,
        })
        rendered = unicode(template.render(context))
        return rendered



class ModuleXmlFileDriver(XmlFileDriverMixin, StoreFileDriverMixin, store.files.ModuleXmlFileDriver):

    @cached_property
    def specialized_editor(self):
        try:
            from . import objects
            if self.driver.parsed_object.ep_presentation_template == 'tiled':

                return objects.EditorPresentationDriver(self.driver, 'Edytor kafli', reverse('editor.views.editor', args=[self.driver.spaceid, self.driver.identifier, self.driver.version]))

            return objects.EditorPresentationDriver(self.driver, 'Edytor treści liniowej', reverse('editline.views.editor', args=[self.driver.spaceid, self.driver.identifier, self.driver.version]))

        except Exception as e:
            warning('invalid module xml: %s', e)
            return None


    def validate_before_write(self, new_content, new_parsed_content):
        if self.driver.user is not None:
            # TODO: EPE-522
            # old content: self.content
            # old parsed content: self.parsed_content
            # list of effective user roles: self.driver.space_driver.user_effective_roles
            # namespaces are already imported
            # for example, get title:
            # title = new_parsed_content.findtext('.//' + NS_MD('title'))
            # if something is wrong, raise exception:
            # if 'xxx' in title:
            #     raise exceptions.ValidationFailureException('hello!')
            pass



class WomiFileDriver(StoreFileDriverMixin, store.files.WomiFileDriver):

    EDITABLE_EXT = {
        'js': True,
        'json': True,
        'txt': True,
        'html': True,
        'htm': True
    }

    REMOVABLE_BLACKLIST = {
        'metadata.json': False
    }

    @property
    def is_editable(self):
        return WomiFileDriver.EDITABLE_EXT.get(path.splitext(self.filename)[1][1:], False)

    @property
    def is_removeable(self):
        return WomiFileDriver.REMOVABLE_BLACKLIST.get(self.filename, True)

    @cached_property
    def specialized_editor(self):
        from . import objects
        if self.filename == 'exercise.json':
            return objects.EditorPresentationDriver(self.driver, 'Edytor WOMI silnikowych', reverse('edittext.views.editwomi', args=[self.driver.spaceid, self.driver.identifier, self.driver.version]) + '?file_path=' + self.filename)
        else:
            return None


