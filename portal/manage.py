#!/usr/bin/env python
from __future__ import print_function

import sys

import os
from os.path import dirname, join

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "portal.settings.instances.simple")

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
