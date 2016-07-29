# -*- coding: utf-8 -*-
from collections import namedtuple
from rest_framework.test import APIRequestFactory, APIClient, APITestCase
from api.views import *
from django.conf import settings
from api.utils import count_collection_modules

Config = namedtuple('Config', ['COLLECTION_ID', 'VERSION', 'VARIANT', 'AUTHOR_EMAIL', 'FILENAME',
                               'CORE_CURRICULUM_PK', 'MODULE_ID', 'SCHOOL_PK', 'SUBJECT_PK', 'AUTHOR_PK',
                               'MODULE_VERSION', 'WOMI_ID', 'MODULE_CONTENT_FORMAT'])
TEST_PARAMS = Config(
    COLLECTION_ID=1309,
    VERSION=1,
    VARIANT='student-canon',
    AUTHOR_EMAIL='kinga.galazka@p.lodz.pl',
    FILENAME="collection.pdf",
    CORE_CURRICULUM_PK=1,
    MODULE_ID='iQUbNknvwo',
    SCHOOL_PK=1,
    SUBJECT_PK=1,
    AUTHOR_PK=1,
    MODULE_VERSION=1,
    WOMI_ID=669,
    MODULE_CONTENT_FORMAT='xml'
)


class ApiTests(APITestCase):
    fixtures = ['common_fixture.json']
    SERVER_NAME = 'api.%s' % settings.TOP_DOMAIN

    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient(SERVER_NAME=self.SERVER_NAME)

    def test_number_of_authors(self):
        number_of_db_authors = len(Author.objects.all())

        api_url = '/authors/'
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        number_of_api_authors = len(response.data)
        assert number_of_db_authors == number_of_api_authors, 'wrong number of authors: %s and %s' % (
        number_of_db_authors, number_of_api_authors)


    def test_single_author(self):
        author = Author.objects.get(pk=TEST_PARAMS.AUTHOR_PK)

        api_url = '/authors/%d' % TEST_PARAMS.AUTHOR_PK
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        api_dictionary = response.data
        assert author.md_full_name == api_dictionary['md_full_name'], 'wrong author md_full_name %s and %s' % (
        author.md_full_name, api_dictionary['md_full_name'])


    def test_number_of_collections(self):
        number_of_db_collections = len(Collection.objects.all())

        api_url = '/collections/'
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        number_of_api_collections = len(response.data)
        assert number_of_db_collections == number_of_api_collections, 'wrong number of collections: %s and %s' % (
        number_of_db_collections, number_of_api_collections)

        api_url = '/collections/metadata'
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        number_of_api_collections = len(response.data)
        assert number_of_db_collections == number_of_api_collections, 'wrong number of collections metadatas: %s and %s' % (
        number_of_db_collections, number_of_api_collections)

    def test_single_collection(self):
        collection = Collection.objects.get(md_content_id=TEST_PARAMS.COLLECTION_ID)

        api_url = '/collections/%s/%d/%s' % (TEST_PARAMS.COLLECTION_ID, TEST_PARAMS.VERSION, TEST_PARAMS.VARIANT)
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        api_dictionary = response.data
        assert collection.md_content_id == api_dictionary['md_content_id']

    def test_collection_file_format(self):
        api_url = '/collections/%d/%d/%s/%s' % (TEST_PARAMS.COLLECTION_ID, TEST_PARAMS.VERSION, TEST_PARAMS.VARIANT,
                                                TEST_PARAMS.FILENAME)
        response = self.client.get(api_url)
        assert response.status_code == 302, 'wrong status code: %d - no redirection' % response.status_code

    def test_collection_count_api_function(self):
        number_of_db_collections = len(Collection.objects.all())

        api_url = '/collections/count'
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        number_of_api_collections = response.data['count']
        assert number_of_db_collections == number_of_api_collections, 'wrong number of collections: %s and %s' % (
        number_of_db_collections, number_of_api_collections)

    def test_core_curriculum_number(self):
        number_of_db_curriculums = len(CoreCurriculum.objects.all())

        api_url = '/core_curriculums/'
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        number_of_api_curriculums = len(response.data)
        assert number_of_db_curriculums == number_of_api_curriculums, 'wrong number of curriculums: %s and %s' % (
        number_of_db_curriculums, number_of_api_curriculums)

    def test_single_core_curriculum(self):
        curriculum = CoreCurriculum.objects.get(pk=TEST_PARAMS.CORE_CURRICULUM_PK)

        api_url = '/core_curriculums/%s' % TEST_PARAMS.CORE_CURRICULUM_PK
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        api_dictionary = response.data
        assert curriculum.md_education_level == api_dictionary[
            'md_education_level'], 'wrong curriculum education level: %s and %s' % (
        curriculum.md_education_level, api_dictionary['md_education_level'])

    def test_single_module(self):
        module = Module.objects.get(md_content_id=TEST_PARAMS.MODULE_ID)

        api_url = '/modules/%s/%d' % (TEST_PARAMS.MODULE_ID, TEST_PARAMS.MODULE_VERSION)
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        api_dictionary = response.data
        assert module.md_title == api_dictionary['md_title'], 'wrong module title: %s and %s' % (
        module.md_title, api_dictionary['md_title'])

        api_url = '/modules/%s/%d/metadata' % (TEST_PARAMS.MODULE_ID, TEST_PARAMS.MODULE_VERSION)
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        api_dictionary = response.data
        assert module.md_title == api_dictionary['md_title'], 'wrong module md_title: %s and %s' % (
        module.md_title, api_dictionary['md_title'])

    def test_school_number(self):
        number_of_db_schools = len(SchoolLevel.objects.all())

        api_url = '/schools/'
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        number_of_api_schools = len(response.data)
        assert number_of_db_schools == number_of_api_schools, 'wrong number of schools: %s and %s' % (
        number_of_db_schools, number_of_api_schools)

    def test_single_school(self):
        school = SchoolLevel.objects.get(pk=TEST_PARAMS.SCHOOL_PK)

        api_url = '/schools/%s' % TEST_PARAMS.SCHOOL_PK
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        api_dictionary = response.data
        assert school.md_education_level == api_dictionary[
            'md_education_level'], 'wrong school education level: %s and %s' % (
        school.md_education_level, api_dictionary['md_education_level'])
        assert school.ep_class == api_dictionary['ep_class'], 'wrong ep_class: %s and %s' % (
        school.ep_class, api_dictionary['ep_class'])

    def test_subjects_number(self):
        number_of_db_subjects = len(Subject.objects.all())

        api_url = '/subjects/'
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        number_of_api_subjects = len(response.data)
        assert number_of_db_subjects == number_of_api_subjects, 'wrong number of subjects: %s and %s' % (
        number_of_db_subjects, number_of_api_subjects)

    def test_single_subject(self):
        subject = Subject.objects.get(pk=TEST_PARAMS.SUBJECT_PK)

        api_url = '/subjects/%s' % TEST_PARAMS.SUBJECT_PK
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        api_dictionary = response.data
        assert subject.md_name == api_dictionary['md_name'], 'wrong subject md_name: %s and %s' % (
        subject.md_name, api_dictionary['md_name'])

    def test_womis_number(self):
        number_of_db_womis = len(Womi.objects.all())

        api_url = '/womis/'
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        number_of_api_womis = len(response.data)
        assert number_of_db_womis == number_of_api_womis, 'wrong number of subjects: %s and %s' % (
        number_of_db_womis, number_of_api_womis)

    def test_single_womi(self):
        womi = Womi.objects.get(womi_id=TEST_PARAMS.WOMI_ID)

        api_url = '/womis/%s' % TEST_PARAMS.WOMI_ID
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        api_dictionary = response.data
        assert womi.title == api_dictionary['title'], 'wrong subject md_name: %s and %s' % (
        womi.md_name, api_dictionary['title'])

    def test_modules_number(self):
        number_of_db_modules = len(Module.objects.all())

        api_url = '/modules/'
        response = self.client.get(api_url, format='json')
        assert response.status_code == 200, 'wrong status code: %d' % response.status_code

        number_of_api_modules = len(response.data)
        assert number_of_db_modules == number_of_api_modules, 'wrong number of subjects: %s and %s' % (
        number_of_db_modules, number_of_api_modules)

    def test_module_content_format(self):
        api_url = '/modules/%s/%d.%s' % (TEST_PARAMS.MODULE_ID, TEST_PARAMS.MODULE_VERSION,
                                         TEST_PARAMS.MODULE_CONTENT_FORMAT)
        response = self.client.get(api_url)
        assert response.status_code == 302, 'wrong status code: %d - no redirection' % response.status_code

    def test_collection_modules_response(self):
        api_url = '/collections/%s/%d/%s/modules' % (
        TEST_PARAMS.COLLECTION_ID, TEST_PARAMS.VERSION, TEST_PARAMS.VARIANT)

        response = self.client.get(api_url)
        assert response.status_code == 200, 'wrong status code %s' % response.status_code


        collection = Collection.objects.get(md_content_id=TEST_PARAMS.COLLECTION_ID, md_version=TEST_PARAMS.VERSION,
                                            variant=TEST_PARAMS.VARIANT)
        api_modules_number = count_collection_modules(response.data)
        db_modules_number = len(list(collection.get_all_modules()))
        assert db_modules_number == api_modules_number, 'wrong modules inside collection number - %s and %s' % (db_modules_number, api_modules_number)
