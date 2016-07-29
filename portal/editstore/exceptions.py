# coding=utf-8
from __future__ import absolute_import, unicode_literals

from store.exceptions import *

class ObjectAlreadyExistInRepository(InvalidOperationException, NiceException):

    title = 'Obiekt już istnieje w repozytorium treści'
    status = 500


class SealException(InvalidOperationException, NiceException):

    title = 'Błąd pieczętowania. Skontaktuj się z administratorem.'
    status = 503


class SealedFileMismatch(SealException):

    title = 'Obiekt został zapieczętowany pomyślnie, jednakże stwierdzono niespójność danych; obiekt pozostanie dostępny w EO. Skontaktuj się z administratorem.'
    status = 500


class DependencyNotSealed(SealException):

    title = 'Obiekt zależny nie jest zapieczętowany'
    status = 500


class DependencyDoesNotExist(SealException):

    title = 'Obiekt zależny nie istnieje.'
    status = 500
    template_name = 'editstore/exceptions/dependency_does_not_exist.html'


class ObjectDoesNotExistInRepository(InvalidOperationException, NiceException):

    title = 'Obiekt nie jest dostępny w repozytorium treści.'
    status = 500

class OperationNotSupportedYet(InvalidOperationException, NiceException):
    title = 'Operacja nie jest obsługiwana w aktualnej wersji'
    status = 500

class WrongIdentifierException(InvalidOperationException, NiceException):

    title = 'Identyfikator nie może zawierać znaków "/" oraz "#"'
    status = 500


class LockException(InvalidOperationException, NiceException):

    title = 'Założenie blokady nie powiodło się.'
    failure_reason = 'unknown'
    status = 503


class DeniedLockException(LockException):
    failure_reason = 'denied'
    status = 403


class UnregisteredAppLockException(LockException):
    title = 'Niezarejestrowana aplikacja'
    failure_reason = 'invalid-app'
    status = 400


class InvalidModeLockException(LockException):
    title = 'Niepoprawny tryb'
    failure_reason = 'invalid-mode'
    status = 400


class AppLimitLockException(DeniedLockException):
    title = 'Wyczerpany limit aplikacji'
    failure_reason = 'app-limit'
    status = 403


class ObjectLockException(DeniedLockException):
    status = 403


class InsufficientModeLockException(ObjectLockException):
    title = 'Niewystarczający poziom blokady'
    status = 403


class OtherWriteLockException(ObjectLockException):
    title = 'Obiekt jest zablokowany do zapisu'
    failure_reason = 'other-write'
    status = 403


class OtherReadLockException(ObjectLockException):
    title = 'Obiekt jest zablokowany do odczytu'
    failure_reason = 'other-read'
    status = 403


class TooManyTriesLockException(LockException):
    title = 'Wyczerpany limit aplikacji'
    failure_reason = 'internal'
    status = 503


class UnknownLockException(LockException):
    status = 503


class ObjectSealFailure(InvalidOperationException, NiceException):

    title = 'Pieczętowanie obiektu nie powiodło się'
    status = 503


class ObjectImportFailure(InvalidOperationException, NiceException):

    title = 'Import obiektu nie powiódł się'
    status = 500


class MismatchingSpaceException(NiceException):
    title = 'Obiekt nie znajduje się w podanej przestrzeni'
    status = 404


class SpaceNotEmpty(NiceException):
    title = 'Przestrzeń nie jest pusta'
    status = 400


class UnsupportedObjectImportFailure(ObjectImportFailure):

    title = 'Niewspierana operacja importu'
    status = 403


class InvalidEditorStateObjectImportFailure(ObjectImportFailure):
    title = 'Wybrana kolekcja została zablokowana przed importem do systemu Edycji Online. Skontaktuj się z autorem tej kolekcji.'
    status = 403


class FilesExceedLimit(InvalidOperationException, NiceException):
    def __init__(self, message='nothing to show'):
        self.message = message

    def __str__(self):
        return 'files exceed the limit: ' + self.message


