from django.conf import settings
from surround.django.decorators import legacy_cache_page

def search_cache_page(time=settings.DEFAULT_CACHE_TIME):
    return legacy_cache_page(timeout=time)

