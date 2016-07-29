from django.conf import settings
import jwt
from rest_framework.exceptions import APIException
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.utils import jwt_decode_handler as old_jwt_decode_handler

class TokenConsistencyException(APIException):
    status_code = 400
    default_detail = 'Token not consist mandatory fields'


class AccessTokenVerificationException(APIException):
    status_code = 406
    default_detail = 'Access token verification failed'


def get_app_secret_key(app=None):
    secret = api_settings.JWT_SECRET_KEY
    if app:
        opts = settings.JWT_CLIENTS.get(app, {})
        secret = opts.get('secret', secret)

    return secret

def jwt_decode_handler(token):
    first_decode = jwt.decode(token, verify=False)
    app = first_decode.get('app', None)
    secret = get_app_secret_key(app)

    return jwt.decode(
        token,
        secret,
        api_settings.JWT_VERIFY,
        verify_expiration=api_settings.JWT_VERIFY_EXPIRATION,
        leeway=api_settings.JWT_LEEWAY,
        audience=api_settings.JWT_AUDIENCE,
        issuer=api_settings.JWT_ISSUER,
        algorithms=[api_settings.JWT_ALGORITHM]
    )


def jwt_encode_handler(payload, app=None):
    secret = get_app_secret_key(app)
    return jwt.encode(
        payload,
        secret,
        api_settings.JWT_ALGORITHM
    ).decode('utf-8')

