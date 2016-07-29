import os
from os.path import dirname, abspath
from surround.django.settings import *

SETTINGS_PATH = dirname(dirname(abspath(__file__)))

# like /somewhere/epodreczniki-portal/portal
DJANGO_PROJECT_PATH = dirname(dirname(SETTINGS_PATH))

# like /somewhere/epodreczniki-portal
PROJECT_PATH = dirname(DJANGO_PROJECT_PATH)

# like /somewhere
PROJECT_PARENT_PATH = dirname(PROJECT_PATH)


def django_project_path_join(*paths):
    return os.path.join(DJANGO_PROJECT_PATH, *paths)


def project_path_join(*paths):
    return os.path.join(PROJECT_PATH, *paths)

def project_parent_path_join(*paths):
    return os.path.join(PROJECT_PARENT_PATH, *paths)


def settings_path_join(*paths):
    return os.path.join(SETTINGS_PATH, *paths)


def deduce(name, glob):
    execfile(settings_path_join('deductions', 'deduce_%s.py' % name), glob)

def tmp_filename(*paths):
    return project_path_join('tmp', *paths)


def assign_default(dictionary, name, value):
    if name not in dictionary:
        dictionary[name] = value



