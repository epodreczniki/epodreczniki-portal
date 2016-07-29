# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0015_auto_20150515_2237'),
    ]

    operations = [
        migrations.AddField(
            model_name='collection',
            name='edition_timestamp',
            field=models.DateTimeField(default=None, help_text=b'timestamp of imported edition', null=True, verbose_name=b'imported timestamp', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='module',
            name='edition_timestamp',
            field=models.DateTimeField(default=None, help_text=b'timestamp of imported edition', null=True, verbose_name=b'imported timestamp', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='womi',
            name='edition_timestamp',
            field=models.DateTimeField(default=None, help_text=b'timestamp of imported edition', null=True, verbose_name=b'imported timestamp', blank=True),
            preserve_default=True,
        ),
    ]
