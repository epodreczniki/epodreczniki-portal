from optparse import make_option
from django.core.management import BaseCommand
from search.tasks import remove_all, index_collection, remove_collection, index_all_collections, \
    reindex_all, remove_unpublished_collections
from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


class Command(BaseCommand):
    help = 'Manipulating SOLR index for full text search'

    option_list = BaseCommand.option_list + (
        make_option('--index',
            action='append',
            dest='index_collections',
            default=[],
            help='collection objects to index, like: ig345hk4:1:student'),
        make_option('--remove',
            action='append',
            dest='remove_collections',
            default=[],
            help='collection objects to remove from index, like: ig345hk4:1:teacher'),
        make_option('--all',
            action='store_true',
            dest='all',
            default=False,
            help='index all'),
        make_option('--refresh',
            action='store_true',
            dest='refresh',
            default=False,
            help='reindex all'),
        make_option('--force_refresh',
            action='store_true',
            dest='force_refresh',
            default=False,
            help='remove and reindex all'),
        make_option('--clear',
            action='store_true',
            dest='clear',
            default=False,
            help='clear all from index repository'),
        make_option('--purge',
            action='store_true',
            dest='purge',
            default=False,
            help='remove unused (unpublished) from index repository'),
        make_option('--shell',
            action='store_true',
            dest='shell',
            default=False,
            help='fire shell (you know, for wise man)'),
    )

    def handle(self, *args, **options):
        self.options=type('options', (object, ), options)

        #if not settings.EPO_ENABLE_SEARCH:
        #    raise CommandError('search is disabled')

        if self.options.clear:
            try:
                remove_all()
            except Exception as e:
                error('could not delete index: %s', e)
                raise

        if self.options.purge:
            try:
                remove_unpublished_collections()
            except Exception as e:
                error('could not purge unpublished: %s', e)
                raise

        if self.options.refresh:
            try:
                reindex_all()
            except Exception as e:
                error('could not reindex: %s', e)
                raise

        if self.options.force_refresh:
            try:
                reindex_all(True)
            except Exception as e:
                error('could not reindex: %s', e)
                raise

        if self.options.all:
            try:
                index_all_collections()
            except Exception as e:
                error('could not delete: %s', e)
                raise

        for collection in self.options.index_collections:
            try:
                collection_def = collection.split(':')
                if len(collection_def) > 2:
                    index_collection(collection_def[0], collection_def[1], collection_def[2])
                else:
                    index_collection(collection_def[0], collection_def[1])
            except Exception as e:
                error('could not index data: %s', e)
                raise

        for collection in self.options.remove_collections:
            try:
                identifier, version, variant = collection.split(':')
                remove_collection(identifier, version, variant)
            except Exception as e:
                error('could not index data: %s', e)
                raise

        if self.options.shell:
            from IPython import embed ; embed()
