from django.conf import settings

def get_content_url(subdomain, *suffixes):
    return 'http://%s.%s/content/%s' % (subdomain, settings.TOP_DOMAIN, '/'.join(map(str, suffixes)))

def get_module_occurrence_xml_url(subdomain, collection_id, version, variant, module_id, module_version):
    from common.model_mixins import SOURCE_VARIANT
    if variant == SOURCE_VARIANT:
        return get_module_xml_url(subdomain, module_id, module_version)
    return get_content_url(subdomain, 'collection', collection_id, version, variant, module_id, 'module.xml')

def get_module_xml_url(subdomain, module_id, version):
    return get_content_url(subdomain, 'module', module_id, version, 'module.xml')

def get_auto_module_xml_url(subdomain, collection_id, version, module_id):
    return get_content_url(subdomain, 'collection', collection_id, version, 'student-canon', module_id, 'module.xml')

def get_module_occurrence_html_url(subdomain, collection_id, version, variant, module_id):
    return get_content_url(subdomain, 'collection', collection_id, version, variant, module_id, 'module.html')

def get_collection_universal_xml_url(subdomain, collection_id, version, variant):
    from common.model_mixins import SOURCE_VARIANT
    if variant == SOURCE_VARIANT:
        return get_collection_xml_url(subdomain, collection_id, version)
    return get_collection_variant_xml_url(subdomain, collection_id, version, variant)

def get_collection_xml_url(subdomain, collection_id, version):
    return get_content_url(subdomain, 'collection', collection_id, version, 'collection.xml')

def get_collection_variant_xml_url(subdomain, collection_id, version, variant):
    return get_content_url(subdomain, 'collection', collection_id, version, variant, 'collection.xml')

def get_metadata_xml(subdomain, collection_id, version):
    return get_content_url(subdomain, 'collection', collection_id, version, 'metadata.xml')

def get_womi_file_url(subdomain, womi_id, version, path):
    if subdomain == 'content':
        return get_content_url(subdomain, 'womi', womi_id, path)
    else:
        return get_content_url(subdomain, 'womi', womi_id, version, path)

def get_womi_manifest_url(subdomain, womi_id, version):
    return get_womi_file_url(subdomain, womi_id, version, 'manifest.json')

def get_womi_metadata_url(subdomain, womi_id, version):
    return get_womi_file_url(subdomain, womi_id, version, 'metadata.json')


def get_static_format_url(subdomain, collection_id, version, variant, file):
    return get_content_url(subdomain, 'collection', collection_id, version, variant, file)


