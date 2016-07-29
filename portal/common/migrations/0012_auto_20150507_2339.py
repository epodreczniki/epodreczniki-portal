# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def delete_old_authorship_data(apps, schema_editor):

    AuthorOrderModule = apps.get_model('common', 'AuthorOrderModule')
    AuthorOrderCollection = apps.get_model('common', 'AuthorOrderCollection')

    for model in (AuthorOrderModule, AuthorOrderCollection):
        model.objects.all().delete()

def empty_reverse(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0011_auto_20150507_2305'),
    ]

    operations = [
        migrations.RunPython(delete_old_authorship_data, empty_reverse),
    ]
