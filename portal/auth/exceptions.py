# coding=utf-8
from django.core.exceptions import ValidationError


class AuthExceptionBase(Exception):
    base_msg = u'bliżej nieokreślony błąd w autentykacji'

    def __init__(self, value=None, *args, **kwargs):
        super(AuthExceptionBase, self).__init__(args, kwargs)
        self.value = value if value else self.base_msg

    def __str__(self):
        return self.value

    def __unicode__(self):
        return self.value


class ServiceUnavailableTemporary(ValidationError, AuthExceptionBase):
    base_msg = u'Serwis chwilowo niedostępny, spróbuj ponownie później, lub zaloguj się przez inne konto.'

    def __init__(self, value=None, *args, **kwargs):
        super(ServiceUnavailableTemporary, self).__init__(value or [self.base_msg], *args, **kwargs)



class UserCreationException(AuthExceptionBase):
    base_msg = u'błąd podczas tworzenia użytkownika'


class UserUpdateException(AuthExceptionBase):
    base_msg = u'błąd podczas aktualizacji danych użytkownika'


class UserActivationException(AuthExceptionBase):
    base_msg = u'błąd podczas aktywacji użytkownika'


class EntityTooLargeException(Exception):
    pass