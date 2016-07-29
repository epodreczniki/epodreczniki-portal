# coding=utf-8
from auth.exceptions import EntityTooLargeException
from cassandra.cqlengine import ValidationError
from cassandra.cqlengine.query import DoesNotExist
from django.http import Http404, HttpResponseBadRequest
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from surround.django.logging import setupModuleLogger
from surround.django.simple_cors.decorators import cors_headers
from userapi.interceptors import interceptor_registry

setupModuleLogger(globals())


class CQLRestAPIView(GenericAPIView):
    interceptors = None

    enable_cors = True

    def __init__(self, **kwargs):
        super(CQLRestAPIView, self).__init__(**kwargs)
        if isinstance(self.interceptors, list):
            for interceptor in self.interceptors:
                interceptor_registry.register_interceptor(self.model, interceptor)

    def get_multiple_objects(self, request, *args, **kwargs):
        return self.model.objects.filter(**self.kwargs_parser('get', request, *args, **kwargs))

    def get_single_object(self, request, *args, **kwargs):
        return self.model.objects.get(**self.kwargs_parser('get', request, *args, **kwargs))

    def create_single_object(self, request, *args, **kwargs):
        #return self.model.objects.create(**self.kwargs_parser('create', request, *args, **kwargs))
        return self.model(**self.kwargs_parser('create', request, *args, **kwargs))

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {}

    def create_additional_kwargs(self, request, *args, **kwargs):
        return {}

    def filter_kwargs(self, **kwargs):
        return kwargs

    def redefine_filter(self, params):
        new_params = {}
        for key, value in params.iteritems():
            if isinstance(value, list):
                new_params['%s__in' % key] = value
            else:
                new_params[key] = value

        return new_params

    def kwargs_parser(self, method, request, *args, **kwargs):
        all = {}
        all.update(self.filter_kwargs(**kwargs))
        kwargs_update_method = getattr(self, '%s_additional_kwargs' % method)
        all.update(kwargs_update_method(request, *args, **kwargs))
        return self.redefine_filter(all)

    def get_context_query_params(self, request):
        params = {}
        if hasattr(self, 'context_query_params'):
            for param in self.context_query_params:
                if param in request.GET:
                    params[param] = request.GET[param]

        return params

    @classmethod
    def as_view(cls, **initkwargs):
        av = super(CQLRestAPIView, cls).as_view(**initkwargs)
        if cls.enable_cors:
            return cors_headers(profile='userapi')(av)
        else:
            return av


class RetrieveCQLMixin(object):
    def get(self, request, *args, **kwargs):
        try:
            single_object = self.get_single_object(request, *args, **kwargs)
        except DoesNotExist:
            raise Http404()
        serializer = self.serializer_class(single_object)
        return Response(serializer.data)


class UpdateCQLMixin(object):
    def _update(self, request, *args, **kwargs):
        try:
            single_object = self.get_single_object(request, *args, **kwargs)
        except DoesNotExist:
            single_object = None

        try:
            if single_object is None:
                single_object = self.create_single_object(request, *args, **kwargs)

            self.update_single_object(single_object, request, *args, **kwargs)
            self.intercept_object(single_object, request, *args, **kwargs)
        except ValidationError as ve:
            error('%s', ve)
            return HttpResponseBadRequest()
        except EntityTooLargeException:
            return Response(status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)

        single_object.save()

        serializer = self.serializer_class(single_object)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        return self._update(request, *args, **kwargs)

    def update_single_object(self, single_object, request, *args, **kwargs):
        pass

    def intercept_object(self, single_object, request, *args, **kwargs):
        pass


class DeleteCQLMixin(object):
    def delete(self, request, *args, **kwargs):
        try:
            single_object = self.get_single_object(request, *args, **kwargs)
            single_object.delete()
            return Response({'status': 'deleted'})
        except DoesNotExist:
            raise Http404()


class RetrieveUpdateDestroyAPIView(RetrieveCQLMixin, UpdateCQLMixin, DeleteCQLMixin, CQLRestAPIView):
    pass


class RetrieveUpdateAPIView(RetrieveCQLMixin, UpdateCQLMixin, CQLRestAPIView):
    pass


class UpdateAPIView(UpdateCQLMixin, CQLRestAPIView):
    def put(self, request, *args, **kwargs):
        return self._update(request, *args, **kwargs)


class PostDestroyAPIView(UpdateCQLMixin, DeleteCQLMixin, CQLRestAPIView):
    def post(self, request, *args, **kwargs):
        return self._update(request, *args, **kwargs)


class ListAPIView(CQLRestAPIView):
    default_limit = None

    filters = None

    # def __init__(self, filters=None, *args, **kwargs):
    #     super(ListAPIView, self).__init__(**kwargs)
    #     self.filters = filters

    def get_context(self, request):
        use_related = 'no'
        if hasattr(self, 'use_related'):
            use_related = self.use_related

        ctx = {
            'use_related': use_related
        }

        ctx.update(self.get_context_query_params(request))

        return ctx

    def check_object_for_filter(self, object_to_check, filter_key, filter_val):
        is_valid = True

        if filter_key.endswith("__gt"):
            filter_key = filter_key[0:filter_key.rfind("__gt")]
            if getattr(object_to_check, filter_key) < filter_val:
                is_valid = False
        elif filter_key.endswith("__lt"):
            filter_key = filter_key[0:filter_key.rfind("__lt")]
            if getattr(object_to_check, filter_key) > filter_val:
                is_valid = False
        elif getattr(object_to_check, filter_key) != filter_val:
            is_valid = False

        return is_valid

    def post_filter(self, objects, filters):
        if filters:
            new_objects = []
            for o in objects:
                is_valid = True
                for key, val in filters.iteritems():
                    if is_valid:
                        is_valid = self.check_object_for_filter(o, key, val)
                if is_valid:
                    new_objects.append(o)
            return new_objects
        return objects

    def get(self, request, *args, **kwargs):
        try:
            objects = self.get_multiple_objects(request, *args, **kwargs)
            objects = self.post_filter(objects, self.filters)
            if self.default_limit:
                objects = objects[:self.default_limit]
        except DoesNotExist:
            raise Http404()
        serializer = self.serializer_class(objects, many=True, context=self.get_context(request))
        return Response(serializer.data)
