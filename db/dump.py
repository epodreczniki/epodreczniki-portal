#!/usr/bin/env python
# -*- coding: utf-8 -*-

# This file has been automatically generated.
# Instead of changing it, create a file called import_helper.py
# which this script has hooks to.
#
# On that file, don't forget to add the necessary Django imports
# and take a look at how locate_object() and save_or_locate()
# are implemented here and expected to behave.
#
# This file was generated with the following command:
# ./manage.py dumpdb
#
# to restore it, run
# manage.py runscript module_name.this_script_name
#
# example: if manage.py is at ./manage.py
# and the script is at ./some_folder/some_script.py
# you must make sure ./some_folder/__init__.py exists
# and run  ./manage.py runscript some_folder.some_script


IMPORT_HELPER_AVAILABLE = False
try:
    import import_helper
    IMPORT_HELPER_AVAILABLE = True
except ImportError:
    pass

import datetime
from decimal import Decimal
from django.contrib.contenttypes.models import ContentType

def run():
    #initial imports
    from django.utils.timezone import utc

    def locate_object(original_class, original_pk_name, the_class, pk_name, pk_value, obj_content):
        #You may change this function to do specific lookup for specific objects
        #
        #original_class class of the django orm's object that needs to be located
        #original_pk_name the primary key of original_class
        #the_class      parent class of original_class which contains obj_content
        #pk_name        the primary key of original_class
        #pk_value       value of the primary_key
        #obj_content    content of the object which was not exported.
        #
        #you should use obj_content to locate the object on the target db
        #
        #and example where original_class and the_class are different is
        #when original_class is Farmer and
        #the_class is Person. The table may refer to a Farmer but you will actually
        #need to locate Person in order to instantiate that Farmer
        #
        #example:
        #if the_class == SurveyResultFormat or the_class == SurveyType or the_class == SurveyState:
        #    pk_name="name"
        #    pk_value=obj_content[pk_name]
        #if the_class == StaffGroup:
        #    pk_value=8


        if IMPORT_HELPER_AVAILABLE and hasattr(import_helper, "locate_object"):
            return import_helper.locate_object(original_class, original_pk_name, the_class, pk_name, pk_value, obj_content)

        search_data = { pk_name: pk_value }
        the_obj =the_class.objects.get(**search_data)
        return the_obj

    def save_or_locate(the_obj):
        if IMPORT_HELPER_AVAILABLE and hasattr(import_helper, "save_or_locate"):
            the_obj = import_helper.save_or_locate(the_obj)
        else:
            the_obj.save()
        return the_obj




    #Processing model: User

    from django.contrib.auth.models import User

    try:
        auth_user_1 = User()
        auth_user_1.password = u'pbkdf2_sha256$10000$4eE6qkQpMUWu$mZCQkLDBDWI9c6dG5cKr3k7xd/Zy0djKfjy7pUxbwWs='
        auth_user_1.last_login = datetime.datetime(2013, 12, 4, 16, 6, 48, 420648, tzinfo=utc)
        auth_user_1.is_superuser = True
        auth_user_1.username = u'admin'
        auth_user_1.first_name = u''
        auth_user_1.last_name = u''
        auth_user_1.email = u'admin@aa.pl'
        auth_user_1.is_staff = True
        auth_user_1.is_active = True
        auth_user_1.date_joined = datetime.datetime(2013, 7, 23, 9, 1, 56, 975000, tzinfo=utc)
        print 'importing User: %s' % unicode(auth_user_1)

        auth_user_1.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    #Processing model: TestModel

    from health_check.models import TestModel


    #Processing model: Site

    from django.contrib.sites.models import Site

    try:
        django_site_1 = Site()
        django_site_1.domain = u'alfa.epodreczniki.pl'
        django_site_1.name = u'alfa.epodreczniki.pl'
        print 'importing Site: %s' % unicode(django_site_1)

        django_site_1.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        django_site_2 = Site()
        django_site_2.domain = u'beta.epodreczniki.pl'
        django_site_2.name = u'beta.epodreczniki.pl'
        print 'importing Site: %s' % unicode(django_site_2)

        django_site_2.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        django_site_3 = Site()
        django_site_3.domain = u'epodreczniki.pl'
        django_site_3.name = u'epodreczniki.pl'
        print 'importing Site: %s' % unicode(django_site_3)

        django_site_3.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        django_site_4 = Site()
        django_site_4.domain = u'localhost.epodreczniki.pl:8000'
        django_site_4.name = u'localhost.epodreczniki.pl:8000'
        print 'importing Site: %s' % unicode(django_site_4)

        django_site_4.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        django_site_5 = Site()
        django_site_5.domain = u'test.epodreczniki.pl'
        django_site_5.name = u'test.epodreczniki.pl'
        print 'importing Site: %s' % unicode(django_site_5)

        django_site_5.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    #Processing model: SchoolLevel

    from common.models import SchoolLevel

    try:
        common_schoollevel_1 = SchoolLevel()
        common_schoollevel_1.md_education_level = u'I'
        common_schoollevel_1.ep_class = 1
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_1)

        common_schoollevel_1.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_2 = SchoolLevel()
        common_schoollevel_2.md_education_level = u'I'
        common_schoollevel_2.ep_class = 2
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_2)

        common_schoollevel_2.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_3 = SchoolLevel()
        common_schoollevel_3.md_education_level = u'I'
        common_schoollevel_3.ep_class = 3
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_3)

        common_schoollevel_3.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_4 = SchoolLevel()
        common_schoollevel_4.md_education_level = u'II'
        common_schoollevel_4.ep_class = 4
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_4)

        common_schoollevel_4.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_5 = SchoolLevel()
        common_schoollevel_5.md_education_level = u'II'
        common_schoollevel_5.ep_class = 5
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_5)

        common_schoollevel_5.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_6 = SchoolLevel()
        common_schoollevel_6.md_education_level = u'II'
        common_schoollevel_6.ep_class = 6
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_6)

        common_schoollevel_6.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_7 = SchoolLevel()
        common_schoollevel_7.md_education_level = u'III'
        common_schoollevel_7.ep_class = 1
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_7)

        common_schoollevel_7.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_8 = SchoolLevel()
        common_schoollevel_8.md_education_level = u'III'
        common_schoollevel_8.ep_class = 2
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_8)

        common_schoollevel_8.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_9 = SchoolLevel()
        common_schoollevel_9.md_education_level = u'III'
        common_schoollevel_9.ep_class = 3
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_9)

        common_schoollevel_9.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_10 = SchoolLevel()
        common_schoollevel_10.md_education_level = u'IV'
        common_schoollevel_10.ep_class = 1
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_10)

        common_schoollevel_10.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_11 = SchoolLevel()
        common_schoollevel_11.md_education_level = u'IV'
        common_schoollevel_11.ep_class = 2
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_11)

        common_schoollevel_11.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_12 = SchoolLevel()
        common_schoollevel_12.md_education_level = u'IV'
        common_schoollevel_12.ep_class = 3
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_12)

        common_schoollevel_12.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_schoollevel_13 = SchoolLevel()
        common_schoollevel_13.md_education_level = u'IV'
        common_schoollevel_13.ep_class = 4
        print 'importing SchoolLevel: %s' % unicode(common_schoollevel_13)

        common_schoollevel_13.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    #Processing model: Subject

    from common.models import Subject

    try:
        common_subject_1 = Subject()
        common_subject_1.md_name = u'Matematyka'
        print 'importing Subject: %s' % unicode(common_subject_1)

        common_subject_1.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_2 = Subject()
        common_subject_2.md_name = u'Fizyka'
        print 'importing Subject: %s' % unicode(common_subject_2)

        common_subject_2.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_3 = Subject()
        common_subject_3.md_name = u'Informatyka'
        print 'importing Subject: %s' % unicode(common_subject_3)

        common_subject_3.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_4 = Subject()
        common_subject_4.md_name = u'Zaj\u0119cia komputerowe'
        print 'importing Subject: %s' % unicode(common_subject_4)

        common_subject_4.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_5 = Subject()
        common_subject_5.md_name = u'J\u0119zyk polski'
        print 'importing Subject: %s' % unicode(common_subject_5)

        common_subject_5.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_6 = Subject()
        common_subject_6.md_name = u'Chemia'
        print 'importing Subject: %s' % unicode(common_subject_6)

        common_subject_6.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_7 = Subject()
        common_subject_7.md_name = u'Biologia'
        print 'importing Subject: %s' % unicode(common_subject_7)

        common_subject_7.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_8 = Subject()
        common_subject_8.md_name = u'Geografia'
        print 'importing Subject: %s' % unicode(common_subject_8)

        common_subject_8.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_9 = Subject()
        common_subject_9.md_name = u'Edukacja wczesnoszkolna'
        print 'importing Subject: %s' % unicode(common_subject_9)

        common_subject_9.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_10 = Subject()
        common_subject_10.md_name = u'Historia i spo\u0142ecze\u0144stwo'
        print 'importing Subject: %s' % unicode(common_subject_10)

        common_subject_10.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_11 = Subject()
        common_subject_11.md_name = u'Historia'
        print 'importing Subject: %s' % unicode(common_subject_11)

        common_subject_11.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_12 = Subject()
        common_subject_12.md_name = u'Wiedza o spo\u0142ecze\u0144stwie'
        print 'importing Subject: %s' % unicode(common_subject_12)

        common_subject_12.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_13 = Subject()
        common_subject_13.md_name = u'Przyroda'
        print 'importing Subject: %s' % unicode(common_subject_13)

        common_subject_13.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

    try:
        common_subject_14 = Subject()
        common_subject_14.md_name = u'Edukacja dla bezpiecze\u0144stwa'
        print 'importing Subject: %s' % unicode(common_subject_14)

        common_subject_14.save()

    except Exception as e:
        print 'failed to import: ' + str(e)

