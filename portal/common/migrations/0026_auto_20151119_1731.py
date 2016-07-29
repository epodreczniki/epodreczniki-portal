# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0025_auto_20151119_1148'),
    ]

    operations = [
        migrations.AlterIndexTogether(
            name='authorship',
            index_together=set([('authored_content_type', 'authored_content_id')]),
        ),
    ]
