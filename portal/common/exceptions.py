# coding=utf-8

class NiceException(Exception):
    lead = 'Błąd'
    title = 'Błąd'
    status = 503
    template_name = 'exception_error.html'

    def __init__(self, message='', **kwargs):
        super(NiceException, self).__init__(message)
        self.nice_extra = kwargs

    def __str__(self):
        result = Exception.__str__(self)
        return result if result else self.title

    def __unicode__(self):
        result = Exception.__unicode__(self)
        return result if result else self.title

class InvalidAuthorKindException(Exception):
    pass
