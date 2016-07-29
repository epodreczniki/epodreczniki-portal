# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0017_auto_20150619_1155'),
    ]

    operations = [
        migrations.AddField(
            model_name='publication',
            name='last_changed_status',
            field=models.DateTimeField(default=django.utils.timezone.now, auto_now=True, help_text=b'last changed modified', verbose_name=b'last changed modified'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='publication',
            name='status',
            field=models.CharField(default=b'i', help_text=b'status type', max_length=1, verbose_name=b'status type', choices=[(b'i', b'initial'), (b'c', b'fetching'), (b'n', b'dependencies'), (b'p', b'processing'), (b'f', b'failed'), (b's', b'success'), (b'd', b'canceled')]),
            preserve_default=True,
        ),
    ]
