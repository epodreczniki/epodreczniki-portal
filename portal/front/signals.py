# coding=utf-8
from __future__ import absolute_import

import publication.signals

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

def hide_dummy_collection(sender, driver, published, **kwargs):
    from common import models
    collection = models.Config.get_collection_first_variant_or_404(driver.identifier, driver.version)
    if collection.md_subject is None or collection.md_school is None:
        return

    info('searching dummy collections for %s', driver)
    for other in models.Collection.objects.filter(md_subject=collection.md_subject, md_school=collection.md_school, md_published=True).exclude(md_content_id=driver.identifier).all():
        if (other.get_number_of_modules() == 1) and (next(other.get_all_modules()).md_title == u'Treści w przygotowaniu...'):
            info('hiding dummy %s collection for: %s', other, driver)
            other.md_published = False
            other.save()

publication.signals.object_published.connect(hide_dummy_collection)


def purge_front_cache(sender, driver, published, **kwargs):
    import content.objects
    content.objects.drivers.convert(driver).delay_purge_cache()

publication.signals.object_published.connect(purge_front_cache)

