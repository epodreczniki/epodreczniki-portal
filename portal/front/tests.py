"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from front import utils
from rest_framework.response import Response


class FrontUtilsTest(TestCase):
    fixtures = ['common_fixture.json']


    # TODO:andrzejp so which one is good finally?
    def test_first_or_none_none(self):
        val = utils.first_or_none([])
        self.assertEqual(val, None)

    def test_first_or_none_none(self):
        obj1 = {'first': True}
        obj2 = "something"
        val = utils.first_or_none([obj1, obj2])
        self.assertEqual(val, obj1)



