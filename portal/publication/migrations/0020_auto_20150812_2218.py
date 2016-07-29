# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0019_auto_20150812_2049'),
    ]

    operations = [
        migrations.AddField(
            model_name='publication',
            name='aspect',
            field=models.CharField(default='all', help_text=b'aspect', max_length=64, verbose_name=b'aspect'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='publication',
            unique_together=set([('category', 'identifier', 'version', 'aspect')]),
        ),
    ]
