from api.utils import get_docs
from django.contrib.sitemaps import Sitemap
from django.contrib.sites.models import Site
from django_hosts import reverse_full
from django_hosts import reverse_host

class DevSitemap(Sitemap):
    priority = 0.5
    lastmod = None
    location = ""

    def items(self):

        docs = get_docs('dev', 'http', None)

        result = [
                dict(location="/"),
                dict(location="/home/", changefreq='yearly'),
                dict(location="/version/", changefreq='yearly'),
                dict(location="/format/", changefreq='yearly'),
                dict(location="/source_formats/", changefreq='yearly'),
                dict(location="/index/", changefreq='yearly'),
        ]

        for api in docs:
                path = "/details/?model="+api.id_hash
                result.append(dict(location=path))

        return result

    def get_urls(self, page=1, site=None, protocol=None):
        dev_site = Site(domain=reverse_host('dev'), name='dev')
        return super(DevSitemap, self).get_urls(page, dev_site)

    def location(self, item):
        return item.get('location')

    def changefreq(self, item):
        return item.get('changefreq', 'monthly')
