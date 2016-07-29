# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0004_auto_20150305_1528'),
    ]

    operations = [
        migrations.AddField(
            model_name='module',
            name='is_auto_generated',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
