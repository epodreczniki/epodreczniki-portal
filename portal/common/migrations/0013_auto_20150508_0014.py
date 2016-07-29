# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0012_auto_20150507_2339'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='authorordercollection',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='authorordercollection',
            name='author',
        ),
        migrations.RemoveField(
            model_name='authorordercollection',
            name='metadata',
        ),
        migrations.RemoveField(
            model_name='authorordermodule',
            name='author',
        ),
        migrations.RemoveField(
            model_name='authorordermodule',
            name='metadata',
        ),
        migrations.RemoveField(
            model_name='collection',
            name='md_authors',
        ),
        migrations.DeleteModel(
            name='AuthorOrderCollection',
        ),
        migrations.RemoveField(
            model_name='module',
            name='md_authors',
        ),
        migrations.DeleteModel(
            name='AuthorOrderModule',
        ),
    ]
