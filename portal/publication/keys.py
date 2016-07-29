from surround.django.utils import CacheKey

app = CacheKey('publication')
cache = app + 'cache'
db = app + 'db'

publication = cache + 'c:{category}:i:{identifier}:v:{version}:a:{aspect}'

relations = db + 'c:{category}:i:{identifier}:v:{version}:a:{aspect}'
