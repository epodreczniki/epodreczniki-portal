from __future__ import absolute_import
import os

EPO_CASSANDRA_ACTIVE = EPO_CASSANDRA_SETTINGS is not None and EPO_ENABLE_USERAPI and EPO_ZONE_USER

if EPO_CASSANDRA_ACTIVE:

    SURROUND_HEALTH_SERVICES += (
        ('userapi', 'surround.django.health.backends.constant.Check', {'value': True}),
    )

    if "EPO_CASSANDRA_ADMIN_CONFIG" in os.environ:
        EPO_NORMAL_CASSANDRA_ACCESS_SETTINGS = {}
        EPO_NORMAL_CASSANDRA_ACCESS_SETTINGS.update(EPO_CASSANDRA_SETTINGS)
        from ..cassandradb.admin import EPO_CASSANDRA_SETTINGS as EPO_CASSANDRA_ADMIN_SETTINGS
        EPO_CASSANDRA_SETTINGS['USER'] = EPO_CASSANDRA_ADMIN_SETTINGS['USER']
        EPO_CASSANDRA_SETTINGS['PASSWORD'] = EPO_CASSANDRA_ADMIN_SETTINGS['PASSWORD']

    from cassandra import ConsistencyLevel

    def valid_db_name(instance_name):
        return 'epo_%s' % instance_name.replace('-', '_')

    DATABASES['cassandra'] = {
        'ENGINE': 'django_cassandra_engine',
        'NAME': valid_db_name(INSTANCE_NAME),
        'OPTIONS': {
            'replication': {
                'strategy_class': 'NetworkTopologyStrategy',
                'replication_factor': 1,
                'datacenter1': 1
            },
            'connection': {
                'consistency': ConsistencyLevel.ONE,
                'lazy_connect': True,
                'retry_connect': True
                # + All connection options for cassandra.cluster.Cluster()
            },
            'session': {
                'default_timeout': 10,
                'default_fetch_size': 10000
                # + All options for cassandra.cluster.Session()
            }
        }
    }
    # it is put before other plugins due to:
    # http://r4fek.github.io/django-cassandra-engine/faq/
    INSTALLED_APPS = ('django_cassandra_engine',) + INSTALLED_APPS

    DATABASES['cassandra'].update(EPO_CASSANDRA_SETTINGS)

    from cassandra import ConsistencyLevel
    SURROUND_HEALTH_SERVICES += (
        ('cassandraquorum', 'userapi.health.Check', {'consistency': ConsistencyLevel.QUORUM}),
        ('cassandraall', 'userapi.health.Check', {'consistency': ConsistencyLevel.ALL}),
    )
