# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0003_auto_20150402_2340'),
    ]

    operations = [
        migrations.AddField(
            model_name='publication',
            name='flow_id',
            field=models.CharField(help_text=b'currently running edition', max_length=32, null=True),
            preserve_default=True,
        ),
    ]
