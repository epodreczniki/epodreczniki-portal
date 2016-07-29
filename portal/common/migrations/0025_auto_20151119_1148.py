# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0024_auto_20151117_1237'),
    ]

    operations = [
        migrations.AlterIndexTogether(
            name='womireference',
            index_together=set([('referrer_type', 'referrer_id')]),
        ),
    ]
