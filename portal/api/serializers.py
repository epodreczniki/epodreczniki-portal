from common.models import Collection, Subject, SchoolLevel, Author, Keyword, Module, CoreCurriculum, \
    Womi, WomiReference, ModuleOccurrence, CollectionStaticFormat
from common import models
from common.utils import mobile_apps_versions
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404
from django_hosts import reverse_full
from front.templatetags.collection_cover import cover_url, cover_thumb_url
import os
from rest_framework import serializers
from rest_framework.compat import is_non_str_iterable
from rest_framework.fields import Field
from rest_framework.relations import PrimaryKeyRelatedField
from common import models
import six
from common import url_providers
from django.utils.functional import cached_property

def __get_related_field(self, model_field, related_model, to_many):
        """
        Creates a default instance of a flat relational field.

        Note that model_field will be `None` for reverse relationships.
        """
        # TODO: filter queryset using:
        # .using(db).complex_filter(self.rel.limit_choices_to)

        kwargs = {
            'queryset': related_model._default_manager,
            'many': to_many
        }

        if model_field.help_text is not None:
            kwargs['help_text'] = model_field.help_text

        if model_field:
            kwargs['required'] = not(model_field.null or model_field.blank)

        return PrimaryKeyRelatedField(**kwargs)


serializers.ModelSerializer.get_related_field = __get_related_field

class AdditionalField(serializers.SerializerMethodField):
    def __init__(self, method_name, additional_serializer=None, help_text=None):
        self.method_name = method_name
        self.additional_serializer = additional_serializer
        super(serializers.SerializerMethodField, self).__init__(method_name, help_text=help_text)

    def field_to_native(self, obj, field_name):
        value = getattr(self.parent, self.method_name)(obj)
        if self.additional_serializer and is_non_str_iterable(value) and not isinstance(value, (dict, six.string_types)):
            return self.additional_serializer(value, many=True).data
        return self.to_native(value)


def additional_field(method_name, type_name, help_text=None, additional_serializer=None):
    new_type = type(type_name, (AdditionalField,), {})

    return new_type(method_name, additional_serializer, help_text=help_text)


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject


class SchoolSerializer(serializers.ModelSerializer):
    pretty_name = additional_field('_pretty_name', 'string', 'pretty name of school')

    def _pretty_name(self, element):
        return element.get_simple_form()

    class Meta:
        model = SchoolLevel


class MobileSchoolSerializer(SchoolSerializer):
    ep_class = additional_field('_mangled_ep_class', 'int', 'mangled ep class')

    def _mangled_ep_class(self, element):
        return 0 if element.ep_class is None else element.ep_class



class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Author

class AuthorshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Authorship
        exclude = ('id',)


class MobileAuthorshipSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()

    def _prepare_author(self, obj):
        return {
            'md_full_name': obj['author']['md_full_name'],
            'role_type': obj['role_type'],
            'order': obj['order_number'],
            'md_institution': obj['author']['md_institution'],
            'md_email': obj['author']['md_email'],
            'kind': ('person' if obj['author']['kind'] == 0 else 'organization')
        }

    def to_native(self, obj):
        serialized = super(MobileAuthorshipSerializer, self).to_native(obj)
        if isinstance(serialized, list):
            return [self._prepare_author(s) for s in serialized]
        else:
            return self._prepare_author(serialized)

    class Meta:
        model = models.Authorship
        exclude = ('id', 'authored_content_type', 'authored_content_id')


class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Keyword
        #exclude = ('id', )
        fields = ('md_name',)


class CoreCurriculumSerializer(serializers.ModelSerializer):
    class Meta:
        #exclude = ('id', )
        model = CoreCurriculum


class CollectionSerializer(serializers.ModelSerializer):
    cover = additional_field('_get_cover', 'string', 'link to the cover')
    cover_thumb = additional_field('_get_cover_thumb', 'string', 'link to the cover thumb')
    link = additional_field('_get_link', 'string', 'full link to this collection')
    formats = additional_field('_get_formats', 'list', 'list of supported export formats of collection (with links)')
    is_dummy = additional_field('_get_dummy', 'boolean', 'tells if this collection is dummy')
    md_authors = additional_field('_get_authors', 'list', 'collection\'s authors')

    force_present_in_api = False

    def _get_authors(self, element):
        return [author.id for author in element.authors()]

    def _get_dummy(self, element):
        return not element.has_any_inside()

    def _get_cover(self, element):
        return cover_url(element)

    def _get_cover_thumb(self, element):
        return cover_thumb_url(element)

    def _get_link(self, element):
        content_id = element.md_content_id
        md_version = element.md_version
        variant = element.variant
        #return reverse_full('www', 'reader.views.reader', view_args=(content_id, md_version, variant))
        return reverse_full('www', 'reader_variant_details', view_args=(content_id, md_version, models.Config.get_first_collection_variant_name_or_404(content_id, md_version)))

    def _get_formats(self, element):
        formats = []

        for static_format in element.static_formats.all():

            if not self.force_present_in_api and not static_format.present_in_api:
                continue

            formats.append({
                'format': static_format.specification.effective_public_name,
                'url': static_format.get_absolute_url(),
                # 'url': reverse('collection-format', args=(
                #     content_id,
                #     int(md_version),
                #     variant,
                #     formats_dict[f].filename,
                # )),
                'size': static_format.uncompressed_size
            })

        return formats

    class Meta:
        model = Collection
        exclude = ('id', 'ep_imports', 'root_collection', 'formats', 'cover', 'cover_thumb',)


class CollectionSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Collection
        exclude = ('root_collection',)


class ModuleSerializer(serializers.ModelSerializer):
    womis = additional_field('_get_womis', 'list', 'womi list')

    def _get_womis(self, element):
        return [reference.womi.womi_id for reference in element.womi_references.all()]

    class Meta:
        model = Module
        exclude = ('id', 'ep_imports',)


class MetadataSerializer(serializers.ModelSerializer):

    md_subject = SubjectSerializer()
    md_school = SchoolSerializer()
    md_authors = additional_field('_get_authors2', 'list', 'collection\'s authors', AuthorSerializer)
    md_keywords = KeywordSerializer()

    def _get_authors2(self, element):
        return element.authors()

    def __init__(self, *args, **kwargs):
        if 'context' in kwargs and 'fields' in kwargs['context'] and len(kwargs['context']['fields']):
            self.Meta = type('Meta', (self.Meta, object,), kwargs['context'])

        super(MetadataSerializer, self).__init__(*args, **kwargs)


class MetadataCollectionSerializer(CollectionSerializer, MetadataSerializer):
    class Meta:
        model = Collection
        lookup_field = 'md_content_id'
        #skip_additional_fields = True
        exclude = ('ep_imports', 'root_collection', )


class MobileCollectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Collection
        lookup_field = 'md_content_id'
        exclude = ('id', 'ep_imports', 'root_collection', 'cover', 'cover_thumb', 'md_keywords', 'ep_dummy')

    formats = additional_field('_get_formats', 'list', 'list of supported export formats of collection (with links)')
    md_authors = additional_field('_get_authors', 'list', 'collection\'s authors')

    md_subject = SubjectSerializer()
    md_school = MobileSchoolSerializer()
    md_authors = additional_field('_authorships', 'list', 'collection\'s authors', MobileAuthorshipSerializer)

    covers = additional_field('get_collection_covers', 'dict', 'collection covers mappings')
    app_version_win8 = additional_field('_app_version_win8', 'string', 'app version for windows 8')
    app_version_android = additional_field('_app_version_android', 'string', 'app version for android')
    app_version_ios = additional_field('_app_version_ios', 'string', 'app version for iOS')
    app_version_wp8 = additional_field('_app_version_wp8', 'string', 'app version for windows phone 8')
    is_dummy = additional_field('_is_dummy', 'bool', '')

    force_present_in_api = True

    def _is_dummy(self, element):
        return False

    @cached_property
    def cached_mobile_apps_versions(self):
        return mobile_apps_versions()

    def _app_version_win8(self, element):
        return self.cached_mobile_apps_versions['app_version_win8']

    def _app_version_wp8(self, element):
        return self.cached_mobile_apps_versions['app_version_wp8']

    def _app_version_ios(self, element):
        return self.cached_mobile_apps_versions['app_version_ios']

    def _app_version_android(self, element):
        return self.cached_mobile_apps_versions['app_version_android']

    def get_collection_covers(self, collection):
        # return []
        womi = collection.cover_womi
        if womi is None:
            return []

        covers = []
        for res in womi.classic_resolutions:
            url = womi.get_image_url('classic', resolution='%d' % res)
            ext = os.path.splitext(url)[1].replace('.', '').upper()
            covers.append({
                "format": "%s-%s" % (ext, res),
                "url": url
            })

        return covers

    def _authorships(self, element):
        return element.authorships.all()

    def _get_formats(self, element):
        formats = []

        for static_format in element.static_formats.all():

            if not self.force_present_in_api and not static_format.present_in_api:
                continue

            formats.append({
                'format': static_format.specification.effective_public_name,
                'url': static_format.get_absolute_url(),
                # 'url': reverse('collection-format', args=(
                #     content_id,
                #     int(md_version),
                #     variant,
                #     formats_dict[f].filename,
                # )),
                'size': static_format.uncompressed_size
            })

        return formats



class MetadataModuleSerializer(MetadataSerializer):
    class Meta:
        model = Module
        lookup_field = 'md_content_id'
        exclude = ('ep_imports', 'id')


class WomiSerializer(serializers.ModelSerializer):

    manifest_url = additional_field('get_manifest_url', 'string', 'manifest url')
    metadata_url = additional_field('get_metadata_url', 'string', 'metadata url')
    referrences_number = additional_field('get_referrences_number', 'int', 'womi referrences number')

    def get_manifest_url(self, womi):
        return womi.manifest_url

    def get_metadata_url(self, womi):
        return womi.metadata_url

    def get_referrences_number(self, womi):
        return womi.referrences_number

    class Meta:
        model = Womi
        lookup_field = 'womi_id'
        exclude = ('id', )


class CoverSerializer(CollectionSerializer):

    covers = additional_field('get_collection_covers', 'dict', 'collection covers mappings')

    def get_collection_covers(self, collection):
        womi = collection.cover_womi
        if womi is not None:
            covers = []
            for res in womi.classic_resolutions:
                url = womi.get_image_url('classic', resolution='%d' % res)
                ext = os.path.splitext(url)[1].replace('.', '').upper()
                covers.append({
                    "format": "%s-%s" % (ext, res),
                    "url": url
                })
            return covers
        else:
            return []

    class Meta:
        model = Collection
        fields = ('covers', )


class FormatSerializer(CollectionSerializer):

    class Meta:
        model = Collection
        fields = ('formats', )

class CollectionAuthorSerializer(CollectionSerializer):

    authors = additional_field('_authorships', 'list', 'collection\'s authors', MobileAuthorshipSerializer)

    def _authorships(self, element):
        for authorship in element.authorships.all():
            yield authorship

    class Meta:
        model = Collection
        fields = ('authors', )
