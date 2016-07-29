# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('begin', '0004_auto_20150415_1005'),
    ]

    operations = [
        migrations.AddField(
            model_name='linkitem',
            name='title',
            field=models.CharField(default=b'link', max_length=255),
            preserve_default=True,
        ),
    ]
