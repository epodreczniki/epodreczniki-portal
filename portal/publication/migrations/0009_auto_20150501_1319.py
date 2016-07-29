# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0008_auto_20150430_2111'),
    ]

    operations = [
        migrations.AddField(
            model_name='publication',
            name='deep',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='publication',
            name='delete',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='publication',
            name='force',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='publication',
            name='retry',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
