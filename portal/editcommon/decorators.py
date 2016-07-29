from django.utils.cache import patch_cache_control
import functools
from surround.django.decorators import never_cache_headers
from django.shortcuts import render

def must_revalidate_headers(view):

    @functools.wraps(view)
    def wrapper(request, *args, **kwargs):
        response = view(request, *args, **kwargs)
        patch_cache_control(response, no_cache=True, no_store=True)
        return response

    return never_cache_headers(wrapper)

def cascade_forms_actions(view):

    @functools.wraps(view)
    def wrapper(request, *args, **kwargs):

        actions = list(view(request, *args, **kwargs))
        for action in actions:
            action.request = request

        return render(request, 'editres/cascade_actions.html', {
            'actions': actions,
        })

    return wrapper

