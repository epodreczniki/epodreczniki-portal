from surround.django.execution import LazyObject

@property
def short_descriptor(self):
    return { 'identifier': self.identifier, 'version': str(self.version), 'category': self.category }

def as_driver(self, drivers):
    return drivers.bind(self.category, self.identifier, self.version)

LazyObject.short_descriptor = short_descriptor
LazyObject.as_driver = as_driver
