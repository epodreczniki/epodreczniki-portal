#!/usr/bin/env python

from portal.settings.misc.utils import django_project_path_join
from django.conf import settings
from django.core import management
from django.core.management.base import BaseCommand
import os

class Command(BaseCommand):

    def handle(self, *args, **options):
        print("This command needs to be tested...")
        for app in settings.PROJECT_APPS:
            p = django_project_path_join(app)
            print("Making messages in: %s" % p)
            os.chdir(p)
            management.call_command('makemessages', all=True, no_wrap=True)
            management.call_command('compilemessages')

