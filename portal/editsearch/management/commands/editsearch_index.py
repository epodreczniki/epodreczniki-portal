from __future__ import print_function

from django.core.management.base import BaseCommand, CommandError
from optparse import make_option
from django.conf import settings
from editsearch import utils
import editcommon.objects
from editsearch.utils import ElementIdBinder
from editsearch import tasks

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


class Command(BaseCommand):
    help = 'Manipulating elasticsearch index for editor search'

    option_list = BaseCommand.option_list + (
        make_option('--create',
            action='store_true',
            dest='create',
            default=False,
            help='create index'),
        make_option('--delete',
            action='store_true',
            dest='delete',
            default=False,
            help='delete index'),
        make_option('--index',
            action='append',
            dest='index_orders',
            default=[],
            help='objects to index, like: module:ig345hk4:1'),
        make_option('--remove',
            action='append',
            dest='remove_orders',
            default=[],
            help='objects to remove from index, like: module:ig345hk4:1'),
        make_option('--recursive',
            action='store_true',
            dest='recursive',
            default=False,
            help='index in recursive mode'),
        make_option('--repository',
            action='append',
            dest='repositories',
            default=[],
            help='repositories to scan for objects'),
        make_option('--category',
            action='store',
            dest='category',
            default=None,
            help='category to scan, default: all'),
        make_option('--edition',
            action='store_true',
            dest='edition',
            default=False,
            help='repositories to scan for objects'),
        make_option('--all',
            action='store_true',
            dest='all',
            default=False,
            help='index all'),
        make_option('--stats',
            action='store_true',
            dest='stats',
            default=False,
            help='print basic stats'),
        make_option('--shell',
            action='store_true',
            dest='shell',
            default=False,
            help='fire shell'),
        make_option('--kzd',
            action='store_true',
            dest='kzd',
            default=False,
            help='scan KZD'),
    )

    def handle(self, *args, **options):
        self.options=type('options', (object, ), options)

        if not settings.EPO_ENABLE_EDITSEARCH:
            raise CommandError('editor search is disabled')

        editsearch_driver = utils.get_index_driver()

        if self.options.delete:
            try:
                editsearch_driver.delete_index()
            except Exception as e:
                error('could not delete index: %s', e)
                raise

        if self.options.create:
            try:
                editsearch_driver.create_index()
                editsearch_driver.prepare_index()
            except Exception as e:
                error('could not create index: %s', e)
                raise

        if self.options.edition or self.options.repositories or self.options.all:
            editsearch_driver.index_in_batches(editsearch_driver.list_source(edition=self.options.edition, repositories=self.options.repositories, all=self.options.all, category=self.options.category))

        if self.options.kzd:
            editsearch_driver.index_kzd()

        for order in self.options.index_orders:
            try:
                category, identifier, version = order.split(':')
                editsearch_driver.index_object(editcommon.objects.drivers.bind(category, identifier, version), self.options.recursive)
            except Exception as e:
                error('could not index data: %s', e)
                raise

        for order in self.options.remove_orders:
            try:
                category, identifier, version = order.split(':')
                editsearch_driver.remove_object(ElementIdBinder(category, identifier, version), self.options.recursive)
            except Exception as e:
                error('could not index data: %s', e)
                raise

        if self.options.stats:
            for category in ('collection', 'module', 'womi'):
                print('indexed objects of type %s: %s' % (category, editsearch_driver.objects.filter(category=category).count()))

            print('indexed kzd womis: %s' % editsearch_driver.objects.filter(category='womi', purpose='kzd').count())
            print('indexed kzd embedded womis: %s' % editsearch_driver.objects.filter(category='womi', purpose='kzd_embedded').count())

        if self.options.shell:
            from IPython import embed ; embed()
