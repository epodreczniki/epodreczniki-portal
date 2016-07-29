# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0020_auto_20150812_2048'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collectionstaticformat',
            name='specification_code',
            field=models.CharField(default=b'pdf', help_text=b'format code', max_length=16, choices=[(b'relief', b'relief'), (b'mobile-1920', b'mobile 1920'), (b'mobile-480', b'mobile 480'), (b'epub-color', b'epub color'), (b'mobile-980', b'mobile 980'), (b'pdf', b'pdf'), (b'odt-package', b'odt package'), (b'odt', b'odt'), (b'epub', b'epub'), (b'mobile-1440', b'mobile 1440')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='schoollevel',
            name='ep_class',
            field=models.PositiveSmallIntegerField(null=True),
            preserve_default=True,
        ),
    ]
