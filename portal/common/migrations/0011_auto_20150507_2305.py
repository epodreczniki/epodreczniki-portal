# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

def migrate_authorship(apps, schema_editor):

    from django.contrib.contenttypes.models import ContentType


    AuthorOrderModule = apps.get_model('common', 'AuthorOrderModule')
    AuthorOrderCollection = apps.get_model('common', 'AuthorOrderCollection')
    Authorship = apps.get_model('common', 'Authorship')

    for old_type, name in ((AuthorOrderModule, 'module'), (AuthorOrderCollection, 'collection')):
        content_type = ContentType.objects.get_for_model(apps.get_model('common', name))
        for author_order in old_type.objects.all():
            authorship = Authorship()

            authorship.authored_content_id = author_order.metadata.id
            authorship.authored_content_type_id = content_type.id
            authorship.author = author_order.author
            authorship.role_type = 'Autorzy'
            authorship.order_number = author_order.order
            authorship.role_number = 1

            #print(u'migrated authorship for %s' % author_order.metadata.md_title)
            # print(u'migrated authorship %s' % authorship)
            authorship.save()



def empty_reverse(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('common', '0010_auto_20150507_2203'),
    ]

    operations = [
        migrations.RunPython(migrate_authorship, empty_reverse),
    ]


