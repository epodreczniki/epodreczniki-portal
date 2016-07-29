# coding=utf-8

from __future__ import absolute_import

import time
import random
from contextlib import contextmanager

from surround.django.redis import get_connection, WatchError
from django.conf import settings

from . import keys
from . import exceptions
import logging
import base64

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

sessions_logger = logging.getLogger('eo_sessions')
objects_logger = logging.getLogger('eo_objects')

class DeferredLogger(object):

    def __init__(self, logger):
        self.logger = logger
        self.entries = []

    def log(self, level, pattern, *args, **kwargs):
        self.entries.append((level, pattern, args, kwargs))

    def dump(self):
        for e in self.entries:
            try:
                self.logger.log(e[0], e[1], *e[2], **e[3])
            except Exception as e:
                pass
        self.entries = []


class AppLock(object):

    def __init__(self, username, expires_at, mode):
        self.username = username
        self.expires_at = int(expires_at)
        self.mode = mode

    def __str__(self):
        return '%s:%s:%s' % (self.username, self.expires_at, self.mode)

    def to_backend(self):
        return '%s:%s:%s' % (base64.b64encode(self.username), self.expires_at, self.mode)

    __unicode__ = __str__
    __repr__ = __str__

    @staticmethod
    def from_backend(s):
        if s is None or s == '' or s == 'none' or s == 'None':
            return None
        username, expires_at, mode = s.split(':')
        return AppLock(base64.b64decode(username), expires_at, mode)


class ObjectLock(object):

    def __init__(self, username, expires_at, mode, etag):
        self.username = username
        self.expires_at = int(expires_at)
        self.mode = mode
        self.etag = etag

    def __str__(self):
        return '%s:%s:%s:%s' % (self.username, self.expires_at, self.mode, self.etag)

    def to_backend(self):
        return '%s:%s:%s:%s' % (base64.b64encode(self.username), self.expires_at, self.mode, self.etag)

    __unicode__ = __str__
    __repr__ = __str__

    @staticmethod
    def from_backend(s):
        if s is None or s == '' or s == 'none' or s == 'None':
            return None
        username, expires_at, mode, etag = s.split(':')
        return ObjectLock(base64.b64decode(username), expires_at, mode, etag)


class SimpleLockManager(object):

    lock_class = None
    harsh_mode = False

    @classmethod
    def raise_for_mode(cls, mode):
        if mode not in cls.MODES:
            raise exceptions.InvalidModeLockException('invalid mode: %s' % mode)

    @classmethod
    def is_sufficient(cls, mode, at_least):
        return cls.MODES.index(mode) >= cls.MODES.index(at_least)


    @staticmethod
    def now():
        return int(time.time())

    def __init__(self, lockid, user, origin, key):
        self.logger = None
        self.lockid = lockid
        self.key = key
        self.origin = origin
        self.user = user
        assert self.user is not None

    def clear(self):
        redis = get_connection()
        redis.delete(self.key)

    def get_locks(self, connection):
        return {k: self.lock_class.from_backend(v) for k, v in connection.hgetall(self.key).items()}

    def log(self, level, message, *args, **kwargs):
        self.logger.log(level, 'action on object: %s, user: %s, lockid: %s, ip: %s :: ' + message, self.driver, self.username, self.lockid, self.origin.ip, *args, **kwargs)

    def log_lock_action(self, logger, action, lockid, locks, new_mode):
        logger.log(logging.INFO, 'action on lock: %s, lockid: %s, total: %s, lock %s on: %s, user: %s, ip: %s, current timeout: %s',
            action,
            lockid,
            len(locks),
            new_mode,
            self.lockee,
            self.username.replace(' ', '-'),
            self.origin.ip,
            settings.EPO_EDITION_LOCK_EXPIRE,
        )

    def clear_expired_ones(self, logger, locks, pipe, now):
        to_remove = None
        for id, lock in locks.items():
            if (lock.expires_at < now):
                if to_remove is None:
                    to_remove = []
                to_remove.append(id)

        if bool(to_remove):
            for remove in to_remove:
                del locks[remove]
                self.log_lock_action(logger, 'expire', remove, locks, self.DROP)

            pipe.hdel(self.key, *to_remove)

    def global_state(self):
        return self.get_locks(get_connection())

    def get_mode(self):
        if self.lockid is None:
            return self.DROP
        # state = self.state
        # return state.mode if state is not None else LockMode.DROP
        redis = get_connection()
        lock = self.lock_class.from_backend(redis.hget(self.key, self.lockid))
        if lock is not None:
            return lock.mode
        else:
            return self.DROP

    def set_mode_catching(self, new_mode):

        try:
            return self.set_mode(new_mode)
        except exceptions.LockException as e:
            result = {
                'status': 'failure',
                'reason': e.failure_reason,
                'mode': 'drop',
            }
            try:
                result['others'] = e.others
            except AttributeError:
                pass
            return result

    def set_mode(self, new_mode):
        self.raise_for_mode(new_mode)
        tries = settings.EPO_EDITION_LOCKS_REPEATS
        while tries > 0:
            try:
               return self._try_set_mode(new_mode)
            except WatchError:
                warning('retrying set lock %s on %s', new_mode, self)
                tries -= 1
            except exceptions.LockException as e:
                raise
            except Exception as e:
                import traceback
                traceback.print_exc()
                error('an unknown exception occurred during locking: %s', e)
                raise exceptions.UnknownLockException(e)

        raise exceptions.TooManyTriesLockException()

    def validate(self, mode_at_least):
        mode = self.get_mode()
        if not self.is_sufficient(mode, mode_at_least):
            raise exceptions.InsufficientModeLockException()

    # @property
    # def userid(self):
    #     return self.user.id if self.user.is_authenticated() else 'anonymous'


    @property
    def username(self):
        return self.user.username if self.user.is_authenticated() else 'anonymous'


    def _try_set_mode(self, new_mode):

        locks = None
        new_id = None

        try:
            now = self.now()
            logger = DeferredLogger(self.logger)

            redis = get_connection()
            pipe = redis.pipeline(transaction=True)

            old_id = self.lockid

            pipe.watch(self.key)

            locks = self.get_locks(pipe)

            pipe.multi()

            if self.harsh_mode:
                self.clear_expired_ones(logger, locks, pipe, now)

            if old_id is not None:

                current_lock = locks.get(old_id, None)

                if current_lock is not None:
                    old_mode = current_lock.mode
                else:
                    old_mode = self.DROP
            else:
                current_lock = None
                old_mode = self.DROP


            if new_mode != self.DROP:
                if current_lock is None:
                    new_id = '%032x' % random.getrandbits(128)
                else:
                    new_id = old_id
            else:
                new_id = None

            if old_id is not None:
                try:
                    del locks[old_id]
                except KeyError:
                    pass


            if new_id is not None:

                if new_mode == old_mode:
                    assert current_lock is not None
                    current_lock.expires_at = now + settings.EPO_EDITION_LOCK_EXPIRE
                    new_lock = current_lock
                    locks[new_id] = new_lock
                    self.log_lock_action(logger, 'keep', new_id, locks, new_mode)
                    pipe.hset(self.key, new_id, new_lock.to_backend())
                else:
                    new_lock = self.generate_new_lock(new_mode, now)

                    if not self.harsh_mode:
                        self.clear_expired_ones(logger, locks, pipe, now)

                    self.compare_others(new_mode, locks)

                    locks[new_id] = new_lock
                    pipe.hset(self.key, new_id, new_lock.to_backend())
                    self.log_lock_action(logger, 'create', new_id, locks, new_mode)
            else:
                if current_lock is not None:
                    pipe.hdel(self.key, old_id)
                    self.log_lock_action(logger, 'close', old_id, locks, new_mode)

                new_lock = None

            pipe.expire(self.key, settings.EPO_EDITION_LOCK_KEY_EXPIRE)

            pipe.execute()

            logger.dump()

            result = { 'status': 'ok' }
            if new_lock is not None:
                assert new_id is not None
                result['lockid'] = new_id
                result['expiresin'] = settings.EPO_EDITION_LOCK_EXPIRE
                result['mode'] = new_lock.mode
            else:
                result['lockid'] = None
                result['mode'] = self.DROP

            result['others'] = self._serialize_others(locks, new_id)

            self.lockid = new_id

            return result

        except exceptions.LockException as e:
            e.others = self._serialize_others(locks, new_id)
            raise


    def _serialize_others(self, locks, new_id):
        return [ { 'user': v.username, 'mode': v.mode} for k, v in locks.items() if k != new_id ]

    @contextmanager
    def at_least(self, mode_at_least, provide=False):
        # if provide:
        #     raise NotImplementedError('auto provide is not yet implemented')
        if self.lockid is not None:
            lock_provided = True
            self.validate(mode_at_least)
        else:
            if not provide:
                raise exceptions.InsufficientModeLockException('object %r is not locked' % self)
            lock_provided = False
            self.set_mode(mode_at_least)

        try:
            yield self
        finally:
            if not lock_provided:
                self.drop()



class ObjectLockManager(SimpleLockManager):
    lock_class = ObjectLock

    DROP = 'drop'
    WATCH = 'watch'
    READ = 'read'
    WRITE = 'write'

    MODES = (DROP, WATCH, READ, WRITE)

    def __init__(self, lockid, user, origin, driver):
        SimpleLockManager.__init__(self, lockid, user, origin, keys.object_lock(category=driver.category, identifier=driver.identifier, version=driver.version))
        self.driver = driver
        self.logger = objects_logger

    def compare_others(self, new_mode, locks):
        if (new_mode == ObjectLockManager.WRITE) or (new_mode == ObjectLockManager.READ):
            for id, lock in locks.items():
                if (lock.mode == ObjectLockManager.WRITE) or (new_mode == ObjectLockManager.WRITE and lock.mode == ObjectLockManager.READ):
                    if lock.mode == ObjectLockManager.WRITE:
                        raise exceptions.OtherWriteLockException()
                    else:
                        raise exceptions.OtherReadLockException()

    def generate_new_lock(self, new_mode, now):
        return ObjectLock(self.username, now + settings.EPO_EDITION_LOCK_EXPIRE, new_mode, 'x')

    def drop(self):
        return self.set_mode(ObjectLockManager.DROP)

    def watch(self):
        return self.set_mode(ObjectLockManager.WATCH)

    def read(self):
        return self.set_mode(ObjectLockManager.READ)

    def write(self):
        return self.set_mode(ObjectLockManager.WRITE)

    @property
    def lockee(self):
        return self.driver


class AppLockManager(SimpleLockManager):
    lock_class = AppLock
    harsh_mode = True

    DROP = 'drop'
    USE = 'use'

    MODES = (DROP, USE)

    @staticmethod
    def raise_for_appid(appid):
        if appid not in settings.EPO_EDITION_APPS_REGISTER:
            raise exceptions.UnregisteredAppLockException('unregistered appid: %s' % appid)

    def __init__(self, lockid, user, origin, appid):
        AppLockManager.raise_for_appid(appid)
        SimpleLockManager.__init__(self, lockid, user, origin, keys.app_lock(appid=appid))
        self.appid = appid
        self.logger = sessions_logger
        try:
            self.app_limit = settings.EPO_EDITION_APPS_REGISTER[self.appid]['limit']
        except KeyError:
            raise exceptions.InvalidModeLockException('application not registered')

    def compare_others(self, new_mode, locks):
        if new_mode != self.DROP:
            if len(locks) >= self.app_limit:
                raise exceptions.AppLimitLockException()

    def generate_new_lock(self, new_mode, now):
        return AppLock(self.username, now + settings.EPO_EDITION_LOCK_EXPIRE, new_mode)

    @property
    def lockee(self):
        return self.appid


