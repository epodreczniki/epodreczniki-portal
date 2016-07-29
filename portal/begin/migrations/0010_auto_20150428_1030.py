# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('begin', '0009_blogpage_include_feed_image'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='linkitem',
            options={'ordering': ['sort_order']},
        ),
        migrations.AlterModelOptions(
            name='promoteditem',
            options={'ordering': ['sort_order']},
        ),
        migrations.AddField(
            model_name='linkitem',
            name='sort_order',
            field=models.IntegerField(null=True, editable=False, blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='promoteditem',
            name='sort_order',
            field=models.IntegerField(null=True, editable=False, blank=True),
            preserve_default=True,
        ),
    ]
