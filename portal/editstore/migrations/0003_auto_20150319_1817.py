# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('editstore', '0002_auto_20150315_1817'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userroleinspace',
            name='role',
            field=models.CharField(max_length=16, choices=[(b'admin', b'admin'), (b'author', b'autor'), (b'reviewer', b'recenzent'), (b'publisher', b'wydawca'), (b'editor', b'redaktor')]),
            preserve_default=True,
        ),
    ]
