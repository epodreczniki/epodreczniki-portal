# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import common.model_mixins
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attribute',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.TextField(help_text=b"attribute's value")),
                ('name', models.CharField(help_text=b"attribute's name", max_length=32)),
                ('present_in_toc', models.BooleanField(default=False, help_text=b'whether to present value in table of contents')),
                ('attribute_owner_id', models.PositiveIntegerField(null=True)),
                ('attribute_owner_type', models.ForeignKey(to='contenttypes.ContentType', null=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('md_first_name', models.CharField(max_length=256, verbose_name=b'first name')),
                ('md_surname', models.CharField(max_length=256, verbose_name=b'surname')),
                ('md_institution', models.CharField(max_length=256, verbose_name=b'institution', blank=True)),
                ('md_email', models.EmailField(max_length=75, verbose_name=b'email')),
                ('md_full_name', models.CharField(max_length=512, verbose_name=b'full name')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AuthorOrderCollection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('order', models.PositiveIntegerField(default=1)),
                ('author', models.ForeignKey(related_name='author_order_collection', on_delete=django.db.models.deletion.PROTECT, to='common.Author')),
            ],
            options={
                'ordering': ['order'],
                'verbose_name': 'collection authorship',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='AuthorOrderModule',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('order', models.PositiveIntegerField(default=1)),
                ('author', models.ForeignKey(related_name='author_order_module', on_delete=django.db.models.deletion.PROTECT, to='common.Author')),
            ],
            options={
                'ordering': ['order'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('md_content_id', models.CharField(help_text=b'main identifier', max_length=100, verbose_name=b'content id')),
                ('md_title', models.CharField(help_text=b'title of collection/module', max_length=256, verbose_name=b'title')),
                ('md_abstract', models.TextField(help_text=b'abstract of collection/module', null=True, verbose_name=b'abstract', blank=True)),
                ('md_published', models.BooleanField(default=False, help_text=b'tells if collection/module is published for public', verbose_name=b'published')),
                ('md_version', models.DecimalField(help_text=b'version of collection/module', verbose_name=b'version', max_digits=6, decimal_places=0)),
                ('ep_version', models.DecimalField(help_text=b'version of epXML schema', verbose_name=b'schema version', max_digits=6, decimal_places=1)),
                ('md_language', models.CharField(default=b'pl', help_text=b'language of collection/module', max_length=256, verbose_name=b'language', choices=[(b'pl', b'polski'), (b'en', b'english')])),
                ('md_license', models.CharField(help_text=b'link or short description of collection/module license', max_length=256, verbose_name=b'license')),
                ('md_created', models.DateTimeField(help_text=b'date of creation', verbose_name=b'created')),
                ('md_revised', models.DateTimeField(help_text=b'date of last touch', verbose_name=b'revised')),
                ('ep_imports', models.CharField(default=b'mathjax;qml;pl_generator;pl_interactive', max_length=1024)),
                ('ep_recipient', models.CharField(help_text=b'kind of recipient of this collection/module', max_length=256, blank=True)),
                ('ep_content_status', models.CharField(help_text=b'content status of collection/module', max_length=256, blank=True)),
                ('ep_testing_content', models.BooleanField(default=True, help_text=b'tells if collection/nodule is a testing content, and should be marked as such')),
                ('md_subtitle', models.CharField(help_text=b'subtitle of this collection', max_length=1024, null=True, verbose_name=b'subtitle', blank=True)),
                ('md_institution', models.CharField(help_text=b"collection's institution", max_length=128, null=True, verbose_name=b'institution', blank=True)),
                ('ep_cover_type', models.CharField(default=None, choices=[(b'svg', b'svg'), (b'jpg', b'jpg'), (b'png', b'png')], max_length=4, blank=True, help_text=b'extension of cover image', null=True, verbose_name=b'cover type')),
                ('ep_stylesheet', models.CharField(default=b'standard', max_length=64, blank=True, help_text=b"collection's stylesheet name", null=True, verbose_name=b'stylesheet')),
                ('ep_signature', models.CharField(help_text=b"collection's signature", max_length=64, verbose_name=b'signature', blank=True)),
                ('variant', models.CharField(help_text=b"collection's variant", max_length=32, verbose_name=b'variant')),
                ('ep_environment_type', models.CharField(default=b'normal', help_text=b"collection's environment type", max_length=32, verbose_name=b'environment type')),
                ('md_authors', models.ManyToManyField(help_text=b'list of Author objects<term>', to='common.Author', through='common.AuthorOrderCollection')),
            ],
            options={
            },
            bases=(models.Model, common.model_mixins.CollectionMixin),
        ),
        migrations.CreateModel(
            name='CollectionStaticFormat',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('specification_code', models.CharField(default=b'pdf', help_text=b'format code', max_length=16, choices=[(b'relief', b'relief'), (b'mobile-1920', b'mobile 1920'), (b'mobile-480', b'mobile 480'), (b'epub-color', b'epub color'), (b'mobile-980', b'mobile 980'), (b'pdf', b'pdf'), (b'odt-package', b'odt package'), (b'odt', b'odt'), (b'epub', b'epub'), (b'mobile-1440', b'mobile 1440')])),
                ('uncompressed_size', models.IntegerField(default=None, help_text=b'the real size of uncompressed file', null=True, blank=True)),
                ('present_in_interface', models.BooleanField(default=True)),
                ('present_in_api', models.BooleanField(default=True)),
                ('last_changed', models.DateTimeField(default=b'1970-01-01T00:00:00.000+0000', help_text=b'date of last change', verbose_name=b'last changed')),
                ('collection', models.ForeignKey(related_name='static_formats', to='common.Collection')),
            ],
            options={
            },
            bases=(models.Model, common.model_mixins.CollectionStaticFormatMixin),
        ),
        migrations.CreateModel(
            name='CoreCurriculum',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('md_education_level', models.CharField(help_text=b'education level', max_length=4)),
                ('ep_core_curriculum_subject', models.CharField(help_text=b'subject', max_length=64)),
                ('ep_core_curriculum_code', models.CharField(help_text=b'core curriculum code', max_length=16)),
                ('ep_core_curriculum_keyword', models.CharField(help_text=b'core curriculum keyword', max_length=1024)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Keyword',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('md_name', models.CharField(max_length=256)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Module',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('md_content_id', models.CharField(help_text=b'main identifier', max_length=100, verbose_name=b'content id')),
                ('md_title', models.CharField(help_text=b'title of collection/module', max_length=256, verbose_name=b'title')),
                ('md_abstract', models.TextField(help_text=b'abstract of collection/module', null=True, verbose_name=b'abstract', blank=True)),
                ('md_published', models.BooleanField(default=False, help_text=b'tells if collection/module is published for public', verbose_name=b'published')),
                ('md_version', models.DecimalField(help_text=b'version of collection/module', verbose_name=b'version', max_digits=6, decimal_places=0)),
                ('ep_version', models.DecimalField(help_text=b'version of epXML schema', verbose_name=b'schema version', max_digits=6, decimal_places=1)),
                ('md_language', models.CharField(default=b'pl', help_text=b'language of collection/module', max_length=256, verbose_name=b'language', choices=[(b'pl', b'polski'), (b'en', b'english')])),
                ('md_license', models.CharField(help_text=b'link or short description of collection/module license', max_length=256, verbose_name=b'license')),
                ('md_created', models.DateTimeField(help_text=b'date of creation', verbose_name=b'created')),
                ('md_revised', models.DateTimeField(help_text=b'date of last touch', verbose_name=b'revised')),
                ('ep_imports', models.CharField(default=b'mathjax;qml;pl_generator;pl_interactive', max_length=1024)),
                ('ep_recipient', models.CharField(help_text=b'kind of recipient of this collection/module', max_length=256, blank=True)),
                ('ep_content_status', models.CharField(help_text=b'content status of collection/module', max_length=256, blank=True)),
                ('ep_testing_content', models.BooleanField(default=True, help_text=b'tells if collection/nodule is a testing content, and should be marked as such')),
                ('ep_presentation_type', models.CharField(default=None, max_length=32, null=True, help_text=b'the /document/metadata/ep:e-textbook-module/ep:presentation/ep:type field of epxml', blank=True)),
                ('ep_presentation_template', models.CharField(default=None, max_length=32, null=True, help_text=b'the /document/metadata/ep:e-textbook-module/ep:presentation/ep:template field of epxml', blank=True)),
                ('ep_core_curriculum_entries', models.ManyToManyField(help_text=b'list of related core curriculums', to='common.CoreCurriculum', null=True, blank=True)),
                ('md_authors', models.ManyToManyField(help_text=b'list of related Author objects', to='common.Author', through='common.AuthorOrderModule')),
                ('md_keywords', models.ManyToManyField(help_text=b'related list of Keyword objects<term>', to='common.Keyword', verbose_name=b'keywords', blank=True)),
            ],
            options={
            },
            bases=(models.Model, common.model_mixins.ModuleMixin),
        ),
        migrations.CreateModel(
            name='ModuleOccurrence',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('value', models.IntegerField(default=1)),
                ('ep_skip_numbering', models.BooleanField(default=False)),
                ('module', models.ForeignKey(related_name='module_order', on_delete=django.db.models.deletion.PROTECT, to='common.Module')),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, common.model_mixins.ModuleOccurrenceMixin),
        ),
        migrations.CreateModel(
            name='SchoolLevel',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('md_education_level', models.CharField(default=b'I', max_length=256, choices=[(b'I', b'Wczesnoszkolna'), (b'II', b'Podstawowa'), (b'III', b'Gimnazjum'), (b'IV', b'Ponadgimnazjalna')])),
                ('ep_class', models.PositiveSmallIntegerField()),
            ],
            options={
                'ordering': ['md_education_level', 'ep_class'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='SubCollection',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('md_title', models.CharField(max_length=256)),
                ('order_value', models.IntegerField(default=1)),
                ('collection_variant', models.ForeignKey(related_name='subcollections', blank=True, to='common.Collection', null=True)),
                ('parent_collection', models.ForeignKey(related_name='subcollections', blank=True, to='common.SubCollection', null=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(models.Model, common.model_mixins.SubCollectionMixin),
        ),
        migrations.CreateModel(
            name='Subject',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('md_name', models.CharField(max_length=256)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Womi',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('womi_id', models.CharField(help_text=b'main identifier', max_length=32, verbose_name=b'womi id')),
                ('title', models.CharField(default=b'<unknown>', help_text=b'title of womi', max_length=256, verbose_name=b'title')),
                ('version', models.DecimalField(help_text=b'version of womi', verbose_name=b'version', max_digits=6, decimal_places=0)),
            ],
            options={
            },
            bases=(models.Model, common.model_mixins.WomiMixin),
        ),
        migrations.CreateModel(
            name='WomiReference',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('referrer_id', models.PositiveIntegerField(null=True)),
                ('kind', models.SmallIntegerField(default=0, choices=[(0, b'regular reference'), (1, b'collection cover'), (2, b'subcollection icon'), (3, b'subcollection panorama'), (4, b'external work sheet')])),
                ('section_id', models.CharField(help_text=b'section id attribute', max_length=64, null=True, verbose_name=b'section id', blank=True)),
                ('referrer_type', models.ForeignKey(to='contenttypes.ContentType', null=True)),
                ('womi', models.ForeignKey(related_name='womi_references', on_delete=django.db.models.deletion.PROTECT, to='common.Womi')),
            ],
            options={
            },
            bases=(models.Model, common.model_mixins.WomiReferenceMixin),
        ),
        migrations.CreateModel(
            name='WomiType',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(help_text=b'name', max_length=32, verbose_name=b'name', blank=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='womi',
            name='womi_type',
            field=models.ForeignKey(related_name='womis', on_delete=django.db.models.deletion.PROTECT, blank=True, to='common.WomiType', null=True),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='womi',
            unique_together=set([('womi_id',)]),
        ),
        migrations.AddField(
            model_name='moduleoccurrence',
            name='sub_collection',
            field=models.ForeignKey(related_name='module_orders', to='common.SubCollection'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='module',
            name='md_school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, blank=True, to='common.SchoolLevel', help_text=b'related School object', null=True, verbose_name=b'school'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='module',
            name='md_subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, blank=True, to='common.Subject', help_text=b'related Subject object', null=True, verbose_name=b'subject'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='module',
            unique_together=set([('md_content_id', 'md_version')]),
        ),
        migrations.AlterUniqueTogether(
            name='collectionstaticformat',
            unique_together=set([('collection', 'specification_code')]),
        ),
        migrations.AddField(
            model_name='collection',
            name='md_keywords',
            field=models.ManyToManyField(help_text=b'related list of Keyword objects<term>', to='common.Keyword', verbose_name=b'keywords', blank=True),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='collection',
            name='md_school',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, blank=True, to='common.SchoolLevel', help_text=b'related School object', null=True, verbose_name=b'school'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='collection',
            name='md_subject',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, blank=True, to='common.Subject', help_text=b'related Subject object', null=True, verbose_name=b'subject'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='collection',
            name='root_collection',
            field=models.OneToOneField(related_name='owning_collection', to='common.SubCollection'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='collection',
            unique_together=set([('md_content_id', 'md_version', 'variant')]),
        ),
        migrations.AddField(
            model_name='authorordermodule',
            name='metadata',
            field=models.ForeignKey(related_name='md_authors+', to='common.Module'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='authorordercollection',
            name='metadata',
            field=models.ForeignKey(related_name='md_authors+', to='common.Collection'),
            preserve_default=True,
        ),
        migrations.AlterUniqueTogether(
            name='authorordercollection',
            unique_together=set([('metadata', 'order'), ('author', 'metadata')]),
        ),
        migrations.AlterUniqueTogether(
            name='attribute',
            unique_together=set([('name', 'attribute_owner_type', 'attribute_owner_id')]),
        ),
    ]
