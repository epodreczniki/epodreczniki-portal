import json
from django.conf import settings
import pika
from contextlib import contextmanager
import functools

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


@contextmanager
def new_channel():
    connection = None
    try:
        parameters = pika.URLParameters(settings.EPO_MESSAGING_CONNECTION_URL)
        connection = pika.BlockingConnection(parameters)
        yield connection.channel()
    finally:
        if connection:
            connection.close()


def publish(body, routing_key, exchange=None, content_type='text/plain', delivery_mode=2):

    if not settings.EPO_MESSAGING_ENABLE:
        warning('ignoring publishing message %s due to EPO_MESSAGING_ENABLE setting', routing_key)
        return

    if exchange is None:
        exchange = settings.EPO_MESSAGING_DEFAULT_EXCHANGE

    debug('publishing %s: %s', routing_key, body)
    with new_channel() as channel:

        channel.basic_publish(exchange, routing_key, body, pika.BasicProperties(content_type=content_type, delivery_mode=delivery_mode))


def publish_json(event_name, subsystem='portal', **kwargs):
    publish(json.dumps(kwargs), routing_key='%s.%s.%s' % (subsystem, settings.INSTANCE_NAME, event_name), content_type='application/json')


class RegistryException(Exception):
    pass


class Registry(object):

    def __init__(self):
        self.callbacks = {}


    def register(self, mask, callback):
        # debug("registering %s callback", mask)
        self.callbacks[mask] = callback


    def json_callback(self, callback):

        @functools.wraps(callback)
        def wrapped(channel, method_frame, header_frame, body):
            if header_frame.content_type == 'application/octet-stream' or header_frame.content_type == 'text/plain' or header_frame.content_type is None:
                warning('trying to interpret as json message with content-type: %s', header_frame.content_type)
                content = json.loads(body)
            elif header_frame.content_type == 'application/json':
                content = json.loads(body)
            else:
                raise RegistryException('invalid content type: %s' % header_frame.content_type)

            callback(**content)

        self.register(callback.__name__.replace('_', '.'), wrapped)

        return callback

    def plain_text_callback(self, callback):

        @functools.wraps(callback)
        def wrapped(channel, method_frame, header_frame, body):
            if header_frame.content_type != 'text/plain':
                warning('trying to interpret as json message with content-type: %s', header_frame.content_type)

            callback(body)

        self.register(callback.__name__.replace('_', '.'), wrapped)

        return callback


    def process(self, channel, method_frame, header_frame, body):
        if method_frame is None:
            return
        routing_key = method_frame.routing_key

        key = str('.'.join(routing_key.split('.')[-2:]))
        info('received: %s (%r) : %s', routing_key, key, body)

        try:
            try:
                callback = self.callbacks[key]
            except KeyError as e:
                raise RegistryException('no callback for: %s found in %s' % (key, self))

            callback(channel, method_frame, header_frame, body)
            channel.basic_ack(method_frame.delivery_tag)
        except Exception as e:
            error('failed to process message %s: %s', body, e)
            channel.basic_reject(method_frame.delivery_tag, requeue=False)


def repeat_json_message(subsystem):

    def wrapper(func):
        name = func.__name__.replace('_', '.')

        @functools.wraps(func)
        def wrapped(**kwargs):
            try:
                func(**kwargs)
            finally:
                publish_json(name, subsystem=subsystem, **kwargs)

        return wrapped

    return wrapper
