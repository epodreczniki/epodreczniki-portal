from surround.django.utils import CacheKey

app = CacheKey('editstore')

objects = app + 'objects'
subdomain = app + 'subdomain'
api = app + 'api'

locks = CacheKey('locks')
object_lock = locks + 'c:{category}:i:{identifier}:v:{version}'
app_lock = locks + 'a:{appid}'

streams = CacheKey('editstore-streams')

stream = streams + 'k:{key}'

