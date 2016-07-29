# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0018_auto_20150612_1733'),
    ]

    operations = [
        migrations.AddField(
            model_name='collection',
            name='volume',
            field=models.PositiveSmallIntegerField(default=None, help_text=b'volume number', null=True, verbose_name=b'volume'),
            preserve_default=True,
        ),
    ]
