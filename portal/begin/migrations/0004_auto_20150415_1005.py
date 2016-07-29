# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import modelcluster.fields


class Migration(migrations.Migration):

    dependencies = [
        ('wagtaildocs', '0002_initial_data'),
        ('wagtailcore', '0011_page_search_description_max_length'),
        ('wagtailimages', '0006_focal_point_key_null_oracle'),
        ('begin', '0003_auto_20150306_1218'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExtraItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sort_order', models.IntegerField(null=True, editable=False, blank=True)),
                ('caption', models.CharField(max_length=255, blank=True)),
                ('extra', models.ForeignKey(related_name='+', blank=True, to='wagtaildocs.Document', null=True)),
            ],
            options={
                'ordering': ['sort_order'],
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='ExtraPage',
            fields=[
                ('page_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='wagtailcore.Page')),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
        migrations.CreateModel(
            name='ExtraSnippet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
                ('lead_image', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, blank=True, to='wagtailimages.Image', null=True)),
            ],
            options={
                'verbose_name': 'Zbi\xf3r extra element\xf3w',
                'verbose_name_plural': 'Zbi\xf3r extra element\xf3w',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='GalleryItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sort_order', models.IntegerField(null=True, editable=False, blank=True)),
                ('caption', models.CharField(max_length=255, blank=True)),
                ('image', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, blank=True, to='wagtailimages.Image', null=True)),
            ],
            options={
                'ordering': ['sort_order'],
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='GalleryPage',
            fields=[
                ('page_ptr', models.OneToOneField(parent_link=True, auto_created=True, primary_key=True, serialize=False, to='wagtailcore.Page')),
            ],
            options={
                'abstract': False,
            },
            bases=('wagtailcore.page',),
        ),
        migrations.CreateModel(
            name='GallerySnippet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
            ],
            options={
                'verbose_name': 'Galerie',
                'verbose_name_plural': 'Galerie',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='HomePageMultimediaItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sort_order', models.IntegerField(null=True, editable=False, blank=True)),
                ('link_external', models.URLField(verbose_name=b'External link', blank=True)),
                ('embed_url', models.URLField(verbose_name=b'Embed URL', blank=True)),
                ('caption', models.CharField(max_length=255, blank=True)),
                ('image', models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, blank=True, to='wagtailimages.Image', null=True)),
                ('link_document', models.ForeignKey(related_name='+', blank=True, to='wagtaildocs.Document', null=True)),
                ('link_page', models.ForeignKey(related_name='+', blank=True, to='wagtailcore.Page', null=True)),
                ('page', modelcluster.fields.ParentalKey(related_name='multimedia_items', to='begin.HomePage')),
            ],
            options={
                'ordering': ['sort_order'],
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='LinkItem',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('link_external', models.URLField(verbose_name=b'External link', blank=True)),
                ('link_document', models.ForeignKey(related_name='+', blank=True, to='wagtaildocs.Document', null=True)),
                ('link_page', models.ForeignKey(related_name='+', blank=True, to='wagtailcore.Page', null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='LinkSnippet',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=255, blank=True)),
            ],
            options={
                'verbose_name': 'Panel link\xf3w',
                'verbose_name_plural': 'Panel link\xf3w',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='linkitem',
            name='snippet',
            field=modelcluster.fields.ParentalKey(related_name='link_items', to='begin.LinkSnippet'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='gallerypage',
            name='gallery',
            field=models.ForeignKey(related_name='page', on_delete=django.db.models.deletion.SET_NULL, blank=True, to='begin.GallerySnippet', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='galleryitem',
            name='snippet',
            field=modelcluster.fields.ParentalKey(related_name='gallery_items', to='begin.GallerySnippet'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='extrapage',
            name='extra',
            field=models.ForeignKey(related_name='page', on_delete=django.db.models.deletion.SET_NULL, blank=True, to='begin.ExtraSnippet', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='extraitem',
            name='snippet',
            field=modelcluster.fields.ParentalKey(related_name='extra_items', to='begin.ExtraSnippet'),
            preserve_default=True,
        ),
    ]
