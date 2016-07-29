from django.conf import settings


def deployment_type(request):
    context_extras = {}
    context_extras['deployment_type'] = getattr(settings, 'DEPLOYMENT_TYPE', None)
    context_extras['top_domain'] = getattr(settings, 'TOP_DOMAIN', None)
    context_extras['EPO_EDITRES_PRESENT_LABELS'] = getattr(settings, 'EPO_EDITRES_PRESENT_LABELS', None)
    context_extras['EPO_ETX_IFRAME_ACTIVE_DOMAIN'] = getattr(settings, 'EPO_ETX_IFRAME_ACTIVE_DOMAIN', None)
    context_extras['EPO_READER_AUTH_ENABLE'] = getattr(settings, 'EPO_READER_AUTH_ENABLE', False)
    context_extras['SURROUND_EXPERIMENTALS_ENABLED'] = getattr(settings, 'SURROUND_EXPERIMENTALS_ENABLED', False)

    return context_extras
