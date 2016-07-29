# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0020_auto_20150812_2218'),
    ]

    operations = [
        migrations.CreateModel(
            name='PublicationDependency',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('dependant', models.ForeignKey(related_name='dependencies', to='publication.Publication')),
                ('dependency', models.ForeignKey(related_name='dependants', to='publication.Publication')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
