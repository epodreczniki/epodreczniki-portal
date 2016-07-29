import kombu

BROKER_URL = None

if not SURROUND_RUNNING_ON_PLATFORM:
    if EPO_DEV_CELERY_MODE == 'eager':
        BROKER_URL = 'django://'
        CELERY_ALWAYS_EAGER = True
    elif EPO_DEV_CELERY_MODE == 'django':
        raise Exception('this is broken')
        # RuntimeError: Conflicting 'queue' models in application 'kombu_transport_django': <class 'kombu.transport.django.models.Queue'> and <class 'djcelery.transport.models.Queue'>
        BROKER_URL = 'django://'
        INSTALLED_APPS += ('djcelery.transport',)
        # INSTALLED_APPS += ('kombu.transport.django', )
    elif EPO_DEV_CELERY_MODE == 'amqp':
        # the catch call below works
        pass
    else:
        raise Exception('invalid value of EPO_DEV_CELERY_MODE setting: %s' % EPO_DEV_CELERY_MODE)

if BROKER_URL is None:


CELERY_QUEUES = []

for role in ["static", "app"]:
    for host in HOSTS[role]:
        queue = '%s-%s' % (role, host)
        CELERY_QUEUES.append(kombu.Queue(queue, routing_key=queue))

CELERY_QUEUES.append(kombu.Queue("static", routing_key='static'))
CELERY_QUEUES.append(kombu.Queue("app", routing_key='app'))
CELERY_QUEUES.append(kombu.Queue("publisher", routing_key='publisher'))
CELERY_QUEUES.append(kombu.Queue("indexer", routing_key='indexer'))
CELERY_QUEUES.append(kombu.Queue("mailer", routing_key='mailer'))
CELERY_QUEUES.append(kombu.Queue("warmer", routing_key='warmer'))
CELERY_QUEUES.append(kombu.Queue("purger", routing_key='purger'))
CELERY_QUEUES.append(kombu.Queue("celery", routing_key='default'))

CELERY_ACCEPT_CONTENT = ['pickle', 'json', 'msgpack', 'yaml']
