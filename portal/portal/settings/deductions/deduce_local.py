# Allow local overrides in local.py

if SURROUND_RUNNING_ON_PLATFORM:
    # try:
    #     from local_machine import *
    # except ImportError:
    #     pass
    pass
else:
    try:
        from ..local import *
    except ImportError:
        pass
