# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.utils.timezone
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('publication', '0009_auto_20150501_1319'),
    ]

    operations = [
        migrations.CreateModel(
            name='PublicationOrder',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('category_short', models.CharField(help_text=b'category', max_length=1, verbose_name=b'category', choices=[(b'w', b'womi'), (b'm', b'module'), (b'c', b'collection')])),
                ('identifier', models.CharField(help_text=b'main identifier', max_length=100, verbose_name=b'identifier')),
                ('version', models.DecimalField(help_text=b'version', verbose_name=b'version', max_digits=6, decimal_places=0)),
                ('created', models.DateTimeField(default=django.utils.timezone.now, help_text=b'created', verbose_name=b'created')),
                ('status', models.SmallIntegerField(default=0, choices=[(0, b'requested'), (1, b'denied'), (2, b'accepted'), (3, b'done')])),
                ('user', models.ForeignKey(related_name='publication_orders', on_delete=django.db.models.deletion.SET_NULL, blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ['created'],
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='publicationorder',
            unique_together=set([('category_short', 'identifier', 'version')]),
        ),
        migrations.AlterField(
            model_name='publication',
            name='status',
            field=models.CharField(default=b'i', help_text=b'status type', max_length=1, verbose_name=b'status type', choices=[(b'i', b'initial'), (b'p', b'processing'), (b'f', b'failed'), (b's', b'success')]),
            preserve_default=True,
        ),
    ]
