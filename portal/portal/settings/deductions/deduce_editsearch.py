
# use various Online Edition Search options already defined
if EPO_ENABLE_EDITSEARCH and EPO_EDITSEARCH_HAYSTACK is not None:

    HAYSTACK_CONNECTIONS.update(DEFAULT_HAYSTACK_CONNECTIONS)

    ip = EPO_EDITSEARCH_HAYSTACK['IP']
    port = EPO_EDITSEARCH_HAYSTACK['PORT']

    url = 'http://%s:%s/' % (ip, port)

    if EPO_EDITSEARCH_INDEX_NAME is None:
        EPO_EDITSEARCH_INDEX_NAME = 'eos_%s' % INSTANCE_NAME

    EPO_EDITSEARCH_HAYSTACK_CONNECTIONS = {
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        'IP': ip,
        'PORT': port,
        'URL': url,
        'INDEX_NAME': EPO_EDITSEARCH_INDEX_NAME,
    }

    HAYSTACK_CONNECTIONS.update({ 'editsearch': EPO_EDITSEARCH_HAYSTACK_CONNECTIONS })

    INSTALLED_APPS += (
        'editsearch',
    )
    if not 'haystack' in INSTALLED_APPS:
        INSTALLED_APPS += ( 'haystack', )


