# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publication',
            name='last_modified',
            field=models.DateTimeField(default=datetime.datetime(2015, 4, 1, 15, 17, 55, 612829), auto_now=True, help_text=b'last modified', verbose_name=b'last modified'),
            preserve_default=True,
        ),
    ]
