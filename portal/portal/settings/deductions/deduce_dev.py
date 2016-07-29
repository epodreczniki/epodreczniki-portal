# Allow local overrides in local.py

if not SURROUND_RUNNING_ON_PLATFORM:

    # Manipulate INSTALLED_APPS and MIDDLEWARE_CLASSES only *after* importing from debug_toolbar
    if DEBUG_TOOLBAR:
        from debug_toolbar import *

    if INSTANCE_NAME is None:
        if EPO_INSTANCE_NAME is not None:
            INSTANCE_NAME = 'dev-' + EPO_INSTANCE_NAME
            TOP_DOMAIN = EPO_INSTANCE_NAME + '.epodreczniki.pl:8000'
        else:
            import getpass
            INSTANCE_NAME = 'dev-' + getpass.getuser()

