from optparse import make_option

from django.core.management.base import BaseCommand
from reader import build_tools


class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('-p', '--path', action='store', dest='path', default=None,
                    type='string',
                    help='path of package destination'),
        make_option('-c', '--create-static', action='store', dest='create_static', default='yes',
                    type='string',
                    help='create static files'),
    )

    def handle(self, *args, **options):
        create_static = options['create_static'] == 'yes'
        build_tools.build_ge_reader_package(args, options['path'], create_static)
