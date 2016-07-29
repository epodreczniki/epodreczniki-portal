from django.core.files.storage import FileSystemStorage
import os
import os.path
from django.conf import settings

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

class Storage(object):

    location = None

    @classmethod
    def prepare(cls):

        if cls.location is not None:
            for d in [cls.location] + ['%s/%s' % (cls.location, c) for c in ['collection', 'module', 'womi']]:
                if not os.path.isdir(d):
                    os.makedirs(d)
                    print('created directory: %s' % d)

    @classmethod
    def get(cls):
        return FileSystemStorage(location=cls.location)

