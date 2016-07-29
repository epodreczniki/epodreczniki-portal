from surround.django.logging import prepare_module_logger

system_logging = prepare_module_logger(globals())

from django.contrib.messages import *

#store error function from messages as old function which will be wrapped
original_messages_error = error

def error(request, msg, extra_tags='', fail_silently=False, exception=None):
    #use standard message.error function
    original_messages_error(request, msg, extra_tags, fail_silently)
    # use internal logger function
    system_logging.error(msg)
    if exception:
        system_logging.error('failure: %s, %s', exception.__class__.__name__, exception)
