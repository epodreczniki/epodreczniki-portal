# coding: utf-8
from __future__ import absolute_import

from .models import Publication, PublicationDependency
from . import objects
from functools import wraps
import traceback, sys
from django.utils import timezone
from datetime import timedelta
from django.utils.functional import cached_property
import random
import datetime
from . import exceptions
from . import forms
import time
from django.core.exceptions import PermissionDenied
from django.conf import settings
from django.core.urlresolvers import reverse
from surround.django import redis
from . import keys
from surround.django.execution import MultiParameters
import repository.utils
from django.http import Http404
import common.objects
import celery
from celery import shared_task
from celery.contrib.methods import task_method
import repo.exceptions
from celery.task import current
from copy import copy
import django.db.utils
import os.path
import os
import subprocess
import requests.exceptions

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

@redis.cache_result(timeout=(60 * 10), key=keys.app + 'descriptor:c:{category}:i:{identifier}:v:{version}:a:{aspect}')
def cached_full_descriptor(category, identifier, version, aspect):
    return PublicationContext.bind_raw(category, identifier, version, aspect).full_descriptor



def publication_command_internal(func):

    @wraps(func)
    def wrapped(self, *args, **kwargs):

        try:
            self.update(last_processed=timezone.now(), last_function=func.__name__)
        except exceptions.PublicationOutdated as e:
            warning('publication %s does not longer exist - canceling operation %s', self, func.__name__)
            return
        except Exception as e:
            warning("catched exception while logging to db: %s: %s", e, traceback.format_exc())

        try:
            self.driver.raise_for_invalid()
            return func(self, *args, **kwargs)
        except Exception as e:
            exc_info = sys.exc_info()

            self.flush()
            set_fail = not isinstance(e, celery.exceptions.Retry)

            last_exception = [str(e), traceback.format_exc()]
            # logger.exception('exception occurred: %s', e)
            try:
                self.update(last_processed=timezone.now(), last_exception="\n".join(last_exception), status=(Publication.FAILED if set_fail else None))

            except Exception as e:
                warning("catched exception while logging to db: %s: %s", e, traceback.format_exc())

            raise exc_info[0], exc_info[1], exc_info[2]


    return wrapped


def publication_command(queue='general', change_status_to=None, **task_kwargs):

    def wrapper(func):

        task_name = func.__name__
        wrapped_task = shared_task(name='publication.utils.%s' % task_name, ignore_result=True, filter=task_method, **task_kwargs)(publication_command_internal(func))
        globals()[task_name] = wrapped_task

        @wraps(func)
        def wrapped(self, async=False, *args, **kwargs):

            if change_status_to is not None or async:
                self.rebind_or_create_publication()

            if change_status_to is not None:
                self.update(status=change_status_to)

            if not async:
                return func(self, *args, **kwargs)
            else:
                queue_name = getattr(self.driver, '%s_queue' % queue, 'publisher')
                return wrapped_task.apply_async(args=((self,) + args), kwargs=kwargs, queue=queue_name)

        return wrapped

    return wrapper




class PublicationArguments(object):

    def __init__(self, restart=False):
        self.restart = restart

    @classmethod
    def bind(cls, **kwargs):
        return PublicationArguments(**kwargs)

    def inherit(self):
        return self.bind(restart=self.restart)


class PublicationContext(common.objects.BareDriverDegradableMixin):

    def __init__(self, category, identifier, version, aspect, publication_obj_pk, flow_id, user=None):

        self.category = category
        self.identifier = identifier
        self.version = version
        self.aspect = aspect
        self.publication_obj_pk = publication_obj_pk
        self.flow_id = flow_id
        self.user = user

    def __repr__(self):
        return u'PublicationContext:%s:%s:%s:%s:%s' % (self.category, self.identifier, self.version, self.aspect, self.flow_id)


    @classmethod
    def bind_publication_obj(cls, publication_obj, user=None):
        return cls(publication_obj.get_category_display(), str(publication_obj.identifier), int(publication_obj.version), str(publication_obj.aspect), publication_obj.pk, publication_obj.flow_id, user=user)

    @classmethod
    def bind_driver(cls, driver):
        return cls(driver.category, driver.identifier, driver.version, getattr(driver, 'aspect', 'all'), None, None, user=getattr(driver, 'user', None))

    @classmethod
    def bind_raw(cls, category, identifier, version, aspect, user=None):
        return cls(category, identifier, version, aspect, None, None, user=user)

    @classmethod
    def bind_short_identification(cls, short_identification):
        category, identifier, version, aspect = short_identification.split('-')
        return cls.bind_raw(category, identifier, version, aspect)

    @cached_property
    def sibling_aspects(self):
        return [self.bind_driver(aspect_driver) for aspect_driver in self.driver.sibling_aspects]



    def rebind_dependency(self, dependency):
        return self.bind_driver(dependency)

    def rebind_aspect(self, aspect):
        return self.bind_raw(self.category, self.identifier, self.version, aspect, user=self.user)

    def __reduce__(self):
        return (self.__class__, (self.category, self.identifier, self.version, self.aspect, self.publication_obj_pk, self.flow_id, None))

    @cached_property
    def publication_obj(self):

        if self.publication_obj_pk is None:
            raise Publication.DoesNotExist('%s has no bound Publication' % self)

        return Publication.objects.get(pk=self.publication_obj_pk, flow_id=self.flow_id)

    @cached_property
    def driver(self):
        return objects.drivers.bind(self.category, self.identifier, self.version, self.aspect, user=self.user)

    def flush(self):
        try:
            del self.publication_obj
        except AttributeError:
            pass

    @staticmethod
    def generate_new_flow_id():
        return '%016x' % random.getrandbits(64)




    @property
    def is_ready(self):
        return self.driver.current_target_status in (Publication.READY, Publication.PUBLISHED, Publication.STALE)

    def _validate_and_bind_fetched_publication_obj(self, publication):
        if self.flow_id is not None:
            if self.flow_id != publication.flow_id:
                raise exceptions.PublicationOutdated('outdated object: %s' % self)

        self.publication_obj_pk = publication.pk
        self.flow_id = publication.flow_id

    def rebind_to_existing_publication(self):
        publication = Publication.objects.get(category=Publication.CATEGORY_RDICT[self.category], identifier=self.identifier, version=self.version, aspect=self.aspect)
        self._validate_and_bind_fetched_publication_obj(publication)
        return publication

    def rebind_or_create_publication(self):
        publication_obj, created = Publication.objects.get_or_create(category=Publication.CATEGORY_RDICT[self.category], identifier=self.identifier, version=self.version, aspect=self.aspect, defaults={ 'flow_id': self.generate_new_flow_id(), 'last_modified': timezone.now(), 'status': Publication.INITIAL })
        self._validate_and_bind_fetched_publication_obj(publication_obj)
        return created

    def assure_bound_publication(self):
        if self.publication_obj_pk is None:
            self.rebind_to_existing_publication()

    def refresh_publication_bound(self):
        self.flush()

        try:
            return self.publication_obj
        except Publication.DoesNotExist as e:
            return self.rebind_to_existing_publication()


    @property
    def publication_exists(self):
        try:
            self.refresh_publication_bound()
            return True
        except Publication.DoesNotExist as e:
            return False


    @property
    def publication_status(self):
        try:
            self.assure_bound_publication()
            return self.publication_obj.status
        except Publication.DoesNotExist as e:
            return None


    @property
    def publication_status_display(self):
        publication_status = self.publication_status
        return Publication.STATUSES_REVERSE[publication_status] if publication_status is not None else None


    @property
    def single_status(self):
        object_status = self.object_status

        if object_status in (Publication.PUBLISHED, Publication.READY, Publication.STALE):

            publication_status = self.publication_status_display

            if publication_status == 'success':
                return object_status

            if publication_status is not None:
                return publication_status

        return object_status


    @property
    def is_published(self):
        return self.object_status == Publication.PUBLISHED


    @cached_property
    def object_status(self):
        return self.driver.current_target_status


    @cached_property
    def edition_find_url(self):
        return reverse('editres.views.find_object', args=[self.category, self.identifier, self.version])

    @cached_property
    def view_url(self):
        return reverse('publication.views.publication_view', args=[self.category, self.identifier, self.version, self.aspect])

    @cached_property
    def aspects_url(self):
        return reverse('publication.views.publication_aspects_view', args=[self.category, self.identifier, self.version])


    def cancel(self, cause='unknown cause'):
        if self.publication_status != Publication.SUCCESS:
            info('canceling publication: %s', self)
            self.update(status=Publication.CANCELED, change_flow_id=True, notify=True, last_exception=cause)


    def failure(self, cause='unknown cause'):
        if self.publication_status != Publication.SUCCESS:
            info('failuring publication: %s', self)
            self.update(status=Publication.FAILED, change_flow_id=True, notify=True, last_exception=cause)


    def forget(self):
        info('forgetting publication %s', self)
        if self.publication_exists:
            self.publication_obj.delete()
            self.cached_full_descriptor_force()
            self.flow_id = None
            self.publication_obj_pk = None
            self.flush()


    def publish(self, user=None, arguments=PublicationArguments(), dependants=None, async=True):
        """Returns boolean telling whether object is published."""


        cached_full_descriptor.purge(self.category, self.identifier, self.version, self.aspect)

        self.flush()

        if self.object_status == Publication.MISSING:
            warning('skipping publication of non existant object: %s', self)
            return


        if self.object_status == Publication.PUBLISHED:
            created = False
        else:
            created = self.rebind_or_create_publication()

        change_flow_id = False

        if created:
            info('created publication: %s' % self)
            change_flow_id = False
        elif self.publication_status == Publication.FAILED:
            info('respawning failed task: %s', self)
            change_flow_id = True
        elif self.publication_status == Publication.CANCELED:
            info('respawning canceled task: %s', self)
            change_flow_id = True
        elif self.publication_status in (Publication.PROCESSING, Publication.FETCHING, Publication.INITIAL, Publication.DEPENDENCIES, Publication.VERIFYING):
            if arguments.restart:
                info('publication in progress - forcing: %s', self)
                change_flow_id = True
            else:
                info('publication in progress - doing nothing: %s', self)
                change_flow_id = False
        elif self.publication_status == Publication.SUCCESS:
            if self.object_status in (Publication.STALE, Publication.READY):
                info('refreshing stale object %s', self)
                change_flow_id = True
            else:
                info('skipping successed publication task %s', self)

        proceed = change_flow_id or created

        if proceed:
            info('initializing publication process: %s', self)
            if change_flow_id:
                self.update(change_flow_id=True)
            if self.publication_obj.user is None:
                self.update(user=user)
            self.update(status=Publication.INITIAL, notify=created)

            if dependants:
                for dependant in dependants:
                    obj, created = PublicationDependency.objects.get_or_create(dependant=dependant.publication_obj, dependency=self.publication_obj)
                    if created:
                        info('established dependency relation: %s on %s', dependant, self)
        else:
            info('not initializing publication process: %s', self)


        self.initialize_process(async=async, arguments=arguments, proceed=proceed, dependants=dependants)




    def notify_dependants(self):

        if self.publication_status == Publication.SUCCESS:
            info('notifying dependants of %s about status change to success', self)
            for relation in list(self.publication_obj.dependants.all()):

                try:
                    relation.dependant_context.check_dependencies_state()
                except Exception as e:
                    logger.exception('failed to initialize dependant %s: %s', dependant, e)
                else:
                    info('forgetting relation of %s on %s', relation.dependant_context, self)
                    relation.delete()

        elif self.publication_status == Publication.CANCELED:
            info('cascade cancel dependants of %s', self)
            for relation in self.publication_obj.dependants.all():
                relation.dependant_context.cancel(cause=('dependency %s has been canceled:\n%s' % (self, self.publication_obj.last_exception)))
        elif self.publication_status == Publication.FAILED:
            info('cascade fail dependants of %s', self)
            for relation in self.publication_obj.dependants.all():
                relation.dependant_context.failure(cause=('dependency %s has failed:\n%s' % (self, self.publication_obj.last_exception)))


    def check_dependencies_state(self):
        if self.publication_status != Publication.DEPENDENCIES:
            debug('trying to pass dependencies state, while not inside it')
            return True

        if self.publication_obj.dependencies.exclude(dependency__status=Publication.SUCCESS).exists():
            info('scheduling wait for dependencies of %s', self)
            return True
        else:
            info('scheduling dependent operation of %s', self)
            self.dependent_operation_task(async=True)
            return False


    @classmethod
    def publish_raw(cls, category, identifier, version, aspect, **kwargs):
        return cls.bind_raw(category, identifier, version, aspect).publish(**kwargs)


    @cached_property
    def dependencies_contexts(self):
        if self.object_status == Publication.MISSING:
            return []
        return [self.rebind_dependency(dependency) for dependency in self.driver.publication_dependencies]


    @staticmethod
    def get_empty_statues():
        return { status: 0 for status in Publication.STATUSES.keys() }


    @cached_property
    def short_identification(self):
        return '%s-%s-%s-%s' % (self.category, self.identifier, self.version, self.aspect)


    @cached_property
    def identification(self):
        return {
            'path': self.short_identification,
            'category': self.category,
            'identifier': self.identifier,
            'version': self.version,
            'aspect': self.aspect,
            'aspect_title': self.driver.aspect_title,
        }


    @cached_property
    def cached_full_descriptor(self):
        return cached_full_descriptor(self.category, self.identifier, self.version, self.aspect)

    def cached_full_descriptor_force(self):
        return cached_full_descriptor.force(self.category, self.identifier, self.version, self.aspect)

    @property
    def has_dependencies(self):
        return bool(self.dependencies_contexts)

    @property
    def is_source_valid(self):
        return self.object_status not in (Publication.INVALID, Publication.MISSING)

    @cached_property
    def full_descriptor(self):

        result = {
            'identification': self.identification,
            'title': self.driver.title,
            'single_status': self.single_status,
            'publication_status': self.publication_status_display,
            'object_status': self.object_status,
            'dependencies': [ dependency.identification for dependency in self.dependencies_contexts ],
        }

        return result

    @classmethod
    def prefetch_cached_full_descriptors(cls, contexts):
        return
        # PoolExhaustedException is raised here

        parameters = MultiParameters()

        contexts_map = {}
        for context in contexts:
            parameters.bind(context.short_identification, context.category, context.identifier, context.version, context.aspect)
            contexts_map[context.short_identification] = context

        results = cached_full_descriptor.multi(parameters)

        for identification in results.keys():
            contexts_map[identification].cached_full_descriptor = results.get_result(identification, throw_if_exception=False).return_result_or_none()


    @property
    def has_administration_persmissions(self):
        return self.user is not None and (self.user.is_superuser or self.user.is_staff)


    @property
    def publication_user(self):
        try:
            self.assure_bound_publication()
            return self.publication_obj.user
        except Publication.DoesNotExist as e:
            return None

    @property
    def description(self):
        return u'%s - %s (%s:%s:%s:%s)' % (self.driver.aspect_title, self.driver.title, self.category, self.identifier, self.version, self.aspect)


    def send_mail(self, subject_lead, to, template):
        from common.tasks import send_mail_template
        send_mail_template(u'%s (%s): %s' % (subject_lead, settings.TOP_DOMAIN, self.description), to, template, {
            'context': self,
            'driver': self.driver,
            'TOP_DOMAIN': settings.TOP_DOMAIN,
        }, only_print=settings.EPO_PUBLICATION_NOTIFICATIONS_ONLY_PRINT, history_line=self.driver.email_history_line)

    def update(self, notify=False, change_flow_id=False, status=None, **kwargs):
        try:
            self.refresh_publication_bound()
        except Publication.DoesNotExist as e:
            raise exceptions.PublicationOutdated('publication does not exist any more: %s' % self)

        now = timezone.now()

        if change_flow_id:
            new_flow_id = self.generate_new_flow_id()
            kwargs['flow_id'] = new_flow_id

        if status is not None:
            kwargs['last_changed_status'] = now
            kwargs['status'] = status



        old_status = self.publication_obj.status

        updated = Publication.objects.filter(category=Publication.CATEGORY_RDICT[self.category], identifier=self.identifier, version=self.version, aspect=self.aspect, flow_id=self.flow_id).update(last_modified=now, **kwargs)
        self.flush()
        self.assure_bound_publication()

        if not updated:
            raise exceptions.PublicationOutdated('outdated object: %s' % self)

        if change_flow_id:
            self.flow_id = new_flow_id

        # only send emails, when this is the root publication cause
        if (status is not None) and (status != old_status or status == Publication.INITIAL) and notify and self.category == 'collection':

            if status == Publication.SUCCESS:
                self.send_mail(u'Proces zakończony', self.driver.get_notification_recipients(user=True, observers=True, extra=True), 'publication/mails/success.mail')

            elif status == Publication.FAILED:
                self.send_mail(u'Proces nieudany', self.driver.get_notification_recipients(observers=True), 'publication/mails/failed.mail')

            elif status == Publication.INITIAL:
                self.send_mail(u'Proces rozpoczęty', self.driver.get_notification_recipients(observers=True), 'publication/mails/initial.mail')

            elif status == Publication.CANCELED:
                self.send_mail(u'Proces anulowany', self.driver.get_notification_recipients(user=True, observers=True), 'publication/mails/canceled.mail')


        self.cached_full_descriptor_force()

        if status is not None:
            self.notify_dependants()

    @classmethod
    def bind_objects(cls, objects):
        for publication_obj in objects:
            yield cls.bind_publication_obj(publication_obj)

    @classmethod
    def recheck_all_objects_waiting_on_dependencies(cls, older_than=None):
        if older_than is None:
            older_than = settings.EPO_PUBLICATION_RECHECK_OLDER_THAN

        info('searching publications in dependencies state older than %s', older_than)

        rescheduled = 0
        imported = 0
        for context in cls.bind_objects(Publication.objects.filter(status=Publication.DEPENDENCIES, last_changed_status__lt=(timezone.now() - timedelta(seconds=older_than))).all()):
            info('found old publication %s', context)
            rescheduled += 1
            if not context.check_dependencies_state():
                imported += 1

        if rescheduled:
            warning('found %s old publications waiting for dependencies, %s where imported on sight', rescheduled, imported)


    @classmethod
    def remove_old_successed_publications(cls, older_than=None):
        if older_than is None:
            older_than = settings.EPO_PUBLICATION_REMOVE_OLDER_SUCCESS

        info('removing succeeded publications older than %s', older_than)
        Publication.objects.filter(status=Publication.SUCCESS, last_changed_status__lt=(timezone.now() - timedelta(seconds=older_than))).delete()


    @classmethod
    def send_periodic_publication_report(cls):

        info('sending periodic publication report')

        from common.tasks import send_mail_template
        send_mail_template('Raport dzienny z systemu publikacji - %s' % settings.TOP_DOMAIN, settings.EPO_PUBLICATION_OBSERVERS, 'publication/mails/report.mail', {
            'succeeded': cls.bind_objects(Publication.objects.filter(category=Publication.COLLECTION_CATEGORY, aspect='portal', status=Publication.SUCCESS, last_changed_status__gt=(timezone.now() - timedelta(days=1))).all()),
            'in_progress': cls.bind_objects(Publication.objects.filter(category=Publication.COLLECTION_CATEGORY, aspect='portal', status__in=[Publication.INITIAL, Publication.FETCHING, Publication.DEPENDENCIES, Publication.PROCESSING, Publication.VERIFYING]).all()),
            'failed': cls.bind_objects(Publication.objects.filter(category=Publication.COLLECTION_CATEGORY, status=Publication.FAILED, aspect='portal').all()),
            'TOP_DOMAIN': settings.TOP_DOMAIN,
        })


    STANDARD_RETRY_EXCEPTIONS = (repository.utils.XmlUnavailable, repo.exceptions.ObjectFileUnavailableException, exceptions.FileDownloadError, exceptions.OtherInstanceNotReadyError, requests.exceptions.Timeout) + ((django.db.utils.OperationalError,) if not settings.SURROUND_RUNNING_ON_PLATFORM else tuple())

    @publication_command(queue='independent', change_status_to=Publication.FETCHING)
    def independent_operation_task(self, proceed=True):


        if not self.is_ready:
            debug('processing of %s is still not ready, retrying independent operation later', self)
            raise self._retry(max_time=self.driver.independent_max_time)

        try:
            self.driver.execute_independent_operation()
        except self.STANDARD_RETRY_EXCEPTIONS as e:
            warning('failed to execute independent operation of %s: %s', self, e)
            raise self._retry(e, max_time=self.driver.independent_max_time)

        if proceed:
            self.update(status=Publication.DEPENDENCIES)
            self.check_dependencies_state()


    @publication_command(queue='dependent', change_status_to=Publication.PROCESSING)
    def dependent_operation_task(self):

        try:
            self.driver.execute_dependent_operation()
        except self.STANDARD_RETRY_EXCEPTIONS as e:
            raise self._retry(e, max_time=1800)

        self.verifying_operation_task(async=True)


    @publication_command(queue='dependent', change_status_to=Publication.VERIFYING)
    def verifying_operation_task(self):

        try:
            self.driver.execute_verifying_operation()
        except self.STANDARD_RETRY_EXCEPTIONS as e:
            raise self._retry(e, max_time=self.driver.verifying_max_time)

        self.update(status=Publication.SUCCESS, notify=True)


    # @publication_command()
    # def delete_object(self):

    #         # TODO: transaction here
    #     for imported_object in self.driver.filter_imported_objects():
    #         info(u'deleting %s object due to %s', imported_object, self)
    #         try:
    #             imported_object.delete()
    #         except Exception as e:
    #             info(u'failed to delete %s - skipping', self)
    #             raise


    @publication_command()
    def initialize_process(self, arguments, dependants=None, proceed=True):

        if proceed:
            debug('initializing process of %s', self)
            if dependants is None:
                dependants = []
            else:
                dependants = copy(dependants)
            dependants.append(self)
        else:
            debug('scanning dependencies of %s', self)

        # this goes now recursivelly and establish relations before proceeding
        # to the next stage
        for dependency in self.dependencies_contexts:
            dependency.publish(arguments=arguments.inherit(), async=False, dependants=dependants, user=self.publication_user)

        self.flush()
        if proceed:
            self.independent_operation_task(async=True, proceed=True)
        else:
            if self.publication_status == Publication.INITIAL:
                self.forget()


    def _retry(self, exc=None, max_time=(60 * 60 * 3), max_countdown=(60 * 60), kwargs=None):

        request = getattr(current, 'request', None)
        if request is None:
            warning('would retry, but it is not inside running task context')
            return celery.exceptions.Retry('dummy retry after: %s' % exc)

        countdown = min(2 ** current.request.retries, max_countdown)
        max_retries = 0
        time_counter = 0
        while time_counter < max_time:
            time_counter += min(2 ** max_retries, max_countdown)
            max_retries += 1

        args_new = current.request.args

        if args_new is None:
            args_new = []

        kwargs_new = current.request.kwargs
        if kwargs_new is None:
            kwargs_new = {}
        if kwargs:
            kwargs_new.update(kwargs)

        warning('retrying %s(%s)', current, ', '.join(list(map(repr, args_new)) + ['%s=%r' % (k, v) for k, v in kwargs_new.items()]))

        return current.retry(exc=exc, countdown=countdown, max_retries=max_retries, args=args_new, kwargs=kwargs_new)


class RemoteExecution(object):

    _current_ips = None

    @classmethod
    def get_current_ips(cls):
        if cls._current_ips == None:
            if settings.SURROUND_RUNNING_ON_PLATFORM:
                import netifaces
                cls._current_ips = []
                for interface in netifaces.interfaces():
                    cls._current_ips.extend([ifaddress['addr'] for ifaddress in netifaces.ifaddresses(interface).get(netifaces.AF_INET, [])])
            else:
                cls._current_ips = ['127.0.0.1']

        return cls._current_ips


    def __init__(self, role=None, ips=None, other=False):
        if ips is not None:
            self.ips = copy(ips)
        else:
            self.ips = []
            for ip in settings.HOSTS[role]:
                if other:
                    if ip in self.get_current_ips():
                        continue
                self.ips.append(ip)

        self._connections = {}



    def _get_connection(self, ip):
        import paramiko
        try:
            return self._connections[ip]
        except KeyError as e:
            connection = paramiko.SSHClient()
            connection.load_system_host_keys()
            connection.connect(hostname=ip, username='epo')
            self._connections[ip] = connection
            return connection

    def close(self):
        for connection in self._connections.values():
            connection.close()
        self._connections = {}

    @property
    def all_connections(self):
        for ip in self.ips:
            yield (ip, self._get_connection(ip))

    def _execute(self, connection, command):
        import paramiko
        try:
            connection.exec_command(command)
        except paramiko.SSHException as e:
            raise exceptions.PropagationFailureError('ssh failure: %s' % e)

    def execute(self, command):
        for _, connection in self.all_connections:
            self._execute(connection, command)

    def put(self, local, remote=None, recursive=False, clean=False):

        if os.path.isdir(local) and not local.endswith(os.sep):
            local = local + os.sep

        if remote is None:
            remote = local

        for ip, connection in self.all_connections:

            self._execute(connection, 'mkdir -p "%s"' % os.path.dirname(remote))
            try:
                subprocess.check_call(['rsync', '-rt', local, 'epo@%s:%s' % (ip, remote)])
            except subprocess.CalledProcessError as e:
                raise exceptions.PropagationFailureError('rsync failure: %s' % e)


