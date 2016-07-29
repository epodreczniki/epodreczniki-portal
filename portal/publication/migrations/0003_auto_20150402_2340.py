# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0002_auto_20150401_1517'),
    ]

    operations = [
        migrations.AddField(
            model_name='publication',
            name='category',
            field=models.CharField(default='w', help_text=b'category', max_length=1, verbose_name=b'category', choices=[(b'w', b'womi'), (b'm', b'module'), (b'c', b'collection')]),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='publication',
            name='created',
            field=models.DateTimeField(default=django.utils.timezone.now, help_text=b'created', verbose_name=b'created'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='publication',
            name='last_exception',
            field=models.TextField(help_text=b'last exception', null=True, verbose_name=b'last exception triggered on this task'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='publication',
            name='last_function',
            field=models.CharField(help_text=b'last function', max_length=100, null=True, verbose_name=b'last function triggered on this task'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='publication',
            name='last_processed',
            field=models.DateTimeField(help_text=b'last processed', null=True, verbose_name=b'last tasked on was ran (updated by wrapper)'),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='publication',
            name='last_modified',
            field=models.DateTimeField(help_text=b'last modified', verbose_name=b'last modified', auto_now=True),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='publication',
            unique_together=set([('category', 'identifier', 'version')]),
        ),
        migrations.RemoveField(
            model_name='publication',
            name='pubtype',
        ),
    ]
