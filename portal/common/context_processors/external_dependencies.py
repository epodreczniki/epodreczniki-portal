from django.conf import settings


def engines(request):
    context_extras = {'EXTERNAL_ENGINES': settings.EXTERNAL_ENGINES,
                      'LICENSE_LIST': settings.LICENSE_LIST}
    return context_extras
