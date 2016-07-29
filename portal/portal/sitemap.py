# from front.sitemap import FrontSitemap
from api.sitemap import DevSitemap
from front.sitemap import FrontSitemap
from reader.sitemap import CollectionSitemap, ModuleSitemap

portal_sitemaps = {
    'front': FrontSitemap,
    'collection': CollectionSitemap,
    'module': ModuleSitemap,
    'dev': DevSitemap,
}
