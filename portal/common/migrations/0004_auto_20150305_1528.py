# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

def add_access_to_all_objects_in_edition(apps, schema_editor):

    from django.contrib.contenttypes.models import ContentType
    from django.contrib.contenttypes.management import update_all_contenttypes
    from django.contrib.auth.models import Permission
    update_all_contenttypes()

    for model in ('collection', 'module', 'womi'):
        content_type = ContentType.objects.get(model=model, app_label='common')
        perm, created = Permission.objects.get_or_create(content_type=content_type, codename='can_access_all_' + model)
        if created:
            perm.name = u'Can access all %ss in online edition' % model
            perm.save()
            print('created permission: %s' % perm.name)
        else:
            print('permission already exists: %s' % perm.name)

def empty_reverse(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0003_auto_20150302_1705'),
    ]

    operations = [
        migrations.RunPython(add_access_to_all_objects_in_edition, empty_reverse),
    ]
