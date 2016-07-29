# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def add_orderings_to_subjects(apps, schema_editor):

    Subject = apps.get_model('common', 'Subject')

    print('found %s subjects' % Subject.objects.all().count())

    def assign_ordering(id, ordering):
        try:
            subject = Subject.objects.get(id=id)
            subject.ordering = ordering
            subject.save()
            print(u'updated ordering of %s to %s' % (subject.md_name, ordering))
        except Exception as e:
            print('failed to assign ordering to subject with id=%s' % id)

    # Edukacja wczesnoszkolna
    # Język Polski
    # Matematyka
    # Historia i społeczeństwo
    # Historia
    # Wiedza o społeczeństwie
    # Przyroda
    # Biologia
    # Geografia
    # Fizyka
    # Chemia
    # Informatyka
    # Zajęcia komputerowe
    # Edukacja dla bezpieczeństwa

    assign_ordering(9, 1)
    assign_ordering(5, 2)
    assign_ordering(1, 3)
    assign_ordering(10, 4)
    assign_ordering(11, 5)
    assign_ordering(12, 6)
    assign_ordering(13, 7)
    assign_ordering(7, 8)
    assign_ordering(8, 9)
    assign_ordering(2, 10)
    assign_ordering(6, 11)
    assign_ordering(3, 12)
    assign_ordering(4, 13)
    assign_ordering(14, 14)


def empty_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0017_auto_20150612_1721'),
    ]

    operations = [
        migrations.RunPython(add_orderings_to_subjects, empty_reverse),
    ]

