# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

def add_more_user_roles_in_edition(apps, schema_editor):

    from django.contrib.contenttypes.models import ContentType
    from django.contrib.contenttypes.management import update_all_contenttypes
    from django.contrib.auth.models import Permission
    update_all_contenttypes()

    for model in ('collection', 'module', 'womi'):
        content_type = ContentType.objects.get(model=model, app_label='common')
        perm, created = Permission.objects.get_or_create(content_type=content_type, codename='can_edit_online_' + model)
        if created:
            perm.name = u'Can use online edition for %s' % model
            perm.save()
            print('created permission: %s' % perm.name)
        else:
            print('permission already exists: %s' % perm.name)


def empty_reverse(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0002_auto_20150302_1620'),
    ]

    operations = [
        migrations.RunPython(add_more_user_roles_in_edition, empty_reverse),
    ]
