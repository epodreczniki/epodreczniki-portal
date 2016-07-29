# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Publication',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('identifier', models.CharField(help_text=b'main identifier', max_length=100, verbose_name=b'identifier')),
                ('version', models.DecimalField(help_text=b'version', verbose_name=b'version', max_digits=6, decimal_places=0)),
                ('pubtype', models.CharField(help_text=b'publication type', max_length=1, verbose_name=b'publication type', choices=[(b'w', b'womi'), (b'm', b'module'), (b'c', b'collection')])),
                ('status', models.CharField(help_text=b'status type', max_length=1, null=True, verbose_name=b'status type', choices=[(b'p', b'PROCESSING'), (b'f', b'FAILED'), (b's', b'SUCCESS')])),
                ('task', models.CharField(help_text=b'task identifier', max_length=100, unique=True, null=True, verbose_name=b'task identifier')),
                ('last_modified', models.DateTimeField(default=datetime.datetime(2015, 3, 23, 15, 56, 50, 652985), auto_now=True, help_text=b'last modified', verbose_name=b'last modified')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='publication',
            unique_together=set([('pubtype', 'identifier', 'version')]),
        ),
    ]
