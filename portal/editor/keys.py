from surround.django.utils import CacheKey


platform = CacheKey('platform:editor')

editor = platform + 'editor'
folders = platform + 'folders'
search = platform + 'search'
