from cassandra.cqlengine.connection import execute
from django.conf import settings
from django.db import connections
from django_cassandra_engine.management.commands import sync_cassandra

GRANT_PATTERN = 'grant %s on keyspace %s to %s'

class Command(sync_cassandra.Command):

    def sync(self, alias):
        super(Command, self).sync(alias)

        if hasattr(settings, 'EPO_NORMAL_CASSANDRA_ACCESS_SETTINGS'):
            user = settings.EPO_NORMAL_CASSANDRA_ACCESS_SETTINGS['USER']
            connection = connections[alias]
            keyspace = connection.settings_dict['NAME']
            execute(GRANT_PATTERN % ('select', keyspace, user))
            execute(GRANT_PATTERN % ('modify', keyspace, user))
