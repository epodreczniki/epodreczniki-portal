from auth.fake_models import OIDCUser
from auth.oidc import DamnSimpleOIDCClient, SessionGrant
from auth.utils import CacheUserProxy
from django.contrib.auth.backends import RemoteUserBackend
from django.contrib.auth.signals import user_logged_out

from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())


class OpenIdUserBackend(RemoteUserBackend):
    """
    This backend is to be used in conjunction with the ``OpenIdUserMiddleware``
    found in the middleware module of this package, and is used when the server
    is handling authentication outside of Django.

    """

    def authenticate(self, **credentials):
        """
        Authenticate with credentials into OIDC and save token in session
        """
        if 'request' not in credentials:
            return None

        request = credentials['request']

        dsoc = DamnSimpleOIDCClient()

        if 'code' in credentials and 'provider' in credentials:
            if not dsoc.authorize_external(credentials['code'], credentials['provider']):
                return None
        else:
            if not dsoc.authorize(credentials['username'], credentials['password']):
                return None

        session_grant = SessionGrant(request)

        token = dsoc.token()

        userinfo = dsoc.userinfo()
        #save session before update in case of problem with oracle when handling long data
        request.session.save()

        session_grant.set_grant(token)
        session_grant.set_code_state(dsoc.code, dsoc.state)
        session_grant.set_userinfo(userinfo)

        user = session_grant.create_user()

        return user

    def clean_username(self, username):
        """
        Performs any cleaning on the "username" prior to using it to get or
        create the user object.  Returns the cleaned username.
        By default, returns the username unchanged.
        """
        return username

    def configure_user(self, user):
        """
        Configures a user after creation and returns the updated user.
        By default, returns the user unmodified.
        """
        return user

    def get_user(self, user_id):
        return CacheUserProxy(user_id).get()


def logged_out_signal(sender, request, user, **kwargs):
    if sender == OIDCUser.__class__:
        cup = CacheUserProxy(user.pk)
        cup.delete()


user_logged_out.connect(logged_out_signal)