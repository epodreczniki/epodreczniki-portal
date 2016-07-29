from auth.utils import CacheUserProxy, auth_token_generator
from django.contrib.auth import get_backends
from rest_framework.authentication import SessionAuthentication, get_authorization_header
from rest_framework_jwt.authentication import JSONWebTokenAuthentication


class EpoJSONWebTokenAuthentication(JSONWebTokenAuthentication):
    def authenticate_credentials(self, payload):
        """
        Returns an active user that matches the payload's user id and email.
        """
        for backend in get_backends():
            try:
                user = backend.get_user(str(payload['user_id']))
                if user:
                    return user
            except ValueError:
                #this backend does not accept string ids, let's check another
                continue

        return None


class EpoAuthTokenAuthentication(SessionAuthentication):
    www_authenticate_realm = 'api'

    def authenticate(self, request):
        base = super(EpoAuthTokenAuthentication, self).authenticate(request)

        if base is None:
            return None

        tkn = get_authorization_header(request)

        token_name, token = tkn.split(' ')

        if token_name != 'EPOTKN':
            return None

        should_be_token = auth_token_generator(request._request.session, base[0])
        if token != should_be_token:
            return None
        else:
            base = (base[0], token)
        return base

    #do not use csrf protect mechanism
    def enforce_csrf(self, request):
        return

    def authenticate_header(self, request):

        return 'EPOTKN realm="{0}"'.format(self.www_authenticate_realm)