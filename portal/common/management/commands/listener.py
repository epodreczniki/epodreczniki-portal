from __future__ import print_function, absolute_import
from django.core.management.base import BaseCommand
from optparse import make_option
from django.conf import settings
from common import messaging
import pika

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('-r', '--run',
            action='store_const',
            dest='operation',
            const='run',
            help='run'),
        make_option('-f', '--fetch',
            action='store_const',
            dest='operation',
            const='fetch',
            help='run'),
        make_option('-x', '--exchange',
            action='store',
            dest='exchange',
            default=settings.EPO_MESSAGING_DEFAULT_EXCHANGE,
            help='exchange name'),
        make_option('-q', '--queue',
            action='store',
            dest='queue',
            default=settings.EPO_MESSAGING_DEFAULT_QUEUE,
            help='queue name'),
        )


    def handle(self, *args, **options):
        self.options=type('options', (object, ), options)

        with messaging.new_channel() as channel:

            channel.exchange_declare(exchange=self.options.exchange, passive=True)

            declared_queue = channel.queue_declare(self.options.queue, passive=True)

            info('ready for consuming from queue %s', self.options.queue)
            from preview.messages import registry

            if self.options.operation == 'fetch':
                method_frame, header_frame, body = channel.basic_get(self.options.queue)
                registry.process(channel, method_frame, header_frame, body)

            elif self.options.operation == 'run':
                channel.basic_consume(registry.process, queue=self.options.queue, no_ack=False)

                try:
                    channel.start_consuming()
                except KeyboardInterrupt:
                    channel.stop_consuming()

