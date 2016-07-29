# coding=utf-8
from __future__ import print_function
from django.core.management.base import BaseCommand, CommandError
from optparse import make_option
from django.conf import settings
import os
import os.path

import platform
import logging
import re

try:
    import subprocess32 as subprocess
    subprocess_with_timeout = True
    subprocess_exceptions = (subprocess.CalledProcessError, subprocess.TimeoutExpired)
except ImportError:
    import subprocess
    subprocess_with_timeout = False
    subprocess_exceptions = subprocess.CalledProcessError

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

COLLECTION_RESERVATION_MATCHER = re.compile('^\d+$')

class Command(BaseCommand):
    option_list = BaseCommand.option_list + (
        make_option('-d', '--directory',
            action='store',
            dest='directory',
            default=None,
            help='directory to work with'),
        make_option('--extract-identifier',
            action='store_true',
            dest='extract_identifier',
            default=False,
            help='whether to extract generated identifier'),
        )

    def handle(self, *args, **options):
        self.options = type('options', (object, ), options)
        logger = logging.getLogger('epo.repo.advanced.driver')

        is_windows = (platform.system() == 'Windows')

        arguments = [self.options.directory]
        logger.info('calling with arguments: %s', ' '.join(arguments))

        uploader_path = os.path.join(settings.EPO_REPO_ADVANCED_TOOLS_PATH, 'uploader')
        if not os.path.exists(os.path.join(uploader_path, 'config.properties')):
            raise CommandError('epodreczniki-eprt-tools is missing')

        os.chdir(uploader_path)
        command = (['uploader.bat'] if is_windows else ['bash', 'uploader.sh']) + [settings.EPO_REPO_ADVANCED_USER, settings.EPO_REPO_ADVANCED_PASSWORD] + arguments
        try:
            timeout_kwargs = { 'timeout': 60 * 2 } if subprocess_with_timeout else {}
            output = subprocess.check_output(command, **timeout_kwargs)
            lines = output.split('\n')
            for line in lines:
                logger.info(line)

            if self.options.extract_identifier:
                matches = list(map(lambda x: x.group(0), filter(lambda x: x is not None, map(COLLECTION_RESERVATION_MATCHER.match, lines))))

                if len(matches) == 0:
                    error('no identifier match in collection reservation')
                    return 1

                if len(matches) > 1:
                    error('more than one identifier match in collection reservation: %s' % matches)
                    return 1

                # this print here has to be print - it is read by the caller
                print(matches[0])

            return 0
        except subprocess_exceptions as e:
            returncode = getattr(e, 'returncode', 'timeout')
            logger.error('failed to call: %s', returncode)
            for line in e.output.split('\n'):
                logger.error(line)
            return returncode



