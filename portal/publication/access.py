import functools

from auth.utils import not_available_resource


class AccessAuthorizer(object):
    def wrap(self, func):

        @functools.wraps(func)
        def wrapper(request, *args, **kwargs):
            if request.user.is_authenticated():
                if request.user.is_superuser or request.user.is_staff:
                    return func(request, *args, **kwargs)
                return not_available_resource(request, *args, **kwargs)
            else:
                return func(request, *args, **kwargs)

        return wrapper
