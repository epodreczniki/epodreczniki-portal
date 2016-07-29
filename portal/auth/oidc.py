# coding=utf-8
import base64
import hashlib
import json
import urlparse
import time

from auth.fake_models import OIDCUser
from django.dispatch import receiver
import re
from auth import keys
from auth.utils import CacheUserProxy, make_external_login_uri, update_user_signal, randomstr
from common.endpoint import endpoint_string_pattern
from auth.exceptions import UserCreationException, UserActivationException, UserUpdateException
from cryptography.hazmat.backends import default_backend
from cryptography.x509 import load_pem_x509_certificate
from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.core.cache import cache
import jwt
from jwt import PyJWT, exceptions
import requests
from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())

LOADED_CERTIFICATES = {}

global_jwt_obj = PyJWT()


class OIDCCertLoader(object):
    @classmethod
    def from_settings(cls, kid):
        for jwk in settings.GLUU_CONFIG['jwks']:
            if jwk['kid'] == kid:
                return cls(jwk['x5c'])

        raise OIDCJWKNotFound()

    divide_n = 64

    def __init__(self, base64_string):
        self.base64_string = base64_string[0] if isinstance(base64_string, list) else base64_string
        _hash = hashlib.sha1(self.base64_string).hexdigest()
        if _hash in LOADED_CERTIFICATES:
            self.loaded = LOADED_CERTIFICATES[_hash]
        else:
            cert_str = "-----BEGIN CERTIFICATE-----\n" \
                       "%s" \
                       "\n-----END CERTIFICATE-----" % '\n'.join(
                [self.base64_string[i:i + self.divide_n] for i in range(0, len(self.base64_string), self.divide_n)])
            self.loaded = load_pem_x509_certificate(cert_str, default_backend())
            LOADED_CERTIFICATES[hash] = self.loaded

    def get_public(self):
        return self.loaded.public_key()

    def get_private(self):
        return self.loaded.private_key()


class SessionGrant(object):
    SESSION_GRANT_KEY = 'grant'
    SESSION_USER_INFO = 'userinfo'
    SESSION_OIDC_CODE = 'oidccode'
    SESSION_OIDC_STATE = 'oidcstate'

    def __init__(self, request):
        self.request = request
        self.user = request.user
        self.session = request.session

    def set_grant(self, grant):
        self.session[self.SESSION_GRANT_KEY] = grant
        self.id_token
        self.session[self.SESSION_GRANT_KEY]['put_time'] = time.time()

    def set_code_state(self, code, state):
        self.session[self.SESSION_OIDC_CODE] = code
        self.session[self.SESSION_OIDC_STATE] = state

    def set_userinfo(self, userinfo):
        self.session[self.SESSION_USER_INFO] = userinfo

    @property
    def code(self):
        return self.session[self.SESSION_OIDC_CODE]

    @property
    def state(self):
        return self.session[self.SESSION_OIDC_STATE]

    @property
    def is_oidc(self):
        if self.user and hasattr(self.user, 'oidc'):
            return True
        return False

    @property
    def userinfo(self):
        return self.session.get(self.SESSION_USER_INFO, None)

    @property
    def has_grant(self):
        return self.SESSION_GRANT_KEY in self.session

    @property
    def grant(self):
        return self.session.get(self.SESSION_GRANT_KEY, None)

    @property
    def epoUUID(self):
        tkn = self.id_token
        decoded = jwt.decode(tkn, verify=False)
        return decoded['epoUUID']

    @property
    def is_valid(self):
        """To be used with has_grant method"""
        return self.session[self.SESSION_GRANT_KEY]['put_time'] + \
               self.session[self.SESSION_GRANT_KEY]['expires_in'] > time.time()

    @property
    def refresh_token(self):
        return self.session[self.SESSION_GRANT_KEY]['refresh_token']

    @property
    def id_token(self):
        if settings.AUTH_OIDC_VERIFY_TOKEN_SIGN:
            tkn = self.session[self.SESSION_GRANT_KEY]["id_token"]
            payload, signing_input, header, signature = global_jwt_obj._load(tkn)
            cert_loader = OIDCCertLoader.from_settings(header['kid'])

            # verification
            try:
                jwt.decode(tkn, key=cert_loader.get_public(), options={'verify_aud': False})
            except exceptions.ExpiredSignatureError:
                raise OIDCIDTokenVerificationException()

        return self.session[self.SESSION_GRANT_KEY]["id_token"]

    @property
    def access_token(self):
        return self.session[self.SESSION_GRANT_KEY]["access_token"]

    def refresh(self):
        dsoc = DamnSimpleOIDCClient(self.code, self.state, self.grant)

        grant = dsoc.refresh()

        if grant and 'access_token' in grant:
            self.set_grant(grant)
            return True
        return False

    def create_user(self):
        userinfo = self.userinfo
        if not userinfo:
            raise BrokenUserInfoException
        user = OIDCUser()
        user.id = 0
        user.pk = self.epoUUID
        user.oidc = True

        params = [('username', 'name'), ('first_name', 'given_name'), ('last_name', 'family_name'), ('email', 'email')]
        for p in params:
            if p[1] in userinfo:
                setattr(user, p[0], userinfo[p[1]])

        cup = CacheUserProxy(user.pk)
        cup.set(user)

        return user

    def validate_user(self):
        if isinstance(self.user, AnonymousUser) and self.has_grant:
            try:
                return self.create_user()
            except OIDCIDTokenVerificationException:
                # second verification of prolong token
                if self.refresh():
                    try:
                        return self.create_user()
                    except OIDCIDTokenVerificationException:
                        pass
                return self.request.user
            except BrokenUserInfoException:
                logger.exception('Error with UserInfo.')
                return self.request.user
        return self.request.user


class InsufficientParamsForToken(Exception):
    pass


class ObtainTokenFailed(Exception):
    pass


class ObtainAdminTokenFailed(Exception):
    pass


class OIDCRequestException(Exception):
    pass


class OIDCIDTokenVerificationException(Exception):
    pass


class BrokenUserInfoException(Exception):
    pass


class OIDCJWKNotFound(Exception):
    pass


class OIDCAdmin(object):
    def __init__(self, user, password, client_class):
        self.user = user
        self.password = password
        self.client_class = client_class

    def get_from_cache(self):
        key = keys.oidc_admin_grant(user_id=self.user)
        if key in cache:
            u = cache.get(key)
            return u
        return None

    def initialize_grant(self):
        dsoc = self.client_class()

        if dsoc.authorize(self.user, self.password):
            token = dsoc.token()
            cache.set(keys.oidc_admin_grant(user_id=self.user), token, 3600)
            return token
        else:
            return None

    def access_token(self):
        grant = self.get_from_cache()
        if grant:
            return grant['access_token']
        else:
            grant = self.initialize_grant()
            if grant:
                return grant['access_token']
            else:
                return None


class DamnSimpleOIDCClient(object):
    def __init__(self, code=None, state=None, grant=None):
        self.config = settings.GLUU_CONFIG
        self.code = code
        self.state = state
        self.JSESSIONID = None
        self.grant = grant
        self.provider = 'epo'

        self.admin_client = OIDCAdmin(self.config['superuser']['user'],
                                      self.config['superuser']['password'],
                                      DamnSimpleOIDCClient)

    @staticmethod
    def randomstr():
        return randomstr()

    @staticmethod
    def parse_location(location):
        return urlparse.parse_qs(location)

    def authorize_external(self, code, provider):
        self.code = code
        self.provider = provider

        access_token = self.admin_client.access_token()

        if not access_token:
            raise ObtainAdminTokenFailed()

        payload = {
            'provider': provider,
            'access_token': access_token,
            'code': code,
            'client_id': self.config['external_clients'][provider]['authorization_params']['client_id'],
            'redirect_uri': make_external_login_uri('http' if settings.DEPLOYMENT_TYPE == 'dev' else 'https', provider)
        }

        resp = requests.get(self.config['external_authorization_endpoint'],
                            params=payload,
                            verify=False,
                            allow_redirects=False)

        if resp.status_code == 200:
            self.grant = resp.json()
            return True

        return False

    def authorize(self, user, password):
        headers = {
            'Accept': 'text/plain',
            'Authorization': 'Basic %s' % base64.b64encode((u'%s:%s' % (user, password)).encode('utf-8'))
        }

        payload = {
            'response_type': 'code',
            'state': self.randomstr(),
            'nonce': self.randomstr(),
            'redirect_uri': self.config["app"]["redirect_uri"],
            "client_id": self.config["app"]["client_id"],
            "scope": "openid+profile+email"
        }

        resp = requests.get(self.config['authorization_endpoint'],
                            headers=headers,
                            params=payload,
                            verify=False,
                            allow_redirects=False)

        if resp.status_code == 302:
            params = self.parse_location(resp.headers['location'])
            self.state = params['state']
            self.code = params['code']
            self.JSESSIONID = resp.cookies.get('JSESSIONID')
            return True

        return False


    def token(self):
        if self.grant:
            return self.grant

        if self.JSESSIONID is None or self.code is None or self.state is None:
            raise InsufficientParamsForToken()

        headers = {
            'Authorization': 'Basic %s' % base64.b64encode(
                '%s:%s' % (self.config['app']['client_id'], self.config['app']['client_pass']))
        }

        cookies = {
            'JSESSIONID': self.JSESSIONID
        }

        payload = {
            'grant_type': 'authorization_code',
            'code': self.code,
            'redirect_uri': self.config["app"]["redirect_uri"]
        }

        resp = requests.post(self.config['token_endpoint'],
                             headers=headers,
                             data=payload,
                             cookies=cookies,
                             verify=False,
                             allow_redirects=False)

        if resp.status_code == requests.codes.ok:
            self.grant = resp.json()
            return self.grant
        else:
            raise ObtainTokenFailed

    def userinfo(self):
        resp = requests.post(self.config['userinfo_endpoint'], data={
            'access_token': self.grant['access_token']
        }, verify=False, allow_redirects=False)
        if resp.status_code == requests.codes.ok:
            return resp.json()
        else:
            raise OIDCRequestException()

    def refresh(self):
        headers = {
            'Authorization': 'Basic %s' % base64.b64encode(
                '%s:%s' % (self.config['app']['client_id'], self.config['app']['client_pass']))
        }

        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': self.grant['refresh_token'],
            'redirect_uri': self.config["app"]["redirect_uri"]
        }

        resp = requests.post(self.config['token_endpoint'],
                             headers=headers,
                             data=payload,
                             verify=False,
                             allow_redirects=False)

        if resp.status_code == requests.codes.ok:
            return resp.json()
        else:
            # temporary return just None
            return None
            #raise OIDCRequestException()


class UserRegistrationClient(object):

    def __init__(self, use_secure=False):
        self.use_secure = use_secure
        self.config = settings.GLUU_CONFIG

    def create(self, first_name, last_name, user_password, email):
        endpoint = endpoint_string_pattern('auth-activate-user', True, pattern_subdomain='user')
        resp = requests.post(self.config["registration"]["create"], {
            'firstName': first_name,
            'lastName': last_name,
            'userPassword': user_password,
            'email': email,
            'activationEndpoint': '%s%s' % ('https:' if self.use_secure else 'http:', re.sub(r'/{\w+}', '', endpoint))
        }, verify=False, allow_redirects=False)

        if resp.status_code == 200:
            return
        if resp.status_code == 400:
            raise UserCreationException(u'niepoprawny parametr lub użytkownik już istnieje' +
                                        ': ' + resp.text if resp.text else '')
        if resp.status_code == 500:
            raise UserCreationException(u'wewnętrzny problem systemu')

        raise UserCreationException(u'bliżej nieokreslony błąd podczas tworzenia uzytkownika')

    def activate(self, guid):
        resp = requests.get('%s/%s' % (self.config["registration"]["activate"], guid),
                            verify=False, allow_redirects=False)

        if resp.status_code == 200:
            return
        if resp.status_code == 400:
            raise UserActivationException(u'problem z numerem GUID - nie został znaleziony lub nie jest unikalny')
        if resp.status_code == 403:
            raise UserActivationException(u'czas ważności linka aktywacyjnego upłynął')
        if resp.status_code == 500:
            raise UserActivationException(u'wewnętrzny problem systemu')

        raise UserActivationException(u'bliżej nieokreslony błąd podczas aktywacji')

    def resend_activation_email(self, uid):
        endpoint = endpoint_string_pattern('auth-activate-user', True, pattern_subdomain='user')
        resp = requests.get(self.config["registration"]["activate_renew"], params={
            'uid': uid,
            'activationEndpoint': '%s%s' % ('https:' if self.use_secure else 'http:', re.sub(r'/{\w+}', '', endpoint))
        }, verify=False, allow_redirects=False)

        if resp.status_code == 200:
            return
        if resp.status_code == 400 or resp.status_code == 404:
            raise UserCreationException(u'niepoprawny parametr lub nie ma takiego użytkownika' +
                                        (': ' + resp.text if resp.text else ''))
        if resp.status_code == 500:
            raise UserCreationException(u'wewnętrzny problem systemu')

        raise UserCreationException(u'bliżej nieokreslony błąd podczas wysyłania e-maila aktywacyjnego')

    def exists(self, uid):
        pass

    def update(self, uid, username, first_name, last_name, email):
        resp = requests.put(self.config["registration"]["update"],
                            {
                                'user': json.dumps({
                                    'uid': uid,
                                    'name': username,
                                    'given_name': first_name,
                                    'family_name': last_name,
                                    'email': email
                                })
                            }, verify=False, allow_redirects=False)

        if resp.status_code == 200:
            return
        if resp.status_code == 400:
            raise UserUpdateException(u'niepoprawny parametr lub uid niejednoznaczny' +
                                      ': ' + resp.text if resp.text else '')
        if resp.status_code == 500:
            raise UserUpdateException(u'wewnętrzny problem systemu')

        raise UserUpdateException(u'bliżej nieokreslony błąd podczas aktualizacji użytkownika')

    def send_password_reset_email(self, uid_email):
        endpoint = endpoint_string_pattern('auth-user-password-reset-form', True, pattern_subdomain='user')
        resp = requests.post(self.config['registration']['password_reset'],
                             {
                                 'uid': uid_email,
                                 'resetEndpoint': '%s%s' % (
                                     'https:' if self.use_secure else 'http:', re.sub(r'/{\w+}', '', endpoint))
                             }, verify=False, allow_redirects=False)

        if resp.status_code == 200:
            return
        if resp.status_code == 400:
            raise UserUpdateException(u'niepoprawny parametr lub adres e-mail jest niejednoznaczny' +
                                      (': ' + resp.text if resp.text else ''))
        if resp.status_code == 404:
            raise UserUpdateException(u'nie ma takiego użytkownika')
        if resp.status_code == 500:
            raise UserUpdateException(u'wewnętrzny problem systemu')

        raise UserUpdateException(u'bliżej nieokreslony błąd podczas wysyłania e-maila z linkiem do zmiany hasła')

    def password_reset(self, guid, password):
        resp = requests.put(self.config['registration']['password_reset'],
                            {
                                'guid': guid,
                                'password': password
                            }, verify=False, allow_redirects=False)

        if resp.status_code == 200:
            return
        if resp.status_code == 304:
            raise UserUpdateException(u'hasło nie zostało zmienione')
        if resp.status_code == 400:
            raise UserUpdateException(u'niepoprawny parametr lub podane hasło jest złe' +
                                      (': ' + resp.text if resp.text else ''))
        if resp.status_code == 403:
            raise UserUpdateException(u'link wygasł')
        if resp.status_code == 500:
            raise UserUpdateException(u'wewnętrzny problem systemu')

        raise UserUpdateException(u'bliżej nieokreslony błąd podczas zmiany hasła')


@receiver(update_user_signal)
def update_user(sender, user, **kwargs):
    if isinstance(user, OIDCUser):
        urc = UserRegistrationClient()
        urc.update(user.email, user.username, user.first_name, user.last_name, user.email)
