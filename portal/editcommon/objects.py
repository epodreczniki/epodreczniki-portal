# coding=utf-8
from __future__ import absolute_import
from django.utils.functional import cached_property
import repository.objects
from common.utils import format_timestamp


class ContentDriverMixin(object):

    _descriptor = None

    @cached_property
    def search_descriptor(self):

        obj = self.parsed_object

        attributes = {
            'title': obj.md_title,
            'edited': obj.edition_timestamp.isoformat(),
        }

        if self.category == 'collection':
            attributes.update({
                'subject': obj.md_subject.md_name if obj.md_subject is not None else None,
                'school': 'Etap: %s, Klasa: %s' % (obj.md_school.md_education_level, obj.md_school.ep_class if obj.md_school.ep_class is not None else 'brak') if obj.md_school is not None else None,
                'abstract': obj.md_abstract,
            })

        if self.category == 'womi':
            # manifest = self.manifest_file.content
            attributes.update({
                'type': obj.womi_type.name,
                'engine': obj.manifest.get('engine'),
                'purpose': obj.metadata.get('purpose'),
                'keywords': obj.metadata.get('keywords'),
                'license': obj.metadata.get('license'),
            })
            extended = obj.metadata.get('extended')
            if extended:
                abilities = extended.get('learningObjectives')
                if len(abilities) == 0:
                    # empty ability list is interpreted as all educationLevels
                    educationLevels = ['E1', 'E2', 'E3', 'E4']
                else:
                    educationLevels = []
                    for ability in abilities:
                        code = ability[:2] # extracts education level from ability code
                        if code not in educationLevels:
                            educationLevels.append(code)
                attributes.update({
                    'extended_category': extended.get('category'),
                    'description': extended.get('description'),
                    'curriculum': extended.get('learningObjectives'),
                    'recipient': extended.get('recipient'),
                    'educationLevels': educationLevels,
                })

            if obj.manifest.get('engine') == 'womi_aggregate':
                for item in obj.manifest.get('items'):
                    if item.get('role') == 'thumbnail':
                        attributes.update({
                            'thumbnail': {
                                'id': str(item.get('womiId')),
                                'version': str(item.get('womiVersion')),
                            }
                        })

        descriptor = {
            'attributes': attributes,
            'files': [{ 'path': f.filename, 'full_text': f.is_text_file } for f in self.files ],
            'using': [dep.short_descriptor for dep in obj.dependencies],
        }

        if self.category in ('collection', 'module', 'womi'):
            descriptor.update(authors=[{
                'full_name': authorship.author.md_full_name,
                'email': authorship.author.md_email,
            } for authorship in obj.authorships.all()])

        if self.category in ('womi'):
            descriptor.update(authors=[{
                'full_name': authorship,
            } for authorship in obj.metadata['author'].split(",") if 'author' in obj.metadata])

        if self.category in ('collection', 'module'):
            attributes.update({
                'created': obj.md_created.isoformat(),
                'revised': obj.md_revised.isoformat(),
            })


        descriptor.update(obj.short_descriptor)

        return descriptor


    def _fill_json_state(self, result):
        raise NotImplementedError('_fill_json_state in %s' % self)

    @cached_property
    def json_state(self):
        if not self.does_exist():
            return None

        result = {
            "identifier": self.identifier,
            "version": str(self.version),
            "title": self.title,
        }
        self._fill_json_state(result)
        return result

    @property
    def effective_cover_url(self):
        from front.templatetags.collection_cover import repair_collection_cover_url
        return repair_collection_cover_url()



class DriversMultiplexer(repository.objects.DriversMultiplexerMixin, object):

    def __init__(self):
        pass

    def bind(self, category, identifier, version, user=None, **kwargs):
        import editstore.objects
        import repo.objects

        repo_driver = repo.objects.drivers.bind(category, identifier, version, user=user, **kwargs)
        if repo_driver.does_exist():
            return repo_driver

        editstore_driver = editstore.objects.drivers.bind(category, identifier, version, user=user, **kwargs)
        if editstore_driver.does_exist():
            return editstore_driver

        return None

    def get(self, category):
        import editstore.objects
        import repo.objects
        return (repo.objects.drivers.get(category), editstore.objects.drivers.get(category))


drivers = DriversMultiplexer()

