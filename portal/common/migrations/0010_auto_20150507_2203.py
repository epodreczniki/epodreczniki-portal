# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0001_initial'),
        ('common', '0009_auto_20150505_1838'),
    ]

    operations = [
        migrations.CreateModel(
            name='Authorship',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('authored_content_id', models.PositiveIntegerField(null=True)),
                ('role_type', models.CharField(max_length=64, verbose_name=b"role's type")),
                ('order_number', models.PositiveIntegerField(default=1)),
                ('role_number', models.PositiveIntegerField(default=1)),
                ('author', models.ForeignKey(related_name='authorships', on_delete=django.db.models.deletion.PROTECT, to='common.Author')),
                ('authored_content_type', models.ForeignKey(to='contenttypes.ContentType', null=True)),
            ],
            options={
                'ordering': ['order_number'],
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='author',
            name='kind',
            field=models.SmallIntegerField(default=0, choices=[(0, b'person'), (1, b'organization')]),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='author',
            name='md_surname',
            field=models.CharField(max_length=256, verbose_name=b'surname', blank=True),
            preserve_default=True,
        ),
    ]
