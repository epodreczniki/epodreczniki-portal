from datetime import datetime
import json

from cassandra.cqlengine import ValidationError
from cassandra.cqlengine.query import DoesNotExist
from django.db.models.signals import post_save
from userapi.models import TaskProgress, TaskProgressTimeline, AggregateTasksProgress, AggregateTasksTimeline, \
    NotesTimeline
from userapi.utils import get_handbook_id, get_module_id
from surround.django.logging import setupModuleLogger


setupModuleLogger(globals())


class StateIsNotTaskProgress(Exception):
    pass


class InterceptorDispatcher(object):
    def __init__(self):
        self.interceptors_map = {}

    def _make_key(self, model, interceptor_class):
        return '%s:%s' % (model.__name__, interceptor_class.__name__)

    def register_interceptor(self, model, interceptor_class):
        key = self._make_key(model, interceptor_class)
        if key not in self.interceptors_map:
            post_save.connect(interceptor_class.receiver(), sender=model, weak=False)
            self.interceptors_map[key] = True


class InterceptorBase(object):
    @classmethod
    def receiver(cls):
        new_obj = cls()
        return new_obj.receiver_method

    def receiver_method(self, sender, **kwargs):
        pass

    def get_or_create(self, **kwargs):
        try:
            obj = self.model.objects.get(**kwargs)
        except DoesNotExist:
            obj = self.model(**kwargs)
        return obj

    def params_for_get(self, instance):
        return {}

    def get_object(self, instance):
        return self.get_or_create(**self.params_for_get(instance))


class SaveOnlyInterceptorMixin(object):
    def get_or_create(self, **kwargs):
        return self.model(**kwargs)


class TaskValidationMixin(object):
    def validate_success(self, instance):
        to_check = instance.value
        try:
            to_check = json.loads(to_check)
        except (TypeError, ValueError):
            raise StateIsNotTaskProgress()

        if 'answer' in to_check:
            if to_check['answer'] == 'correct':
                return True
            elif to_check['answer'] == 'incorrect':
                return False
            else:
                raise StateIsNotTaskProgress()

        return True


class TaskProgressInterceptor(SaveOnlyInterceptorMixin, TaskValidationMixin, InterceptorBase):
    model = TaskProgress

    def params_for_get(self, instance):
        return dict(
            user_id=instance.user_id,
            handbook_id=get_handbook_id(instance.bookpart_id),
            module_id=get_module_id(instance.bookpart_id),
            womi_id=instance.womi_id
        )

    def receiver_method(self, sender, **kwargs):
        try:
            obj = self.get_object(kwargs['instance'])
            if self.validate_success(kwargs['instance']):
                obj.succ_tries = (obj.succ_tries or 0) + 1
            obj.num_tries = (obj.num_tries or 0) + 1
            obj.update()
        except ValidationError as ve:
            error('%s', ve)
        except StateIsNotTaskProgress:
            pass #do nothing,


class TaskProgressTimelineInterceptor(SaveOnlyInterceptorMixin, TaskValidationMixin, InterceptorBase):
    model = TaskProgressTimeline

    def params_for_get(self, instance):
        return dict(
            user_id=instance.user_id,
            handbook_id=get_handbook_id(instance.bookpart_id)
        )

    def receiver_method(self, sender, **kwargs):
        try:
            self.validate_success(kwargs['instance'])
            obj = self.get_object(kwargs['instance'])
            obj.modify_time = datetime.now()
            obj.womi_id = kwargs['instance'].womi_id
            obj.save()
        except ValidationError as ve:
            error('%s', ve)
        except StateIsNotTaskProgress:
            pass #do nothing,


class AggregateTasksProgressInterceptor(TaskProgressInterceptor):
    model = AggregateTasksProgress

    def params_for_get(self, instance):
        return dict(
            user_id=instance.user_id,
            handbook_id=get_handbook_id(instance.bookpart_id)
        )


class AggregateTasksTimelineInterceptor(TaskProgressTimelineInterceptor):
    model = AggregateTasksTimeline

    def receiver_method(self, sender, **kwargs):
        try:
            self.validate_success(kwargs['instance'])
            obj = self.get_object(kwargs['instance'])
            obj.modify_time = datetime.now()
            obj.save()
        except ValidationError as ve:
            error('%s', ve)
        except StateIsNotTaskProgress:
            pass #do nothing,


class NotesTimelineInterceptor(SaveOnlyInterceptorMixin, InterceptorBase):
    model = NotesTimeline

    def params_for_get(self, instance):
        kwargs = dict(instance)
        del kwargs['referenced_by']
        return kwargs

    def receiver_method(self, sender, **kwargs):
        try:
            obj = self.get_object(kwargs['instance'])
            obj.save()
        except ValidationError as ve:
            error('%s', ve)


interceptor_registry = InterceptorDispatcher()