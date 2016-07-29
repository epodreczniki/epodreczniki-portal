# coding=utf-8
from logging import Logger
from auth.exceptions import ServiceUnavailableTemporary
from auth.oidc import OIDCIDTokenVerificationException, OIDCRequestException, ObtainTokenFailed
from django import forms

# place form definition here
from django.contrib.auth import authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User
from django.core import validators
from django.utils.safestring import mark_safe
import six
from django.utils.translation import ugettext_lazy as _

from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())


class EpoAuthenticationForm(AuthenticationForm):
    def clean(self):
        username = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if username and password:
            try:
                self.user_cache = authenticate(username=username,
                                           password=password,
                                           request=self.request)
            except (OIDCIDTokenVerificationException, ObtainTokenFailed, OIDCRequestException):
                logger.exception('Error with authenticate process.')
                raise ServiceUnavailableTemporary()

            if self.user_cache is None:
                raise forms.ValidationError(
                    self.error_messages['invalid_login'],
                    code='invalid_login',
                    params={'username': self.username_field.verbose_name},
                )
            else:
                self.confirm_login_allowed(self.user_cache)

        return self.cleaned_data


class BetterEmailValidator(validators.EmailValidator):
    message = u'Wprowadź poprawny adres email'


validate_email = BetterEmailValidator()


class NewEmailField(forms.EmailField):
    default_validators = [validate_email]


def wrap_placeholder(field_class, *args, **kwargs):
    new_kwargs = {}
    new_kwargs.update(kwargs)
    new_kwargs.pop('placeholder', '')

    new_class = type(field_class.__name__, (field_class,), {})

    def widget_attrs(self, widget):
        attrs = super(field_class, self).widget_attrs(widget)
        if 'placeholder' in kwargs:
            attrs['placeholder'] = kwargs['placeholder']

        return attrs

    new_class.widget_attrs = widget_attrs

    instance = new_class(*args, **new_kwargs)

    return instance


class FormHtmlMixin(object):
    def as_html(self):
        html = []
        for name, field in self.fields.items():
            bf = self[name]
            html.append(six.text_type(bf))

        return mark_safe('\n'.join(html))


class EpoRegistrationForm(FormHtmlMixin, forms.Form):
    first_name = wrap_placeholder(forms.CharField, min_length=2, placeholder=u'Imię')
    last_name = wrap_placeholder(forms.CharField, min_length=2, placeholder=u'Nazwisko')
    email = wrap_placeholder(NewEmailField, placeholder=u'Adres e-mail')
    password = wrap_placeholder(forms.CharField, widget=forms.PasswordInput(), placeholder=u'Hasło')
    password_repeat = wrap_placeholder(forms.CharField, widget=forms.PasswordInput(), placeholder=u'Powtórz hasło')

    def get_info(self):
        return 'Pamiętaj, żeby podczas rejestracji podać poprawny adres email, ponieważ zostanie na niego wysłana wiadomość z linkiem aktywacyjnym. Jeśli nie możesz znaleźć wiadomości z linkiem aktywacyjnym, sprawdź, czy nie znajduje się ona w folderze SPAM.'

    def clean(self):
        if self.data.get('agreement_accepted', 'off') != 'on':
            raise forms.ValidationError(u'Proszę wyrazić zgodę na przetwarzanie danych osobowych',)

        if self.cleaned_data.get('password', '') != self.cleaned_data.get('password_repeat', ' '):
            raise forms.ValidationError(u'Podane hasła się nie zgadzają', params={'password': ''})

        return self.cleaned_data


class EpoUserCreationForm(FormHtmlMixin, UserCreationForm):
    username = wrap_placeholder(forms.RegexField, label=_("Username"), placeholder=_("Username"), max_length=30,
        regex=r'^[\w.@+-]+$',
        help_text=_("Required. 30 characters or fewer. Letters, digits and "
                    "@/./+/-/_ only."),
        error_messages={
            'invalid': _("This value may contain only letters, numbers and "
                         "@/./+/-/_ characters.")})
    password1 = wrap_placeholder(forms.CharField, placeholder=_("Password"),
        widget=forms.PasswordInput)
    password2 = wrap_placeholder(forms.CharField, placeholder=_("Password confirmation"),
        widget=forms.PasswordInput,
        help_text=_("Enter the same password as above, for verification."))
    email = wrap_placeholder(forms.EmailField, label=_("Email"), placeholder=_("Email"), max_length=254)

    class Meta:
        model = User
        fields = ("username", 'email')
