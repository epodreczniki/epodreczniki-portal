# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0012_publication_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='publication',
            name='edition_timestamp',
            field=models.DateTimeField(default=None, help_text=b'timestamp of imported edition', null=True, verbose_name=b'imported timestamp', blank=True),
            preserve_default=True,
        ),
    ]
