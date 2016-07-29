# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0022_auto_20150922_1517'),
    ]

    operations = [
        migrations.AlterField(
            model_name='collection',
            name='ep_signature',
            field=models.CharField(help_text=b"collection's signature", max_length=2000, verbose_name=b'signature', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='collectionstaticformat',
            name='specification_code',
            field=models.CharField(default=b'pdf', help_text=b'format code', max_length=16, choices=[(b'mobile-1920', b'mobile 1920'), (b'mobile-480', b'mobile 480'), (b'epub-color', b'epub color'), (b'mobile-980', b'mobile 980'), (b'pdf', b'pdf'), (b'odt-package', b'odt package'), (b'odt', b'odt'), (b'relief', b'relief'), (b'epub', b'epub'), (b'mobile-1440', b'mobile 1440')]),
            preserve_default=True,
        ),
    ]
