# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0023_auto_20151028_1313'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collectionstaticformat',
            name='specification_code',
            field=models.CharField(default=b'pdf', help_text=b'format code', max_length=16, choices=[(b'mobile-480', b'mobile 480'), (b'odt', b'odt'), (b'epub-color', b'epub color'), (b'offline-ee', b'offline ee'), (b'epub', b'epub'), (b'odt-package', b'odt package'), (b'mobile-980', b'mobile 980'), (b'mobile-1440', b'mobile 1440'), (b'relief', b'relief'), (b'pdf', b'pdf'), (b'mobile-1920', b'mobile 1920')]),
            preserve_default=True,
        ),
    ]
