# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0006_remove_publication_task'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publication',
            name='last_exception',
            field=models.TextField(help_text=b'last exception', null=True, verbose_name=b'last exception triggered on this task', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='publication',
            name='last_function',
            field=models.CharField(help_text=b'last function', max_length=100, null=True, verbose_name=b'last function triggered on this task', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='publication',
            name='last_processed',
            field=models.DateTimeField(help_text=b'last processed', null=True, verbose_name=b'last tasked on was ran (updated by wrapper)', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='publication',
            name='status',
            field=models.CharField(default=b'p', help_text=b'status type', max_length=1, verbose_name=b'status type', choices=[(b'u', b'unknown'), (b'x', b'exists'), (b'p', b'processing'), (b'f', b'failed'), (b's', b'success'), (b'q', b'requested'), (b'm', b'missing')]),
            preserve_default=True,
        ),
    ]
