# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('begin', '0008_auto_20150421_1351'),
    ]

    operations = [
        migrations.AddField(
            model_name='blogpage',
            name='include_feed_image',
            field=models.BooleanField(default=True),
            preserve_default=True,
        ),
    ]
