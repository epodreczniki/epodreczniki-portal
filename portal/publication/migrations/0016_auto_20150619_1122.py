# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0015_remove_publication_delete'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publication',
            name='status',
            field=models.CharField(default=b'i', help_text=b'status type', max_length=1, verbose_name=b'status type', choices=[(b'i', b'initial'), (b'c', b'fetching'), (b'n', b'dependencies'), (b'p', b'processing'), (b'f', b'failed'), (b's', b'success')]),
            preserve_default=True,
        ),
    ]
