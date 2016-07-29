from django.http import Http404

class ObjectNotInEditionException(Http404):
    pass
