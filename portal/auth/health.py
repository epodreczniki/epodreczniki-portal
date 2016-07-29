from __future__ import absolute_import

from surround.django.health.backends import base
import urlparse
import requests
import random
import string

class GluuSimpleTest(object):
    def __init__(self, rootUri=None):
        self.rootUri = rootUri
        self.userCred = 'dXNlcjBAdGVzdC5lcG9kcmVjem5pa2kucGw6cGFzc3dkMA=='
        self.clientId = '@!41CC.6ADB.D1AE.23DE!0001!6A62.476F!0008!82E2.D631'
        self.clientCred = 'QCE0MUNDLjZBREIuRDFBRS4yM0RFITAwMDEhNkE2Mi40NzZGITAwMDghODJFMi5ENjMxOkFOTXVZc09sTl9qVE1Va2Y1RHdHMzlOVUd2azRGODNNdmM='
        self.redirectUri = 'http://epo17.pcss.pl:8666/authz_cb'
        self.logoutRedirectUri = 'http://epo17.pcss.pl:8666/logout'
        self.testUserMail = 'user0@test.epodreczniki.pl'
        self.JSESSIONID = None
        self.auth_code = None
        self.state = None
        self.access_token = None

    @staticmethod
    def randomstr():
        base_chars = string.ascii_letters + string.digits
        return "".join([random.choice(base_chars) for _ in range(12)])

    def getCode(self):
        headers = {'Accept': 'text/plain', 'Authorization': 'Basic ' + self.userCred}
        url = self.rootUri + '/oxauth/seam/resource/restv1/oxauth/authorize'
        values = {'state': self.randomstr(),
                  'nonce': self.randomstr(),
                  'scope': 'openid+profile+email',
                  'redirect_uri': self.redirectUri,
                  'client_id': self.clientId,
                  'response_type': 'code',
                  'grant_type': 'authorization_code'}

        resp = requests.get(url,
                  headers=headers,
                  params=values,
                  verify=False,
                  allow_redirects=False)

        if resp.status_code == 302:
            location = resp.headers['Location']
            params = urlparse.parse_qs(location)
            self.JSESSIONID = resp.cookies.get('JSESSIONID')
            self.auth_code = params['code'][0]
            self.state = params['state'][0]

    def getToken(self):
        if self.auth_code is None or self.state is None:
            raise Exception('No auth code or state')

        headers = {'Authorization': 'Basic ' + self.clientCred}
        url = self.rootUri + '/oxauth/seam/resource/restv1/oxauth/token'
        values = {'scope': 'openid+profile+email',
                  'redirect_uri': self.redirectUri,
                  'client_id': self.clientId,
                  'code': self.auth_code,
                  'grant_type': 'authorization_code'}

        cookies = {
            'JSESSIONID': self.JSESSIONID
        }
        resp = requests.post(url,
                             headers=headers,
                             data=values,
                             cookies=cookies,
                             verify=False,
                             allow_redirects=False)

        if resp.status_code == requests.codes.ok:
            json = resp.json()
            self.access_token = json['access_token']
        else:
            raise Exception('No token returned')


    def checkUserInfo(self):
        if self.access_token is None:
            raise Exception('No access token')

        url = self.rootUri + '/oxauth/seam/resource/restv1/oxauth/userinfo'
        values = {'access_token': self.access_token}
        resp = requests.post(url,
                             data=values,
                             verify=False,
                             allow_redirects=False)

        if resp.status_code == requests.codes.ok:
            json = resp.json()
            if json['email'] == self.testUserMail:
                return True
            else:
                raise Exception('No user info returned')
        else:
            raise Exception('No user info returned')


    def checkService(self):
        self.getCode()
        self.getToken()
        self.checkUserInfo()

class Check(base.Check):
    def __init__(self, rootUris):
        self.rootUris = rootUris

    def check(self):
        for rootUri in self.rootUris:
            client = GluuSimpleTest(rootUri)
            client.checkService()
