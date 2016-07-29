from api.serializers import SubjectSerializer, additional_field
from common import models
from common.models import Collection, Module
from common.models_cache import cache_filtered_query, module_in_handbook
from django_hosts import reverse_full
from front.templatetags.collection_cover import cover_thumb_url
from rest_framework import serializers
from userapi.utils import conjunctive_query_generator, fields_from_handbook_id, handbook_id_from_collection


RELATED_OBJECT_PREFIX = 'related_object__'


class UserDataSerializer(serializers.Serializer):
    #user_id = serializers.CharField()
    origin = serializers.CharField()
    school_name = serializers.CharField()
    bio = serializers.CharField()
    account_type = serializers.IntegerField()
    gender = serializers.IntegerField()
    avatar_descriptor = serializers.CharField()
    avatar_type = serializers.IntegerField()
    agreement_accepted = serializers.BooleanField()


class RelatedSerializer(serializers.Serializer):
    def _process_data(self, data):
        meta = self.RelatedMeta()

        if isinstance(data, list):
            unique_keys = set([d[meta.join_field] for d in data])
        else:
            unique_keys = {data[meta.join_field]}

        if hasattr(self.RelatedMeta, 'join_query'):
            keys = [meta.join_query(key) for key in unique_keys]
            filtered = cache_filtered_query(model=meta.model, model_name=meta.model.__class__,
                                            query=conjunctive_query_generator(None, keys))
        else:
            filtered = cache_filtered_query(model=meta.model, model_name=meta.model.__class__,
                                            query=conjunctive_query_generator(meta.join_field, unique_keys))

        if hasattr(self.RelatedMeta, 'key_from_model'):
            filtered_map = {meta.key_from_model(filtered_model): filtered_model for filtered_model in filtered}
        else:
            filtered_map = {getattr(filtered_model, meta.join_field): filtered_model for filtered_model in filtered}

        filtered_data = []
        for element in (data if isinstance(data, list) else [data]):
            if meta.join_field in element and element[meta.join_field] in filtered_map:
                model_obj = filtered_map[element[meta.join_field]]
                serialized = meta.model_serializer(model_obj, context=element)
                element[RELATED_OBJECT_PREFIX + model_obj.__class__.__name__] = serialized.data
                filtered_data.append(element)

        if isinstance(data, list) and len(data) != len(filtered_data):
            data[:] = filtered_data

    @property
    def data(self):
        if self._data:
            return self._data

        data = super(RelatedSerializer, self).data

        if self.RelatedMeta and self.context.get('use_related', '') == 'yes':
            if hasattr(self.RelatedMeta, 'model') and hasattr(self.RelatedMeta, 'join_field') and hasattr(
                    self.RelatedMeta, 'model_serializer'):
                self._process_data(data)
            else:
                raise ValueError("RelatedMeta class do not have model attribute")

        return data


class WomiStateSerializer(serializers.Serializer):
    user_id = serializers.CharField()
    womi_id = serializers.CharField()
    bookpart_id = serializers.CharField()
    name = serializers.CharField()
    value = serializers.CharField()
    modify_time = serializers.DateTimeField()


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['md_title']


class SimpleCollectionSerializer(serializers.ModelSerializer):
    md_subject = SubjectSerializer()
    cover_thumb = additional_field('_get_cover_thumb', 'string', 'link to the cover thumb')
    link = additional_field('_get_link', 'string', 'full link to this collection')

    def _get_cover_thumb(self, element):
        return cover_thumb_url(element)

    def _get_link(self, element):
        content_id = element.md_content_id
        md_version = element.md_version
        variant = element.variant
        return reverse_full('www', 'reader_variant_details', view_args=(content_id, md_version, models.Config.get_first_collection_variant_name_or_404(content_id, md_version)))

    class Meta:
        model = Collection
        fields = ['md_title', 'md_subject', 'cover_thumb', 'link']


class CollectionSerializer(serializers.ModelSerializer):
    md_subject = SubjectSerializer()
    class Meta:
        model = Collection
        fields = ['md_title','md_subject']

    class RelatedMeta:
        model_serializer = ModuleSerializer

        model = Module

    def to_native(self, obj):
        module_occurrence_obj = module_in_handbook(obj=obj, identifier=obj.identifier, version=obj.version,
                                                   variant=obj.variant, module_id=(self.context['module_id']))

        native = super(serializers.ModelSerializer, self).to_native(obj)

        meta = self.RelatedMeta()

        native['%sModule' % RELATED_OBJECT_PREFIX] = meta.model_serializer(module_occurrence_obj.module).data

        return native


class NotesRelatedMeta:
    model_serializer = CollectionSerializer

    model = Collection

    join_field = 'handbook_id'

    def join_query(self, field_value):
        return fields_from_handbook_id(field_value)

    def key_from_model(self, coll):
        return handbook_id_from_collection(coll)


class NotesTimelineSerializer(RelatedSerializer):
    note_id = serializers.CharField()
    user_id = serializers.CharField()
    handbook_id = serializers.CharField()
    module_id = serializers.CharField()
    location = serializers.CharField()
    page_id = serializers.CharField()
    subject = serializers.CharField()
    value = serializers.CharField()
    text = serializers.CharField()
    type = serializers.IntegerField()
    accepted = serializers.BooleanField()
    reference_to = serializers.CharField()
    modify_time = serializers.DateTimeField()

    class RelatedMeta(NotesRelatedMeta):
        pass


class NotesSerializer(RelatedSerializer):
    note_id = serializers.CharField()
    user_id = serializers.CharField()
    handbook_id = serializers.CharField()
    module_id = serializers.CharField()
    location = serializers.CharField()
    page_id = serializers.CharField()
    subject = serializers.CharField()
    value = serializers.CharField()
    text = serializers.CharField()
    type = serializers.IntegerField()
    accepted = serializers.BooleanField()
    reference_to = serializers.CharField()
    referenced_by = serializers.CharField()
    modify_time = serializers.DateTimeField()

    class RelatedMeta(NotesRelatedMeta):
        pass


class SimpleCollectionListSerializer(SimpleCollectionSerializer):
    def __init__(self, instance=None, data=None, files=None,
                 context=None, partial=False, many=True,
                 allow_add_remove=False, **kwargs):
        super(SimpleCollectionListSerializer, self).__init__(instance, data, files, context, partial, many,
                                                             allow_add_remove, **kwargs)


class NotesStatsSerializer(serializers.Serializer):
    date = serializers.DateField()
    tasks = serializers.IntegerField()
    collections = SimpleCollectionListSerializer()


class TaskProgressSerializer(serializers.Serializer):
    # user_id = serializers.CharField()
    handbook_id = serializers.CharField()
    module_id = serializers.CharField()
    womi_id = serializers.CharField()
    num_tries = serializers.IntegerField()
    succ_tries = serializers.IntegerField()


class TaskProgressTimelineSerializer(serializers.Serializer):
    # user_id = serializers.CharField()
    handbook_id = serializers.CharField()
    womi_id = serializers.CharField()
    modify_time = serializers.DateTimeField()


class AggregateTasksProgressSerializer(serializers.Serializer):
    # user_id = serializers.CharField()
    handbook_id = serializers.CharField()
    num_tries = serializers.IntegerField()
    succ_tries = serializers.IntegerField()


class AggregateTasksTimelineSerializer(serializers.Serializer):
    # user_id = serializers.CharField()
    handbook_id = serializers.CharField()
    modify_time = serializers.DateTimeField()


class LastViewedCollectionsSerializer(RelatedSerializer):
    # user_id = serializers.CharField()
    handbook_id = serializers.CharField()
    modify_time = serializers.DateTimeField()

    class RelatedMeta:
        model_serializer = SimpleCollectionSerializer

        model = Collection

        join_field = 'handbook_id'

        def join_query(self, field_value):
            return fields_from_handbook_id(field_value)

        def key_from_model(self, coll):
            return handbook_id_from_collection(coll)


class FileStoreSerializer(serializers.Serializer):
    descriptor = serializers.CharField()
    filename = serializers.CharField()
    modify_time = serializers.DateTimeField()


class OpenQuestionSerializer(RelatedSerializer):
    question_id = serializers.CharField()
    user_id = serializers.CharField()
    handbook_id = serializers.CharField()
    module_id = serializers.CharField()
    place = serializers.IntegerField()
    page_id = serializers.CharField()
    problem = serializers.CharField()
    value = serializers.CharField()
    modify_time = serializers.DateTimeField()

    class RelatedMeta(NotesRelatedMeta):
        pass


class UserMyTeacherSerializer(serializers.Serializer):
    level_id = serializers.IntegerField()
    subject_id = serializers.IntegerField()
    email = serializers.CharField()
