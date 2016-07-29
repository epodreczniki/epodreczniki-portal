# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0004_publication_flow_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publication',
            name='status',
            field=models.CharField(default=b'u', help_text=b'status type', max_length=1, verbose_name=b'status type', choices=[(b'u', b'unknown'), (b'x', b'exists'), (b'p', b'processing'), (b'f', b'failed'), (b's', b'success'), (b'q', b'requested'), (b'm', b'missing')]),
            preserve_default=True,
        ),
    ]
