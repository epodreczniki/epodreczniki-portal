# coding=utf-8
from __future__ import absolute_import

import repository.utils
from . import volatile_models
from . import keys

from django.conf import settings


class PreviewContentParser(repository.utils.ContentParser):

    lazy_references = True
    import_reuse = False
    models = volatile_models
    subdomain = 'preview'
    cache_imports = True
    parse_volatile_info = True
    keys_root = keys.import_root
    use_transactions = False
    automatically_collect_static_formats = True

    collection_timeout = settings.EPO_PREVIEW_SOURCE_PARSED_CACHE_TIME
    collection_variant_timeout = settings.EPO_PREVIEW_SK_TIMEOUT
    module_timeout = settings.EPO_PREVIEW_SOURCE_PARSED_CACHE_TIME
    womi_timeout = settings.EPO_PREVIEW_WOMI_CACHE_TIME

    creation_logging = 'DUMMY'





