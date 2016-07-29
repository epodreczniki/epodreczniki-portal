# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0016_auto_20150619_1122'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='publication',
            name='deep',
        ),
        migrations.RemoveField(
            model_name='publication',
            name='force',
        ),
        migrations.RemoveField(
            model_name='publication',
            name='refresh',
        ),
        migrations.RemoveField(
            model_name='publication',
            name='retry',
        ),
    ]
