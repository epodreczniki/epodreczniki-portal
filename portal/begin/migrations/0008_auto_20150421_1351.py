# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import modelcluster.fields


class Migration(migrations.Migration):

    dependencies = [
        ('wagtaildocs', '0002_initial_data'),
        ('wagtailcore', '0011_page_search_description_max_length'),
        ('begin', '0007_auto_20150416_1122'),
    ]

    operations = [
        migrations.CreateModel(
            name='PromotedItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('link_external', models.URLField(verbose_name=b'External link', blank=True)),
                ('title', models.CharField(default=b'polecane', max_length=255)),
                ('subtitle', models.CharField(max_length=255, blank=True)),
                ('link_document', models.ForeignKey(related_name='+', blank=True, to='wagtaildocs.Document', null=True)),
                ('link_page', models.ForeignKey(related_name='+', blank=True, to='wagtailcore.Page', null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='PromotedLinkSnippet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
            ],
            options={
                'verbose_name': 'Panel polecanych link\xf3w',
                'verbose_name_plural': 'Panel polecanych link\xf3w',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='promoteditem',
            name='snippet',
            field=modelcluster.fields.ParentalKey(related_name='promoted_items', to='begin.PromotedLinkSnippet'),
            preserve_default=True,
        ),
    ]
