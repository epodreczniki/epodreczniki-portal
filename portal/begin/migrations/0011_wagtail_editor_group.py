# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


app_labels = ('begin', 'wagtailadmin', 'wagtailcore', 'wagtaildocs', 'wagtailembeds', 'wagtailforms', 'wagtailimages',
              'wagtailsearch', 'wagtailusers', 'contenttypes', 'taggit')


def _produce_permissions(Permission, labels):
    permissions_to_add = []
    for label in labels:
        permissions_to_add += Permission.objects.filter(content_type__app_label=label)

    return permissions_to_add


def create_editor_group(apps, schema_editor):
    # Get models
    Group = apps.get_model('auth.Group')
    Permission = apps.get_model('auth.Permission')

    permissions_to_add = _produce_permissions(Permission, app_labels)

    wagtail_editor = Group.objects.create(name='Wagtail Editor')

    wagtail_editor.save()

    for permission in permissions_to_add:
        wagtail_editor.permissions.add(permission)

    wagtail_editor.save()


class Migration(migrations.Migration):
    dependencies = [
        ('begin', '0010_auto_20150428_1030'),
    ]

    operations = [
        migrations.RunPython(create_editor_group),
    ]
