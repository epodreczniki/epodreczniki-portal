from __future__ import absolute_import

from celery import shared_task
from front.utils import regenerate_statistics_data,get_statistics_api
from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())
import socket, time

@shared_task(ignore_result=True)
def regenerate_statistics():
    regenerate_statistics_data()


@shared_task( ignore_result=True)
def feed_collectd_from_piwik():
    from django.conf import settings
    if settings.GRAPHITE_HOST:
      t = time.mktime(time.localtime()) 
      s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      val = get_statistics_api('Live.getCounters', dict(lastMinutes=1))
      if len(val) > 0:
        name = "stats.%s.piwik.Live." % settings.INSTANCE_NAME
        s.connect((settings.GRAPHITE_HOST, settings.GRAPHITE_PORT))
        for k, v in val[0].items():
            tosend = "%s%s %s %d\n" % (name, k, v, int(t))
            s.send(tosend)
            #info("sending nfo: %s" % tosend)
        s.close()

