from django.core.management.base import BaseCommand, CommandError
from optparse import make_option
from django.conf import settings
from editsearch import utils

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


class Command(BaseCommand):
    help = 'Manipulating elasticsearch index for editor search'

    option_list = BaseCommand.option_list + (
        make_option('--raw',
            action='store',
            dest='raw',
            default=None,
            help='raw query'),
    )


    def handle(self, *args, **options):
        self.options=type('options', (object, ), options)

        if not settings.EPO_ENABLE_EDITSEARCH:
            raise CommandError('editor search is disabled')

        editsearch_driver = utils.get_index_driver()

        query = None
        if self.options.raw:
            query = self.options.raw

        results = editsearch_driver.query_index(query=query)
        for result in results:
            print(result)


