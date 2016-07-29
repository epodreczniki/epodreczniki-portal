from django.core.management.base import BaseCommand
from common.management import dumpbase
from optparse import make_option
from portal.settings.misc import utils
import os

class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('-f', '--fixtures',
            action='store_true',
            dest='fixtures',
            default=False,
            help='restore fixtures'),
        make_option('-k', '--keep',
            action='store_true',
            dest='keep',
            default=False,
            help='keep old database'),
        )

    def handle(self, *args, **options):

        if not options['keep']:
            try:
                print('removing database')
                os.remove(utils.django_project_path_join('sqlite.db'))
            except:
                pass

        dumpbase.sync_db()
        if options['fixtures']:
            dumpbase.restore_fixtures()
        else:
            dumpbase.restore_db()
            dumpbase.install_django_sites()


