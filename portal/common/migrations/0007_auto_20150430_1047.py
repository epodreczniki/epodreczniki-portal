# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0006_auto_20150424_1154'),
    ]

    operations = [
        migrations.AlterField(
            model_name='womireference',
            name='kind',
            field=models.SmallIntegerField(default=0, choices=[(0, b'regular'), (1, b'collection-cover'), (2, b'subcollection-icon'), (3, b'subcollection-panorama'), (4, b'external-work-sheet'), (5, b'external-unbound'), (6, b'play-and-learn-unbound'), (7, b'module-header-unbound'), (8, b'collection-header')]),
            preserve_default=True,
        ),
    ]
