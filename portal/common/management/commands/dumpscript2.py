#!/usr/bin/env python
# -*- coding: UTF-8 -*-
"""
      Title: Dumpscript management command
    Project: Hardytools (queryset-refactor version)
     Author: Will Hardy (http://willhardy.com.au)/
       Date: June 2008
      Usage: python manage.py dumpscript appname > scripts/scriptname.py
  $Revision: 217 $

Description:
    Generates a Python scripts that will repopulate the database using objects.
    The advantage of this approach is that it is easy to understand, and more
    flexible than directly populating the database, or using XML.

    * It also allows for new defaults to take effect and only transfers what is
      needed.
    * If a new database schema has a NEW ATTRIBUTE, it is simply not
      populated (using a default value will make the transition smooth :)
    * If a new database schema REMOVES AN ATTRIBUTE, it is simply ignored
      and the data moves across safely (I'm assuming we don't want this
      attribute anymore.
    * Problems may only occur if there is a new model and is now a required
      ForeignKey for an existing model. But this is easy to fix by editing the
      populate scripts. Half of the job is already done as all ForeingKey
      lookups occur though the locate_object() function in the generated scripts.

Improvements:
    See TODOs and FIXMEs scattered throughout :-)

"""
import django_extensions.management.commands.dumpscript
from django_extensions.management.commands.dumpscript import *


class InstanceCode2(django_extensions.management.commands.dumpscript.InstanceCode):
    " Produces a python scripts that can recreate data for a given model instance. "

    def __init__(self, instance, id, context=None, stdout=None, stderr=None, options=None):
        """ We need the instance in question and an id """

        super(InstanceCode, self).__init__(indent=0, stdout=stdout, stderr=stderr)
        self.imports = {}

        self.instance = instance
        self.options = options
        self.model = self.instance.__class__
        if context is None:
            context = {}
        self.context = context
        self.variable_name = "%s_%s" % (self.instance._meta.db_table, id)
        self.skip_me = None
        self.instantiated = False

        self.waiting_list = list(self.model._meta.fields)

        self.many_to_many_waiting_list = {}
        for field in self.model._meta.many_to_many:
            self.many_to_many_waiting_list[field] = list(getattr(self.instance, field.name).all())

    def indent_lines(self, lines):
        output = []
        for line in lines:
            output.append((' ' * 4) + line)

        return output

    def get_lines(self, force=False):
        """ Returns a list of lists or strings, representing the code body.
            Each list is a block, each string is a statement.

            force (True or False): if an attribute object cannot be included,
            it is usually skipped to be processed later. With 'force' set, there
            will be no waiting: a get_or_create() call is written instead.
        """
        code_lines = []

        # Don't return anything if this is an instance that should be skipped
        if self.skip():
            return []

        #dresiu patch to try except rows
        code_lines.append('try:')

        #code_lines.append((' ' * 4) + 'from django.utils.timezone import utc')
        # Initialise our new object
        # e.g. model_name_35 = Model()
        code_lines += self.indent_lines(self.instantiate())

        # Add each field
        # e.g. model_name_35.field_one = 1034.91
        #      model_name_35.field_two = "text"
        code_lines += self.indent_lines(self.get_waiting_list())

        if force:
            # TODO: Check that M2M are not affected
            code_lines += self.indent_lines(self.get_waiting_list(force=force))

        # Print the save command for our new object
        # e.g. model_name_35.save()
        if code_lines:
            code_lines.append((' ' * 4) + "print 'importing %s: %%s' %% unicode(%s)\n" % (self.model.__name__, self.variable_name))
            code_lines.append((' ' * 4) + "%s.save()\n" % (self.variable_name))
        code_lines += self.indent_lines(self.get_many_to_many_lines(force=force))
        print 'dumped %s: %s' % (self.model.__name__, self.instance)

        code_lines.append('except Exception as e:')
        code_lines.append((' ' * 4) + "print 'failed to import: ' + str(e)\n")

        return code_lines

    lines = property(get_lines)


django_extensions.management.commands.dumpscript.InstanceCode = InstanceCode2


class Script2(django_extensions.management.commands.dumpscript.Script):
    " Produces a complete python scripts that can recreate data for the given apps. "

    def __init__(self, models, context=None, stdout=None, stderr=None, options=None):
        super(Script, self).__init__(stdout=stdout, stderr=stderr)

        print "dumping models: %s" % [m.__name__ for m in models]
        # print "dumping models: %s" % models
        self.imports = {}

        self.options = options

        self.models = models
        if context is None:
            context = {}
        self.context = context

        self.context["__avaliable_models"] = set(models)
        self.context["__extra_imports"] = {'utc': 'django.utils.timezone'}


django_extensions.management.commands.dumpscript.Script = Script2
