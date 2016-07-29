# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0010_auto_20150501_2241'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publicationorder',
            name='status',
            field=models.SmallIntegerField(default=0, choices=[(0, b'requested'), (1, b'denied'), (2, b'accepted'), (3, b'done'), (4, b'canceled')]),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='publicationorder',
            unique_together=set([]),
        ),
    ]
