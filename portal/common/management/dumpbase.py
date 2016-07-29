import importlib
import sys
import os
from StringIO import StringIO
from django.conf import settings
from portal.settings.misc.utils import project_path_join, django_project_path_join
import dump_config

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

# TODO: it is needed at all, since it is always called from inside the portal or from commands?
sys.path.append(settings.PROJECT_PATH)
sys.path.append(settings.DJANGO_PROJECT_PATH)

DUMP_DIR = project_path_join('db')
DUMP_FILENAME = 'dump.py'

# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portal.settings.instances.dev')

def _runscript(name, *args, **options):
    from django.core.management import call_command

    try:
        print('Running script %s with args: %s' % (name, args))
        call_command(name, *args, **options)
    except IOError, ioe:
        print ioe


def _save_file(dumpstring, filename):
    dumpfile = open(filename, 'w')
    dumpstring.seek(0)
    dumpfile.write(dumpstring.read())
    dumpfile.close()


def _model_is_abstract(clazz):
    if hasattr(clazz, 'Meta'):
        if hasattr(clazz.Meta, 'abstract') and clazz.Meta.abstract:
            return True
    return False


def dumpdb():
    from django.contrib.sites.models import Site

    try:
        Site.objects.get(pk=1).delete()
    except Site.DoesNotExist as e:
        pass

    dumpdb_elements(os.path.join(DUMP_DIR, DUMP_FILENAME), dump_config.APPS_TO_DUMP)
    dump_fixtures()


def dumpdb_elements_simple(output_file_name, names):
    dumpstring = StringIO()

    _runscript('dumpscript2', *names, stdout=dumpstring)
    dumpstring = _remove_tzinfo(dumpstring)
    _save_file(dumpstring, output_file_name)


def dumpdb_elements(output_file_name, apps_included, models_excluded=dump_config.MODELS_EXCLUDED):
    import django.db.models
    import inspect

    args = []
    for app in apps_included:
        _app = app.split('.')[-1]
        if _app in models_excluded.keys():
            models_to_import = app + '.models'
            importlib.import_module(models_to_import)
            for clazz in inspect.getmembers(sys.modules[models_to_import]):
                if inspect.isclass(clazz[1]) and issubclass(clazz[1], django.db.models.Model) and not (
                        clazz[0] in models_excluded[_app]):
                    args.append(_app + '.' + clazz[0])
        else:
            args.append(_app)

    dumpdb_elements_simple(output_file_name, args)


def dump_fixtures():
    for app in settings.PROJECT_APPS:
        dumpstring = StringIO()
        _runscript('dumpdata', app, stdout=dumpstring)
        if dumpstring == '' or _is_null_dumpedstr(dumpstring) or dumpstring is None:
            continue
        print "saving fixtures for application: %s" % app
        directory = os.path.join(django_project_path_join(app), 'fixtures')
        if not os.path.exists(directory):
            os.makedirs(directory)
        dumpstring = _remove_tzinfo(dumpstring)
        _save_file(dumpstring, os.path.join(directory, app + '_fixture.json'))
        dumpstring.close()


def restore_db():
    restore_db_simple('db.' + DUMP_FILENAME.replace('.py', ''))


def restore_db_simple(module):
    _runscript('runscript', module)




def restore_fixtures():
    for app in settings.PROJECT_APPS:
        _runscript('loaddata', app + '_fixture.json')


def sync_db():
    # _runscript('syncdb', interactive=False, load_initial_data=False)
    _runscript('migrate', interactive=False, load_initial_data=False)


def _is_null_dumpedstr(string):
    string.seek(0)
    for line in string.readlines():
        if '[]' == line:
            return True
    return False


def _remove_tzinfo(string):
    alllines = StringIO()
    string.seek(0)
    for line in string.readlines():
        alllines.write(line.replace('<UTC>', 'utc'))
    return alllines


def install_django_sites():
    from django.contrib.sites.models import Site

    django_site_2 = Site.objects.get(pk=2)
    django_site_2.domain = u'localhost.epodreczniki.pl:8000'
    django_site_2.name = u'localhost.epodreczniki.pl:8000'
    django_site_2.save()

    django_site_3 = Site.objects.get(pk=3)
    django_site_3.domain = u'epodreczniki.pl'
    django_site_3.name = u'epodreczniki.pl'
    django_site_3.save()

    django_site_4 = Site.objects.get(pk=4)
    django_site_4.domain = u'test.epodreczniki.pl'
    django_site_4.name = u'test.epodreczniki.pl'
    django_site_4.save()

    django_site_5 = Site.objects.get(pk=5)
    django_site_5.domain = u'beta.epodreczniki.pl'
    django_site_5.name = u'beta.epodreczniki.pl'
    django_site_5.save()

    django_site_6 = Site.objects.get(pk=6)
    django_site_6.domain = u'alfa.epodreczniki.pl'
    django_site_6.name = u'alfa.epodreczniki.pl'
    django_site_6.save()




# def create_admin_user():
#     """ Resets admin password. Password is stored in script in hashed form. """
#     from django.contrib.auth.models import User
#     import datetime

#     try:
#         auth_user_1 = User()
#         auth_user_1.password = u'pbkdf2_sha256$10000$4eE6qkQpMUWu$mZCQkLDBDWI9c6dG5cKr3k7xd/Zy0djKfjy7pUxbwWs='
#         auth_user_1.last_login = datetime.datetime(2013, 9, 25, 10, 39, 39, 274000, tzinfo=utc)
#         auth_user_1.is_superuser = True
#         auth_user_1.username = u'admin'
#         auth_user_1.first_name = u''
#         auth_user_1.last_name = u''
#         auth_user_1.email = u'admin@aa.pl'
#         auth_user_1.is_staff = True
#         auth_user_1.is_active = True
#         auth_user_1.date_joined = datetime.datetime(2013, 7, 23, 9, 1, 56, 975000, tzinfo=utc)
#         auth_user_1.save()

#     except Exception as e:
#         print e

