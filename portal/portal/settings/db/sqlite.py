from ..misc.utils import django_project_path_join

REMOVE_DATABASE_COMMAND = 'rm -rf %s' % django_project_path_join('sqlite.db')

EPO_DEFAULT_DATABASE = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': django_project_path_join('sqlite.db'),
}
