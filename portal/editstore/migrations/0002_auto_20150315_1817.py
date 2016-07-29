# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

def load_all_objects_into_database(apps, schema_editor):
    print('no more migrating of old storage')

def empty_reverse(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('editstore', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_all_objects_into_database, empty_reverse),
    ]
