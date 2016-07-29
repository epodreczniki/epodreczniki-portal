import os.path
import common.models

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

def object_directory_visitor((publication_driver, listing), dirname, names):
    # print('visiting: %s' % dirname)

    for name in names:
        full_path = os.path.join(dirname, name)
        # print('checking: %s' % full_path)
        if not os.path.isfile(full_path):
            continue
        if name == 'listing.json':
            continue
        relative_path = os.path.relpath(full_path, publication_driver.system_target_directory)
        listing.append({
            'path': relative_path,
            'size': os.path.getsize(full_path),
        })


def generate_listing_manifest(driver):
    publication_driver = driver.as_publication_driver()
    listing = []
    os.path.walk(publication_driver.system_target_directory, object_directory_visitor, (publication_driver, listing))
    return listing

def chain_files(objects):
    for obj in objects:
        for f in obj.as_content_driver().files:
            yield f

DEFAULT_PATTERNS = (
    '*',
    'collection/*',
    'module/*',
    'womi/*',
    'collection/*/*.pdf',
    'collection/*/*.epub',
    'collection/*/mobile-*.zip',
    'collection/*/module.html',
    'collection/*/module.xml',
    'collection/*collection.xml',
    'womi/classic-*.*',
    'womi/metadata.json',
    'womi/manifest.json',
    'womi/exercise.json',
)

def generate_file_summary(objects=None, patterns=DEFAULT_PATTERNS):

    if objects is None:
        objects = common.models.Collection.merge_deep_dependencies(common.models.Collection.objects.leading().all())

    groups = {}
    for obj in objects:
        info('checking files in: %s', obj)
        for f in obj.as_content_driver().files:
            for pattern in patterns:
                if f.does_match_patterns([pattern]):
                    try:
                        group = groups[pattern]
                    except KeyError:
                        group = { 'size': 0, 'count': 0 }
                        groups[pattern] = group

                    group['size'] += f.size
                    group['count'] += 1

    return groups


