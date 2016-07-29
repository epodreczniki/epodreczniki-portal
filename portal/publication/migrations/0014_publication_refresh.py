# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0013_publication_edition_timestamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='publication',
            name='refresh',
            field=models.BooleanField(default=False),
            preserve_default=True,
        ),
    ]
