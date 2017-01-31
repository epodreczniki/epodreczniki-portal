# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def add_kzd_editor_group(apps, schema_editor):
    from django.contrib.auth.models import Group

    try:
        Group.objects.get(name='kzd_editor')
    except Group.DoesNotExist:
        Group.objects.create(name='kzd_editor')


def empty_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):
    dependencies = [
        ('auth', '__first__'),
    ]

    operations = [
        migrations.RunPython(add_kzd_editor_group, empty_reverse),
    ]
