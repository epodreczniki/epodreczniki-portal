
class EditSearchException(Exception):
    pass

class QueryEmptyResult(EditSearchException):
    pass

class QueryMultipleResult(EditSearchException):
    pass
