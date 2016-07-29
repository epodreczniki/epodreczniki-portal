from common import keys
from common.models import Collection, Subject
from surround.django.redis import cache_result

CACHE_TIMEOUT = 60 * 60


@cache_result(CACHE_TIMEOUT, keys.subject_handbook_list)
def get_handbook_ids_for_subject(subject_id):
    handbooks = []
    for collection in Collection.objects.all():
        if collection.md_subject is not None and collection.md_subject.id == subject_id:
            handbooks.append('%s:%s:%s' % (collection.identifier, collection.version, collection.variant))

    return handbooks


@cache_result(CACHE_TIMEOUT, keys.handbook_ids)
def all_handbook_ids():
    handbooks = []
    for collection in Collection.objects.all():
        handbooks.append('%s:%s:%s' % (collection.identifier, collection.version, collection.variant))

    return handbooks


@cache_result(CACHE_TIMEOUT, keys.handbooks_map)
def all_handbooks_map():
    handbooks = {}
    for collection in Collection.objects.all():
        handbooks['%s:%s:%s' % (collection.identifier, collection.version, collection.variant)] = collection

    return handbooks


@cache_result(CACHE_TIMEOUT, keys.all_subjects)
def all_subjects():
    return [{'id': s.id, 'name': s.md_name} for s in Subject.objects.all()]


@cache_result(CACHE_TIMEOUT, keys.filter_for_query)
def cache_filtered_query(model, model_name, query):
    return model.objects.filter(query)


@cache_result(CACHE_TIMEOUT, keys.module_from_collection)
def module_in_handbook(obj, identifier, version, variant, module_id):
    return obj.get_module_occurrence_or_404(module_id)