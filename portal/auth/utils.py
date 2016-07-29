import functools
import hashlib
import operator
import pickle
import random
import string
from urllib import urlencode
from uuid import UUID
import time

from auth import keys
from cassandra.cqlengine.query import DoesNotExist
from common.utils import get_subdomain
import django.dispatch
from django.conf import settings
from django.contrib.auth.decorators import login_required, user_passes_test
from django.core.urlresolvers import reverse
from django.shortcuts import redirect, render
from django.utils import importlib
from django.utils.decorators import available_attrs
from django.utils.functional import new_method_proxy, SimpleLazyObject
from django_hosts import reverse_full
from surround.django.basic.templatetags.common_ext import host_url
from surround.django.redis import get_connection
from userapi.models import UserData
from userapi.serializers import UserDataSerializer

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

update_user_signal = django.dispatch.Signal(['user'])


def not_available_resource(request, *args, **kwargs):
    return render(request, 'not_available_resource.html')


class AuthProfileNotSet(Exception):
    def __init__(self):
        self.value = 'Profile not set in EPO_AUTH_PROFILES setting'

    def __str__(self):
        return repr(self.value)


def make_not_available_for_view(func):
    return not_available_resource

def filter_internal_access(func):

    if not settings.SURROUND_RUNNING_ON_PLATFORM:
        return func

    header_name = settings.EPO_AUTH_INTERNAL_ACCESS_HEADER

    @functools.wraps(func)
    def wrapper(request, *args, **kwargs):
        if request.META.get(header_name) != '1':
            return not_available_resource(request, *args, **kwargs)

        return func(request, *args, **kwargs)

    return wrapper


# tough and tricky patch - may produce errors?
def repair_redirect(view_func):
    @functools.wraps(view_func, assigned=available_attrs(view_func))
    def _wrapped_view(request, *args, **kwargs):
        path = request.get_full_path()
        subdomain = get_subdomain(request.get_host())
        if path and subdomain:
            old_b_a_u = request.build_absolute_uri
            def b_a_u(location=None):
                if not location:
                    return '/%s%s' % (subdomain, path)
                return old_b_a_u(location)
            request.build_absolute_uri = b_a_u

        return view_func(request, *args, **kwargs)

    return _wrapped_view


def epo_auth_required(profile='default', has_next=True):
    def _method_wrapper(func):
        selected_profile = settings.EPO_AUTH_PROFILES.get(profile)
        if selected_profile is None:
            def wrapper(request, *args, **kwargs):
                raise AuthProfileNotSet()
            return wrapper

        allowed = selected_profile['allowed']

        if allowed == 'disabled':
            return make_not_available_for_view(func)

        access_authenticator = None
        if 'access_authorizer' in selected_profile:
            try:
                module_name, class_name = selected_profile['access_authorizer'].rsplit(".", 1)
                _module = importlib.import_module(module_name)
                _class = getattr(_module, class_name)
                access_authenticator = _class()
            except:
                warning('problem with access_authorizer configuration in your profile: %s', profile)

        result_func = func
        if selected_profile['need_login']:
            result_func = login_required(result_func, login_url=SimpleLazyObject(lambda: host_url('user', settings.LOGIN_URL)),
                                    redirect_field_name=('next' if has_next else None))
            result_func = repair_redirect(result_func)

        if allowed == 'internal':
            result_func = filter_internal_access(result_func)
        elif allowed == 'all' and access_authenticator is not None:
            result_func = access_authenticator.wrap(result_func)

        return result_func

    return _method_wrapper


def anonymous_required(redirect_view=None, profile=None):
    def _wrapper(func):
        if profile and profile in settings.EPO_AUTH_PROFILES:
            selected_profile = settings.EPO_AUTH_PROFILES[profile]
            if selected_profile['allowed'] == 'disabled':
                return make_not_available_for_view(func)

        def as_view(request, *args, **kwargs):
            if redirect_view:
                redirect_to = reverse(redirect_view)
            else:
                redirect_to = kwargs.get('next', settings.LOGIN_REDIRECT_URL)
            if request.user.is_authenticated():
                return redirect(redirect_to)
            response = func(request, *args, **kwargs)
            return response
        return as_view
    return _wrapper


class ItemLazyObject(SimpleLazyObject):
    # Dictionary methods support
    __getitem__ = new_method_proxy(operator.getitem)
    __setitem__ = new_method_proxy(operator.setitem)
    __delitem__ = new_method_proxy(operator.delitem)


def auth_token_generator(session, user):
    token = hashlib.md5()
    if session:
        token.update(session.session_key)
    if user:
        token.update(str(user.pk))

    return str(token.hexdigest())


class CacheUserProxy(object):
    def __init__(self, user_id):
        self._user_id = user_id

    def get(self):
        key = keys.oidc_user(user_id=self._user_id)
        redis = get_connection()
        user = redis.get(key)
        if user:
            return pickle.loads(user)
        return None

    def set(self, user):
        redis = get_connection()
        key = keys.oidc_user(user_id=self._user_id)
        redis.set(key, pickle.dumps(user))
        redis.expire(key, settings.EPO_GLUU_USER_REDIS_TIMEOUT)

    def delete(self):
        redis = get_connection()
        redis.delete(keys.oidc_user(user_id=self._user_id))


def make_external_login_uri(scheme, provider):
    return '%s:%s' % (
            scheme, reverse_full('user', 'auth.views.epo_external_login', view_kwargs={'provider': provider}))


def randomstr():
    base_chars = string.ascii_letters + string.digits
    return "".join([random.choice(base_chars) for _ in range(12)])


def list_available_providers(scheme):
    return []


def group_required(*group_names):
    """Requires user membership in at least one of the groups passed in."""
    def in_groups(u):
        if u.is_authenticated():
            if bool(u.groups.filter(name__in=group_names)) | u.is_superuser:
                return True
        return False
    return user_passes_test(in_groups)


def get_user_additional_info(user):
    try:
        user_info = UserData.objects.get(user_id=str(user.pk))
    except DoesNotExist:
        user_info = UserData.objects.create(user_id=str(user.pk))

    serializer = UserDataSerializer(user_info)

    return serializer.data


def accept_agreement(userid):
    try:
        user_info = UserData.objects.get(user_id=userid)
    except DoesNotExist:
        user_info = UserData.objects.create(user_id=userid)

    user_info.agreement_accepted = True
    user_info.save()


def update_user_info(user, info):
    from auth.fake_models import OIDCUser
    try:
        avatar_descriptor = UUID(info.get('avatar_descriptor', None))
    except:
        avatar_descriptor = None
    UserData.objects(user_id=str(user.pk)).update(origin=info.get('origin', None),
                                                  school_name=info.get('school_name', None),
                                                  bio=info.get('bio', None),
                                                  account_type=info.get('account_type', 0),
                                                  gender=info.get('gender', 0),
                                                  avatar_descriptor=avatar_descriptor,
                                                  avatar_type=info.get('avatar_type', None))

    user.first_name = info.get('first_name', user.first_name)
    user.last_name = info.get('last_name', user.last_name)
    if isinstance(user, OIDCUser):
        user.username = info.get('username', user.username)
        proxy = CacheUserProxy(str(user.pk))
        proxy.set(user)
    user.save()

    update_user_signal.send(sender=__name__, user=user)


def set_user_ping_temp_cache(response):
    response.set_cookie('temp_cache', time.time(), max_age=settings.EPO_AUTH_USER_PING_COOKIE_MAX_AGE,
                        path=reverse('auth.views.user_ping'),
                        domain=('.user.%s' % settings.TOP_DOMAIN.split(':')[0]))
