# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.db.models.deletion
import modelcluster.fields


class Migration(migrations.Migration):

    dependencies = [
        ('wagtailimages', '0006_focal_point_key_null_oracle'),
        ('begin', '0012_wagtail_editor_page_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExtraItemGroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sort_order', models.IntegerField(null=True, editable=False, blank=True)),
                ('name', models.CharField(max_length=255)),
                ('snippet', modelcluster.fields.ParentalKey(related_name='extra_item_groups', to='begin.ExtraSnippet')),
            ],
            options={
                'verbose_name': 'Grupa element\xf3w ekstra',
                'verbose_name_plural': 'Grupy element\xf3w ekstra',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='extraitem',
            name='group',
            field=models.ForeignKey(related_name='+', verbose_name=b'Grupa', blank=True, to='begin.ExtraItemGroup', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='extraitem',
            name='image',
            field=models.ForeignKey(related_name='+', verbose_name=b'Miniaturka pliku lub obraz', blank=True, to='wagtailimages.Image', null=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='extraitem',
            name='link_external',
            field=models.URLField(verbose_name=b'Link', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='extraitem',
            name='caption',
            field=models.CharField(max_length=255, verbose_name=b'Podpis', blank=True),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='extraitem',
            name='extra',
            field=models.ForeignKey(related_name='+', on_delete=django.db.models.deletion.SET_NULL, verbose_name=b'Extra plik', blank=True, to='wagtaildocs.Document', null=True),
            preserve_default=True,
        ),
    ]
