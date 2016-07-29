# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Riddle',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('num', models.CharField(max_length=6)),
                ('idx', models.IntegerField()),
                ('ans', models.CharField(max_length=5)),
                ('exp', models.DateTimeField()),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
