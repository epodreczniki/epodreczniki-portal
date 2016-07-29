# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0007_auto_20150430_1047'),
    ]

    operations = [
        migrations.AlterField(
            model_name='womireference',
            name='womi',
            field=models.ForeignKey(related_name='using_womi_references', on_delete=django.db.models.deletion.PROTECT, to='common.Womi'),
            preserve_default=True,
        ),
    ]
