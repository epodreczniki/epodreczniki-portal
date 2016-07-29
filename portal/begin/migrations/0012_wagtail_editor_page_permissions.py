# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.exceptions import ObjectDoesNotExist

from django.db import migrations

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


def create_editor_group_permissions(apps, schema_editor):
    # Get models
    Group = apps.get_model('auth.Group')
    Page = apps.get_model('wagtailcore.Page')
    GroupPagePermission = apps.get_model('wagtailcore.GroupPagePermission')

    try:
        root = Page.objects.get(title='Root')
        editor = Group.objects.get(name='Wagtail Editor')

        GroupPagePermission.objects.create(
            group=editor,
            page=root,
            permission_type='add',
        )
        GroupPagePermission.objects.create(
            group=editor,
            page=root,
            permission_type='edit',
        )
        GroupPagePermission.objects.create(
            group=editor,
            page=root,
            permission_type='publish',
        )

    except ObjectDoesNotExist as ex:
        print 'can not fulfil migration, can not find root page or group, error: %s' % ex


class Migration(migrations.Migration):
    dependencies = [
        ('begin', '0011_wagtail_editor_group'),
    ]

    operations = [
        migrations.RunPython(create_editor_group_permissions),
    ]
