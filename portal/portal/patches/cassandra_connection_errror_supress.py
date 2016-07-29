from django_cassandra_engine import utils

old_get_connection = utils.get_cassandra_connection


def _get_connection_wrap(alias=None, name=None):
    conn = old_get_connection(alias, name)
    if conn:
        conn.old_connect = conn.connect
        def new_connect(*args, **kwargs):
            try:
                return conn.old_connect(*args, **kwargs)
            except Exception:
                import importlib

                mod_name, func_name = 'surround.django.logging', 'setupModuleLogger'
                mod = importlib.import_module(mod_name)
                func = getattr(mod, func_name)
                func(globals())
                error('Can not connect to Cassandra DB')

        conn.connect = new_connect

    return conn


utils.get_cassandra_connection = _get_connection_wrap


def apply_patch():
    pass
