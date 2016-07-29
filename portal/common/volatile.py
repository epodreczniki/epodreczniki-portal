import common
from django_hosts.reverse import reverse_full

class Model(object):
    def __init__(self, config):
        self.CONFIG = config

class ModuleOccurrence(Model, common.model_mixins.ModuleOccurrenceMixin):
    is_module = True

    @property
    def html_url(self):
        return reverse_full('www', self.CONFIG.VOLATILE_VIEW_NAME, view_kwargs={
            'collection_id': self.collection.md_content_id,
            'version': self.collection.md_version,
            'variant': self.collection.variant,
            'module_id': self.module.md_content_id,
        })


class Module(Model, common.model_mixins.MetadataMixin): #, common.models.ModuleMixin):
    pass

