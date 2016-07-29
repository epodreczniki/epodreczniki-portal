# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

def add_more_user_roles_in_edition(apps, schema_editor):

    from django.contrib.contenttypes.models import ContentType
    from django.contrib.contenttypes.management import update_all_contenttypes
    from django.contrib.auth.models import Permission
    update_all_contenttypes()

    for permission in ('author', 'editor', 'publisher', 'reviewer'):
        for model in ('collection', 'module', 'womi'):
            content_type = ContentType.objects.get(model=model, app_label='common')
            # model_class = content_type.model_class()
            perm, created = Permission.objects.get_or_create(content_type=content_type, codename='has_%s_for_%s' % (permission, model))
            if created:
                perm.name = u'Has role %s for %s' % (permission, model)
                perm.save()
                print('created permission: %s' % perm.name)
            else:
                print('permission already exists: %s' % perm.name)


def empty_reverse(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_more_user_roles_in_edition, empty_reverse),
    ]
