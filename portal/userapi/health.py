from __future__ import absolute_import
from surround.django.health.backends import base
from userapi.models import HealthCheck
from uuid import uuid4

#from surround.django.logging import setupModuleLogger
#setupModuleLogger(globals())


class Check(base.Check):

    def __init__(self, consistency):
        self.consistency = consistency

    def check(self):
        myid = str(uuid4())
        value = str(uuid4())
        #debug("trying to set store and get from cassandra db: %s:%s" % (myid, value))

        if HealthCheck.objects.consistency(self.consistency).filter(myid = myid).count() == 0:
            HealthCheck(myid=myid, value=value).consistency(self.consistency).save()
            el = HealthCheck.objects.consistency(self.consistency).get(myid=myid)
            if el.value != value:
                raise Exception('Value saved in cassandra database differ from one restored')
            el.delete()
        else:
            raise Exception('random object exists already in cassandra database')


