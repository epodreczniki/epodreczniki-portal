from django.contrib.sitemaps import Sitemap
from common.models import Collection
from django.core.urlresolvers import reverse

class AbstractReaderContentSitemap(Sitemap):
    priority = 0.5
    lastmod = None
    changefreq = 'weekly'

class CollectionSitemap(AbstractReaderContentSitemap):


    def items(self):
        return [c for c in Collection.objects.filter(md_published=True) if c.has_any_inside()]

    def location(self, item):
        return reverse('reader_variant_details', kwargs=dict(collection_id=item.md_content_id, version=item.md_version,
                                                          variant=item.variant))



class ModuleSitemap(AbstractReaderContentSitemap):

    def items(self):
        result = []
        for c in Collection.objects.filter(md_published=True):
            result.extend((c.md_content_id, c.md_version, c.variant, m.md_content_id) for m in c.get_all_modules())

        return result

    def location(self, item):
        return reverse('reader_module_reader', kwargs=dict(collection_id=item[0], version=item[1], variant=item[2],
                                                          module_id=item[3]))
