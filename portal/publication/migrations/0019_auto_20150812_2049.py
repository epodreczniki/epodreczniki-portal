# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0018_auto_20150622_2250'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='publicationorder',
            name='user',
        ),
        migrations.DeleteModel(
            name='PublicationOrder',
        ),
        migrations.AlterField(
            model_name='publication',
            name='last_changed_status',
            field=models.DateTimeField(default=django.utils.timezone.now, help_text=b'last time status was changed', verbose_name=b'status change', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='publication',
            name='last_processed',
            field=models.DateTimeField(help_text=b'last time task on was ran (updated by wrapper)', null=True, verbose_name=b'last processed', blank=True),
            preserve_default=True,
        ),
    ]
