from django.conf import settings


def debug(request):
    """Returns context variables helpful for debugging."""

    context_extras = {}
    if settings.DEBUG:
        context_extras['debug'] = True

    return context_extras


def sentry(request):
    return {
        'SURROUND_SENTRY_ENABLE': settings.SURROUND_SENTRY_ENABLE,
        'SURROUND_SENTRY_JS_ENABLE': settings.SURROUND_SENTRY_JS_ENABLE,
        'RAVEN_CONFIG': getattr(settings, 'RAVEN_CONFIG', {})
    }
