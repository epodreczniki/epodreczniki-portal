# coding=utf-8

from __future__ import absolute_import

from django.template import loader, Context
from django.conf import settings
from django.core.files.uploadedfile import UploadedFile
import repo
from collections import namedtuple
from editstore import models
from common.utils import content_type_to_extension
import json
import itertools

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class Style(object):

    def __init__(self, button, glyph):
        self.button = button
        self.glyph = glyph


STYLES = {
    'new': Style('success', 'file'),
    'import': Style('primary', 'edit'),
    'seal': Style('primary', 'lock'),
    'delete': Style('danger', 'fire'),
    'operation': Style('primary', 'cog'),
    'rename': Style('primary', 'briefcase'),
    'save': Style('primary', 'floppy-disk'),
}

DEFAULT_STYLE = Style('default', 'ok-circle')

def get_style(style):
    return STYLES.get(style, DEFAULT_STYLE)


def check_input_files(files):
    vulnerable_files = []
    for f in files:
        if f.size > settings.EDITRES_FILEUPLOAD_MAX_SIZE:
            vulnerable_files.append(f.name)
    if vulnerable_files:
        raise FilesExceedLimit('\n'.join(vulnerable_files))


def UploadedFile__init__(self, file=None, name=None, content_type=None, size=None, charset=None, content_type_extra=None):
    super(UploadedFile, self).__init__(file, name)
    self.size = size
    self.content_type = content_type
    self.charset = charset
    self.content_type_extra = content_type_extra
    self.fullname = name


UploadedFile.__init__ = UploadedFile__init__


def start_object(request, space, category, repository_name, template_name):
    from . import objects

    repository = repo.repositories.get(repository_name)

    try:
        driver = repository.generate_new_object_line(category, request.user)
        reversed_repository = repo.repositories.match_repository_for_id(driver.category, driver.identifier)
        if reversed_repository is not repository:
            raise Exception('reverse repository check for identifier %s failed: got %s, while should be %s' % (identifier, reversed_repository, repository))
    except Exception as e:
        error('failed to generate new identifier: %s', e)
        raise

    driver.space = space

    debug('creating object %s from template %s', driver, template_name)
    driver.create_from_template(template_name)

    return driver


def get_or_create_user_private_space(user):
    from . import models
    import random
    from django.db.models import Count

    try:
        return models.Space.objects.annotate(users_count=Count('users')).filter(users__role='admin', users__user=user, users_count=1).get()
    except models.Space.DoesNotExist:
        identifier = 's%016x' % (random.getrandbits(64))
        space = models.Space(identifier=identifier, label='private space for %s' % user.username)
        space.save()
        models.UserRoleInSpace(user=user, space=space, role='admin').save()
        return space


def fuzzy_compare_json(left, right):
    if left == right:
        return True
    if type(left) != type(right):
        return False
    if isinstance(left, (list, tuple)):
        return all(itertools.imap(lambda (l, r): fuzzy_compare_json(l, r), itertools.izip_longest(left, right)))
    if isinstance(left, dict):
        left_keys = set(left.keys())
        right_keys = set(right.keys())

        for key in (left_keys | right_keys):
            if not fuzzy_compare_json(left.get(key), right.get(key)):
                return False
        return True

    return False



def files_are_equal(left, right, mimetype, fuzzy=True):
    extension = content_type_to_extension(mimetype)

    if extension == 'json':
        parsed_left = json.loads(left)
        parsed_right = json.loads(right)
        result = (parsed_left == parsed_right)

        if not result:
            return fuzzy_compare_json(parsed_left, parsed_right)

        if not result:
            error('left : %s' % parsed_left)
            error('right: %s' % parsed_right)
        return result


    return left == right


def temporary_rollback_changed_module_identifiers(dry_run=True):
    from . import models
    import editcommon.objects
    import editstore.objects
    import repo
    from repository.utils import map_as_drivers

    fixups = []
    collection_fixups = []

    for module in models.ContentObject.objects.filter(category='module'):
        if module.driver.repository != repo.repositories['content']:
            continue
        if module.driver.origin_driver is None or not module.driver.origin_driver.identifier.startswith('i'):
            continue

        origin_driver = editcommon.objects.drivers.convert(module.driver.origin_driver)
        fixed_driver = origin_driver.bind_next_version_driver()
        # fixed_driver = editcommon.objects.drivers.convert(origin_driver.bind_next_version_driver())
        if editcommon.objects.drivers.convert(fixed_driver) is not None:
            error('failed to rollback %s to %s, which already exists', module.driver, fixed_driver)
            continue

        fixed_driver = editstore.objects.drivers.convert(fixed_driver)
        fixed_driver.space = module.space
        fixed_driver.user = module.space.users.all()[0].user

        info('trying rolling back identifier of %s to %s', module.driver, fixed_driver)
        fixed = False

        for collection in models.ContentObject.objects.filter(category='collection'):
            collection_driver = collection.driver
            collection_driver.user = module.space.users.all()[0].user

            info('checking collection %s', collection_driver)

            for dependency in map_as_drivers(editstore.objects.drivers, collection_driver.parsed_object.dependencies):
                if dependency is None:
                    error('collection %s has broken dependency', collection_driver)
                    continue
                if dependency.equals_pointer(module.driver):
                    if fixed_driver in fixups:
                        error('fixup collision of module %s used in %s - %s already fixed', module.driver, collection_driver, fixed_driver)
                        raise Exception()

                    collection_fixups.append(collection_driver)
                    info('found reference to %s in %s, fixing to: %s', module.driver, collection_driver, fixed_driver)
                    if not dry_run:
                        if not fixed:
                            fixed_driver.create_from(module.driver)
                            fixed_driver.clear_origin()
                        info('fixing reference to %s in %s into: %s', module.driver, collection_driver, fixed_driver)
                        collection_driver.change_module_dependency(module.driver, fixed_driver)
                    fixed = True

        if not fixed:
            warning('module %s not used anywhere - skipping rollback', module.driver)
        else:
            fixups.append(fixed_driver)

    info('done fixups: %r', fixups)
    info('done collection fixups: %r', collection_fixups)



