from django.db.models import Q
import six
from userapi.models import Notes


def explode_bookpart(bookpart):
    return bookpart.split(':')


def make_handbook_id(collection_id, collection_version, collection_variant):
    return ':'.join([collection_id, collection_version, collection_variant])


def get_handbook_id(bookpart):
    exploded = explode_bookpart(bookpart)
    if len(exploded) == 4:
        return ':'.join(exploded[:3])
    elif len(exploded) == 1:
        return exploded[0]
    else:
        return bookpart


def get_module_id(bookpart):
    exploded = explode_bookpart(bookpart)
    if len(exploded) == 4:
        return exploded[3]
    elif len(exploded) == 1:
        return exploded[0]
    else:
        return bookpart


def fields_from_handbook_id(handbook_id):
    split = handbook_id.split(':')
    if len(split) >= 3:
        return {
            'md_content_id': split[0],
            'md_version': split[1],
            'variant': split[2]
        }

    return None


def conjunctive_query_generator(field, keys):
    stmt = Q()
    for key in keys:
        if isinstance(key, six.string_types):
            stmt |= (Q(**{field: key}))
        else:
            stmt |= Q(**key)

    return stmt


def handbook_id_from_collection(collection):
    return make_handbook_id(collection.md_content_id, str(collection.md_version), collection.variant)


def filter_notes(user_id, handbook_ids, note_type=None):
    return Notes.objects.fiter(user_id=user_id, handbook_id=handbook_ids)