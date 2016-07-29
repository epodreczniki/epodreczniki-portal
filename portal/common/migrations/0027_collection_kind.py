# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0026_auto_20151119_1731'),
    ]

    operations = [
        migrations.AddField(
            model_name='collection',
            name='kind',
            field=models.SmallIntegerField(default=0, help_text=b'the kind of collection', choices=[(0, b'regular'), (1, b'help'), (2, b'extra'), (3, b'experimental')]),
            preserve_default=True,
        ),
    ]
