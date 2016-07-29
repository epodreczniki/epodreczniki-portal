# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0027_collection_kind'),
    ]

    operations = [
        migrations.AlterField(
            model_name='authorship',
            name='role_type',
            field=models.CharField(max_length=192, verbose_name=b"role's type"),
            preserve_default=True,
        ),
    ]
