from django.contrib.sitemaps import Sitemap

class FrontSitemap(Sitemap):
    priority = 0.5
    lastmod = None

    def items(self):
        return [
                dict(location="/front/about"),
                dict(location="/front/terms"),
                dict(location="/front/statistics", changefreq="weekly"),
                dict(location="/front/support"),
                dict(location="/front/privacy"),
                dict(location="/front"),
                dict(location="/sitemap-dev.xml", changefreq="monthly")
            ]

    def location(self, item):
        return item.get('location')

    def changefreq(self, item):
        return item.get('changefreq', 'monthly')
