from surround.django.utils import CacheKey
preview = CacheKey('preview')
collection_lines = CacheKey('preview:c')
collection_line = collection_lines + '{collection_id}'
collection_line_versions = collection_line + 'v'
collection_control = CacheKey('preview:c:{collection_id}:v:{version}:control')
import_root = preview + 'import'

platform = CacheKey('platform:preview')

subdomain = CacheKey('preview:subdomain')
