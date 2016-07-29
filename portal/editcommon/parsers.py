from __future__ import absolute_import

import repository.utils
from . import keys
from preview import volatile_models

from django.conf import settings

class EditCommonParser(repository.utils.ContentParser):

    lazy_references = True
    import_reuse = False
    models = volatile_models
    subdomain = 'preview'
    keys_root = keys.import_root
    parse_volatile_info = True
    cache_imports = True
    use_transactions = False
    automatically_collect_static_formats = True

    collection_timeout = settings.EPO_EDITSTORE_PARSED_OBJECT_TIMEOUT
    collection_variant_timeout = settings.EPO_EDITSTORE_PARSED_OBJECT_TIMEOUT
    module_timeout = settings.EPO_EDITSTORE_PARSED_OBJECT_TIMEOUT
    womi_timeout = settings.EPO_EDITSTORE_PARSED_OBJECT_TIMEOUT

    creation_logging = 'DUMMY'


