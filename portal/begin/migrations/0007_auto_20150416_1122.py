# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import wagtail.wagtailcore.fields
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailimages', '0006_focal_point_key_null_oracle'),
        ('begin', '0006_extraindexpage'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='advert',
            name='page',
        ),
        migrations.RemoveField(
            model_name='advertplacement',
            name='advert',
        ),
        migrations.RemoveField(
            model_name='advertplacement',
            name='page',
        ),
        migrations.DeleteModel(
            name='AdvertPlacement',
        ),
        migrations.DeleteModel(
            name='Advert',
        ),
        migrations.AddField(
            model_name='blogpage',
            name='intro',
            field=wagtail.wagtailcore.fields.RichTextField(default=b'wstep postu'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='extraindexpage',
            name='feed_image',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, blank=True, to='wagtailimages.Image', null=True),
            preserve_default=True,
        ),
    ]
