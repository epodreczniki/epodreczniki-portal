from django.core.management.base import BaseCommand
from common.management import dumpbase
from portal.settings.misc.utils import project_path_join


class Command(BaseCommand):
    def handle(self, *args, **options):
        print('loading portal state')
        dumpbase.restore_db_simple('db.state')




