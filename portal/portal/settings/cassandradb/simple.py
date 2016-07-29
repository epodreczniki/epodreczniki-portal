from cassandra import ConsistencyLevel

EPO_CASSANDRA_SETTINGS = {
    'USER': 'epo',
    'PASSWORD': 'epo',
    'HOST': '192.168.1.55',
    'OPTIONS': {
        'replication': {
            'strategy_class': 'SimpleStrategy',
            'replication_factor': 1,
            'DC1': 1
        },
        'connection': {
            'consistency': ConsistencyLevel.ONE,
            'lazy_connect': True,
            'retry_connect': True
        },
        'session': {
            'default_timeout': 10,
            'default_fetch_size': 10000
        }
    }
}
