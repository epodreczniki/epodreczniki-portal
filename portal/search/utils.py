import hashlib
from datetime import datetime

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[-1].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


class QueryMetric:
    query = None

    def __init__(self, request):
        self.query = request.GET.get('q')

    def __str__(self):
        return "query_metric: { %s: { query: \"%s\"}}" % (self.get_md5(), self.query)

    def get_md5(self):
        m = hashlib.md5()
        if (self.query):
            m.update(self.query.encode('utf-8'))
        return m.hexdigest()


class RequestMetric:
    client_ip = None
    client_agent = None
    user = None
    query_hash = None

    def __init__(self, request, query_hash):
        self.query_hash = query_hash
        self.client_ip = get_client_ip(request)
        self.client_agent = request.META['HTTP_USER_AGENT']

    def __str__(self):
        return "request_metric: { %s: { query: \"%s\", client_ip: \"%s\", client_agent: \"%s\", user: \"%s\"}}" % \
               (self.get_md5(), self.query_hash, self.client_ip, self.client_agent, self.user)

    def get_md5(self):
        m = hashlib.md5()
        if (self.query_hash):
            m.update(self.query_hash)
        if (self.user):
            m.update(self.user.encode('utf-8'))
        if (self.client_ip):
            m.update(self.client_ip.encode('utf-8') )
        if (self.client_agent):
            m.update(self.client_agent.encode('utf-8') )
        return m.hexdigest()



class SolrMetric:
    date = None
    request_hash = None
    query_hash = None
    solr_error = None
    num_pages = None
    page = None
    total_count = None
    processing_time = None
    request_time = None

    def __init__(self, request_hash, query_hash):
        self.request_hash = request_hash
        self.query_hash = query_hash
        self.date = datetime.now()

    def __str__(self):
        return "solr_metric: { date: \"%s\", processing_time: %s, request_time: %s, query: \"%s\", request: %s, solr_error: \"%s\", num_pages: %s, page: %s, total_count: %s}}" % \
               (self.date, self.processing_time, self.request_time, self.query_hash, self.request_hash, self.solr_error, self.num_pages, self.page, self.total_count)
