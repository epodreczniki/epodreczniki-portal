from functools import wraps
from django.utils import six
import types
import re
from api.utils import content_type_editor, API_VERSION_PATTERN, api_version_decorator, API_CURRENT_VERSION
from django.conf import settings
from surround.django.decorators import legacy_cache_page

from rest_framework.views import APIView


default_cache_page = legacy_cache_page(timeout=settings.DEFAULT_CACHE_TIME)


def default_view(view):
    new_view = default_cache_page(view)

    @wraps(new_view)
    def wrapper(request, *args, **kwargs):
        if request.META.get('HTTP_ACCEPT', None) is None:
            request.META['HTTP_ACCEPT'] = '*/*'
        response = new_view(request, *args, **kwargs)
        if hasattr(response, 'api_content_type') and hasattr(response, 'accepted_media_type'):
            response.accepted_media_type = content_type_editor(
                re.sub(API_VERSION_PATTERN, '', response.accepted_media_type).strip(), response.api_content_type)
        return response

    return wrapper


def default_api_view(version=API_CURRENT_VERSION):
    """The default view decorator for API pages.

    It add GET and HEAD methods filtering to the common default_view decorator.
    """
    return api_view(['GET', 'HEAD'], version)


def api_view(http_method_names, version):
    """
    Decorator that converts a function-based view into an APIView subclass.
    Takes a list of allowed methods for the view as an argument.
    """

    def decorator(func):
        TmpAPIView = type(six.PY3 and 'TmpAPIView' or b'TmpAPIView', (APIView,), {'default_version': version})

        WrappedAPIView = type(
            six.PY3 and 'WrappedAPIView' or b'WrappedAPIView',
            (api_version_decorator(TmpAPIView),),
            {'__doc__': func.__doc__}
        )

        # Note, the above allows us to set the docstring.
        # It is the equivalent of:
        #
        #     class WrappedAPIView(APIView):
        #         pass
        #     WrappedAPIView.__doc__ = func.doc    <--- Not possible to do this

        # api_view applied without (method_names)
        assert not (isinstance(http_method_names, types.FunctionType)), \
            '@api_view missing list of allowed HTTP methods'

        # api_view applied with eg. string instead of list of strings
        assert isinstance(http_method_names, (list, tuple)), \
            '@api_view expected a list of strings, received %s' % type(http_method_names).__name__

        allowed_methods = set(http_method_names) | set(('options',))
        WrappedAPIView.http_method_names = [method.lower() for method in allowed_methods]

        def handler(self, *args, **kwargs):
            return func(*args, **kwargs)

        for method in http_method_names:
            setattr(TmpAPIView, method.lower(), handler)

        WrappedAPIView.__name__ = func.__name__

        WrappedAPIView.renderer_classes = getattr(func, 'renderer_classes',
                                                  APIView.renderer_classes)

        WrappedAPIView.parser_classes = getattr(func, 'parser_classes',
                                                APIView.parser_classes)

        WrappedAPIView.authentication_classes = getattr(func, 'authentication_classes',
                                                        APIView.authentication_classes)

        WrappedAPIView.throttle_classes = getattr(func, 'throttle_classes',
                                                  APIView.throttle_classes)

        WrappedAPIView.permission_classes = getattr(func, 'permission_classes',
                                                    APIView.permission_classes)

        return WrappedAPIView.as_view()

    return decorator
