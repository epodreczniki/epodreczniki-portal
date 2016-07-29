# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0028_auto_20160222_1606'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='author',
            unique_together=set([('kind', 'md_first_name', 'md_surname', 'md_institution', 'md_email', 'md_full_name')]),
        ),
    ]
