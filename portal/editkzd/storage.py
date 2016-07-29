from django.core.files.storage import FileSystemStorage
import os
import os.path
from django.conf import settings


class Storage(object):

    location = settings.EPO_KZD_EDITOR_STORAGE_LOCATION + '/resources'

    @classmethod
    def prepare(cls):
        if cls.location is not None:
            if not os.path.isdir(cls.location):
                os.makedirs(cls.location)
                print('created directory: %s' % cls.location)

    @classmethod
    def get(cls):
        return FileSystemStorage(location=cls.location)

Storage.prepare()

