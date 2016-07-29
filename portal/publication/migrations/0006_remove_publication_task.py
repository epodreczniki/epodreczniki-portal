# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0005_auto_20150418_1826'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='publication',
            name='task',
        ),
    ]
