# coding=utf-8
import json

from auth.serializers import EpoJSONWebTokenSerializer
from common.endpoint import get_user_endpoints
from auth.exceptions import UserCreationException, UserActivationException
from auth.forms import EpoAuthenticationForm, EpoRegistrationForm, EpoUserCreationForm
from auth.oidc import UserRegistrationClient
from auth.utils import epo_auth_required, anonymous_required, auth_token_generator, list_available_providers, \
    get_user_additional_info, update_user_info, accept_agreement, set_user_ping_temp_cache
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import authenticate
from django.contrib.auth.views import login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.contrib.auth import login as django_auth_login
from rest_framework import status
from rest_framework.response import Response
from rest_framework_jwt.views import ObtainJSONWebToken, jwt_response_payload_handler
from surround.django.simple_cors.decorators import cors_headers
from surround.django.decorators import never_cache_headers, add_cache_headers


@epo_auth_required(profile='default')
def profile(request):
    return render(request, 'auth_profile.html')


@anonymous_required(profile='default')
def epo_login(request, *args, **kwargs):
    from reader.templatetags.extensions import explode_url_host

    scheme = 'https' if request.is_secure() else 'http'
    kwargs['authentication_form'] = EpoAuthenticationForm

    kwargs['extra_context'] = {
        'providers': list_available_providers(scheme),
        'form_type': settings.EPO_REGISTRATION_FORM_TYPE
    }

    resp = login(request, template_name='auth_login.html', *args, **kwargs)

    if isinstance(resp, HttpResponseRedirect):
        redirect_location = explode_url_host(resp['Location'])
        if redirect_location:
            resp['Location'] = redirect_location

    set_user_ping_temp_cache(resp)

    return resp


@epo_auth_required(profile='default', has_next=False)
@never_cache_headers
def epo_logout(request, *args, **kwargs):
    from reader.templatetags.extensions import explode_url_host

    if 'redirect_logout' in request.GET:
        next_page = request.GET['redirect_logout']
        next_page = explode_url_host(next_page)
        if next_page is not None:
            kwargs['next_page'] = next_page

    response = logout(request, template_name='auth_logout.html', *args, **kwargs)

    set_user_ping_temp_cache(response)

    return response


@anonymous_required(profile='default')
@never_cache_headers
def epo_external_login(request, provider):
    code = None
    if 'code' in request.GET:
        code = request.GET['code']
    if 'code' in request.POST:
        code = request.POST['code']
    if code:
        user = authenticate(code=code, provider=provider, request=request, username=None, password=None)
        if user:
            request.user = user
            django_auth_login(request, user)

    return redirect(epo_login)


@cors_headers(profile='default', allow_credentials=True)
@add_cache_headers(timeout=settings.EPO_AUTH_USER_PING_MAX_AGE)
def user_ping(request):
    if request.user.is_authenticated():
        # currently not using specified access token auth
        # sg = SessionGrant(request.session, request.user)
        # token = sg.access_token if sg.has_grant else auth_token_generator(request.session, request.user)
        # tkn = jwt_encode_handler({'ac': token, 'sub': request.user.pk})
        groups = []
        from auth.fake_models import FakeUser
        if not isinstance(request.user, FakeUser):
            groups = [g.name for g in request.user.groups.all()]
        resp = {
            'authentication': 'positive',
            'context': {
                'username': request.user.get_username(),
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'email': request.user.email,
                # use fake access token instead
                'access_token': auth_token_generator(request.session, request.user),
                'endpoints': get_user_endpoints(request.user),
                'user_groups': groups
            }
        }

        resp['context'].update(get_user_additional_info(request.user))

        # code = 200
    else:
        resp = {
            'authentication': 'negative',
            'context': None,
        }
        # code = 401

    return HttpResponse(json.dumps(resp, indent=4), content_type="application/json", status=200)


@never_cache_headers
def registration_feedback(request):
    return render(request, 'registration_feedback.html')


@never_cache_headers
def register_user(request):
    form = EpoRegistrationForm()
    if request.method == 'POST':
        form = EpoRegistrationForm(request.POST, auto_id='%s')

        if form.is_valid():
            client = UserRegistrationClient()
            try:
                client.create(form.cleaned_data['first_name'],
                              form.cleaned_data['last_name'],
                              form.cleaned_data['password'],
                              form.cleaned_data['email'])
                messages.add_message(request, messages.SUCCESS,
                                     u'Zarejestrowano nowego użytkownika, '
                                     u'w celu aktywacji konta, otwórz link przesłany w e-mailu')
            except UserCreationException as uce:
                messages.add_message(request, messages.ERROR, uce)

            return redirect(registration_feedback)

    return render(request, 'register_user.html', {'form': form})


@never_cache_headers
def register_user_django(request):
    form = EpoUserCreationForm()
    if request.method == 'POST':
        form = EpoUserCreationForm(request.POST, auto_id='%s')

        if form.is_valid():
            form.save(True)
            messages.add_message(request, messages.SUCCESS,
                                 u'Zarejestrowano nowego uzytkownika, dziękujemy. '
                                 u'Teraz możesz przejść do formularza logowania')

            return render(request, 'registration_feedback.html')

    return render(request, 'register_user.html', {'form': form})


@never_cache_headers
def activate_user(request, guid):
    client = UserRegistrationClient()
    try:
        client.activate(guid)
        messages.add_message(request, messages.SUCCESS, u'aktywowano użytkownika')
    except UserActivationException as uce:
        messages.add_message(request, messages.ERROR, uce)

    return render(request, 'registration_feedback.html')


@never_cache_headers
def renew_activation_email(request):
    form = PasswordResetForm()
    client = UserRegistrationClient()
    try:
        if request.method == 'POST':
            form = PasswordResetForm(request.POST)
            if form.is_valid():
                client.resend_activation_email(form.cleaned_data['email'])
                messages.add_message(request, messages.SUCCESS,
                                     u'Wysłano ponownie e-mail aktywacyjny na adres: ' + form.cleaned_data['email'])
                return redirect(registration_feedback)
    except UserCreationException as uce:
        messages.add_message(request, messages.ERROR, uce)

    return render(request, 'renew_activation_email.html', {'form': form})


@never_cache_headers
def send_password_reset_email(request):
    form = PasswordResetForm()
    client = UserRegistrationClient()
    try:
        if request.method == 'POST':
            form = PasswordResetForm(request.POST)
            if form.is_valid():
                client.send_password_reset_email(form.cleaned_data['email'])
                return redirect('auth-user-password-reset-done')
                # messages.add_message(request, messages.SUCCESS, u'Wysłano email resetujący hasło.')
    except UserUpdateException as uce:
        messages.add_message(request, messages.ERROR, uce)

    return render(request, 'password_reset/password_reset_form.html', {'form': form})


@never_cache_headers
def password_reset_form(request, guid):
    client = UserRegistrationClient()
    form = SetPasswordForm(None)
    try:
        if request.method == 'POST':
            form = SetPasswordForm(None, request.POST)
            if form.is_valid():
                new_password = form.clean_new_password2()
                client.password_reset(guid, new_password)
                return redirect(password_reset_complete)
                # messages.add_message(request, messages.SUCCESS, u'aktywowano użytkownika')
    except UserUpdateException as uce:
        messages.add_message(request, messages.ERROR, uce)
    except ValidationError:
        pass

    return render(request, 'password_reset/password_reset_confirm.html', {'form': form, 'validlink': True})


@cors_headers(profile='useredit')
@never_cache_headers
def update_user(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            update_user_info(request.user, request.POST)

    response = HttpResponse()

    set_user_ping_temp_cache(response)

    return response


@never_cache_headers
def user_exists(request):
    pass


@epo_auth_required(profile='default')
@never_cache_headers
def agreement(request):
    from reader.templatetags.extensions import explode_url_host
    if request.method == 'POST':
        if request.POST.get('accept_box', 'off') == 'on':
            accept_agreement(str(request.user.pk))

            resp = redirect(request.POST.get('next', settings.LOGIN_REDIRECT_URL))
            set_user_ping_temp_cache(resp)
            return resp

    next_page = explode_url_host(request.GET.get('next', '/'))

    return render(request, 'user_agreement.html', {'next': next_page})


class EpoObtainJSONWebToken(ObtainJSONWebToken):
    def post(self, request):
        serializer = self.serializer_class(request=request, data=request.DATA)

        if serializer.is_valid():
            user = serializer.object.get('user') or request.user
            token = serializer.object.get('token')
            response_data = jwt_response_payload_handler(token, user, request)

            return Response(response_data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer_class = EpoJSONWebTokenSerializer
