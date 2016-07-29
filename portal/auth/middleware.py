import hashlib
import time

from django.conf import settings
from django.contrib import auth
from django.contrib.auth import load_backend
from django.core.exceptions import ImproperlyConfigured
from django.utils.cache import patch_vary_headers
from django.utils.http import cookie_date
from django.utils.importlib import import_module
from auth.backend import OpenIdUserBackend
from auth.oidc import SessionGrant


def get_domain():
    return '.%s' % settings.TOP_DOMAIN.split(':')[0]


def cookie_name_gen(postfix):
    return '%s_%s_%s' % (settings.SESSION_COOKIE_NAME, hashlib.sha1(postfix).hexdigest(), hashlib.sha1(get_domain()).hexdigest())


class EpoSessionMiddleware(object):
    def process_request(self, request):
        engine = import_module(settings.SESSION_ENGINE)
        paths = getattr(settings, 'EPO_SESSION_ACCESS_PATHS', [])
        session_key = request.COOKIES.get(settings.SESSION_COOKIE_NAME, None)
        for p in paths:
            name = cookie_name_gen(p)
            if name in request.COOKIES:
                session_key = request.COOKIES.get(name)

        request.session = engine.SessionStore(session_key)

    def process_response(self, request, response):
        """
        If request.session was modified, or if the configuration is to save the
        session every time, save the changes and set a session cookie.
        """
        try:
            accessed = request.session.accessed
            modified = request.session.modified
        except AttributeError:
            pass
        else:
            if accessed:
                patch_vary_headers(response, ('Cookie',))
            if modified or settings.SESSION_SAVE_EVERY_REQUEST:
                if request.session.get_expire_at_browser_close():
                    max_age = None
                    expires = None
                else:
                    max_age = request.session.get_expiry_age()
                    expires_time = time.time() + max_age
                    expires = cookie_date(expires_time)
                # Save the session data and refresh the client cookie.
                # Skip session save for 500 responses, refs #3881.
                if response.status_code != 500:
                    request.session.save()
                    paths = getattr(settings, 'EPO_SESSION_ACCESS_PATHS', [settings.SESSION_COOKIE_PATH])
                    for p in paths:
                        response.set_cookie(cookie_name_gen(p) if p != settings.SESSION_COOKIE_PATH else p,
                                            request.session.session_key, max_age=max_age,
                                            expires=expires, domain=get_domain(),
                                            path=p,
                                            secure=settings.SESSION_COOKIE_SECURE or None,
                                            httponly=settings.SESSION_COOKIE_HTTPONLY or None)
        return response


class OpenIdMiddleware(object):
    """
    Middleware for utilizing OpenId authentication.
    If request.user is not authenticated, then this middleware attempts to
    authenticate the username with OpenId connect.
    If authentication is successful, the user is automatically logged in to
    persist the user in the session.
    """

    def process_request(self, request):
        # AuthenticationMiddleware is required so that request.user exists.
        if not hasattr(request, 'user'):
            raise ImproperlyConfigured(
                "The Django remote user auth middleware requires the"
                " authentication middleware to be installed.  Edit your"
                " MIDDLEWARE_CLASSES setting to insert"
                " 'django.contrib.auth.middleware.AuthenticationMiddleware'"
                " before the OpenIdUserMiddleware class.")

        sg = SessionGrant(request)

        # checks if user is anonymous and session handle grant, so if true, loads temp user into cache
        request.user = sg.validate_user()

        if request.user.is_authenticated() and sg.is_oidc and sg.has_grant and not sg.is_valid:
            if not sg.refresh():
                try:
                    stored_backend = load_backend(request.session.get(
                        auth.BACKEND_SESSION_KEY, ''))
                    if isinstance(stored_backend, OpenIdUserBackend):
                        auth.logout(request)
                except ImproperlyConfigured as e:
                    # backend failed to load
                    auth.logout(request)
                return
            else:
                pass#print 'token refreshed'

        if request.user.is_authenticated():
            return

        # user = auth.authenticate(session_grant=sg, request=request)
        # if user:
        #     # User is valid.  Set request.user and persist user in the session
        #     # by logging the user in.
        #     request.user = user
        #     auth.login(request, user)