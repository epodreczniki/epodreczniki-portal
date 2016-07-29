# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def add_new_schoollevels(apps, schema_editor):

    from common.models import SchoolLevel as CurrentSchoolLevel


    SchoolLevel = apps.get_model('common', 'SchoolLevel')

    for md_education_level, _ in CurrentSchoolLevel.TYPES:
        school_level, created = SchoolLevel.objects.get_or_create(md_education_level=md_education_level, ep_class=None)
        if created:
            print('created: %s' % school_level)
        else:
            print('already in place: %s' % school_level)





def empty_reverse(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0021_auto_20150922_1515'),
    ]

    operations = [
        migrations.RunPython(add_new_schoollevels, empty_reverse),
    ]
