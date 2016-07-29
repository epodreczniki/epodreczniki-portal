# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ContentFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('filename', models.CharField(help_text=b'full file path', max_length=1024)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ContentObject',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('category', models.CharField(max_length=16, choices=[(b'collection', b'collection'), (b'module', b'module'), (b'womi', b'womi')])),
                ('identifier', models.CharField(help_text=b"object's identifier", max_length=64)),
                ('version', models.DecimalField(help_text=b"object's version", max_digits=6, decimal_places=0)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Space',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('identifier', models.CharField(help_text=b'main identifier', unique=True, max_length=32)),
                ('label', models.CharField(help_text=b'label', max_length=100)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserRoleInSpace',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('role', models.CharField(max_length=16, choices=[(b'admin', b'admin'), (b'author', b'author'), (b'reviewer', b'reviewer'), (b'publisher', b'publisher'), (b'editor', b'editor')])),
                ('space', models.ForeignKey(related_name='users', to='editstore.Space')),
                ('user', models.ForeignKey(related_name='spaces', to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterUniqueTogether(
            name='userroleinspace',
            unique_together=set([('space', 'user', 'role')]),
        ),
        migrations.AddField(
            model_name='contentobject',
            name='space',
            field=models.ForeignKey(related_name='content_objects', on_delete=django.db.models.deletion.PROTECT, to='editstore.Space'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='contentobject',
            unique_together=set([('category', 'identifier', 'version')]),
        ),
        migrations.AddField(
            model_name='contentfile',
            name='content_object',
            field=models.ForeignKey(related_name='content_files', to='editstore.ContentObject'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='contentfile',
            unique_together=set([('content_object', 'filename')]),
        ),
    ]
