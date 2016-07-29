import json
from editsearch import utils
from django.http import JsonResponse
from surround.django.simple_cors.decorators import cors_headers


@cors_headers(profile='search')
def query_repo(request):
    driver = utils.get_index_driver()
    return JsonResponse(driver.query_index(query=json.loads(request.body)), safe=False)

