
EPO_MESSAGING_DEFAULT_EXCHANGE = 'ex.message'
EPO_MESSAGING_DEFAULT_QUEUE = 'portal.' + INSTANCE_NAME
EPO_MESSAGING_CONNECTION_URL = 'amqp://%s:%s@192.168.1.53:5672/epo' % (EPO_MESSAGING_USER, EPO_MESSAGING_PASSWORD)
