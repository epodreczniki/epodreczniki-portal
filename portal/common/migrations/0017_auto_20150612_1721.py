# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0016_auto_20150609_1348'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='subject',
            options={'ordering': ['ordering']},
        ),
        migrations.AddField(
            model_name='subject',
            name='ordering',
            field=models.PositiveSmallIntegerField(default=0),
            preserve_default=True,
        ),
    ]
