import store.storage
from django.conf import settings

class Storage(store.storage.Storage):

    name = 'edition'
    location = settings.EPO_EDITOR_STORAGE_LOCATION

Storage.prepare()

