
class PublicationError(Exception):
    pass

class PublicationOutdated(PublicationError):
    pass

class PublicationDependencyFailed(PublicationError):
    pass

class PublicationInvalid(PublicationError):
    pass

class FileDownloadError(PublicationError):
    pass

class FileUnavailableError(FileDownloadError):
    pass

class DownloadFailureError(FileDownloadError):
    pass

class PropagationFailureError(FileDownloadError):
    pass

class InvalidFileError(FileDownloadError):
    pass

class OtherInstanceNotReadyError(PublicationError):
    pass


