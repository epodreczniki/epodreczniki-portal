# coding=utf-8
from __future__ import absolute_import
import time
from django.template import loader, Context
from surround.django import redis
import pickle
from . import keys
from django.utils.functional import cached_property
from django_hosts import reverse_full
import functools

from contextlib import contextmanager
from threading import local

thread_local = local()


class StreamMixin(object):

     @property
     def stream_key(self):
         raise NotImplementedError('stream_key in %s' % self.__class__.__name__)

     @cached_property
     def stream_fetch_url(self):
         return reverse_full('www', 'editres_stream_provider', view_kwargs={ 'stream_key': self.stream_key })

     def fetch_stream(self, max_count=10):
         return fetch_stream_history(self.stream_key, max_count=max_count)


class HistoryEntry(object):

    def __init__(self, content, streams, style=None, moment=None):
        self.content = content
        self.streams = streams
        self.style = style
        self.moment = int(time.time()) if moment is None else moment


    def __reduce__(self):
        return (self.__class__, (self.content, self.streams, self.style, self.moment))


def push_entry(template_name, context, streams, style=None):
    template = loader.get_template('editres/history/' + template_name)
    entry = HistoryEntry(content=template.render(Context(context)), streams=[stream.stream_key for stream in streams], style=style)

    pickled = pickle.dumps(entry)
    r = redis.get_connection()
    pipe = r.pipeline()

    for stream in streams:
        pipe.lpush(keys.stream(stream.stream_key), pickled)

    pipe.execute()

    aggregator = getattr(thread_local, 'aggregator', None)
    if aggregator is not None:
        aggregator.append(entry)

def fetch_stream_history(stream_key, max_count=10):

    return map(pickle.loads, redis.get_connection().lrange(keys.stream(stream_key), 0, max_count - 1))


def aggregate_history_entries(view):

    @functools.wraps(view)
    def wrapped(request, *args, **kwargs):
        request.history_aggregator = []
        thread_local.aggregator = request.history_aggregator
        try:
            return view(request, *args, **kwargs)
        finally:
            thread_local.aggregator = None

    return wrapped



