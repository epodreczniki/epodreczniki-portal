# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


WOMI_TYPES = [
    'graphics',
    'movie',
    'sound',
    'interactive',
    'icon',
]

def migrate_womi_types(apps, schema_editor):

    WomiType = apps.get_model('common', 'WomiType')
    for name in WOMI_TYPES:

        womi_type, created = WomiType.objects.get_or_create(name=name)
        if created:
            print('created WomiType: %s' % name)


def empty_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0029_auto_20160303_1218'),
    ]

    operations = [
        migrations.RunPython(migrate_womi_types, empty_reverse),
    ]
