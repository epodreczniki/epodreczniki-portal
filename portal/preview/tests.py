# -*- coding: utf-8 -*-

from unittest import TestCase
from preview import volatile_models

class ModelProcessTest(TestCase):
    def test_foreign_key_types(self):
        self.assertTrue(isinstance(volatile_models.ModuleOccurrence.sub_collection, property))
        self.assertTrue(isinstance(volatile_models.SubCollection.module_orders, property))
        self.assertTrue(isinstance(volatile_models.SubCollection.owning_collection, property))
        self.assertTrue(isinstance(volatile_models.Collection.root_collection, property))

    def test_foreign_key_behaviour(self):
        c = volatile_models.Collection()
        s = volatile_models.SubCollection()
        mo = volatile_models.ModuleOccurrence()
        s.module_orders.add(mo)
        self.assertEqual(mo.sub_collection, s)
        self.assertEqual(len(s.module_orders.all()), 1)
        s2 = volatile_models.SubCollection()
        s2.module_orders.add(mo)
        self.assertEqual(mo.sub_collection, s2)
        self.assertEqual(len(s.module_orders.all()), 0)

        c.root_collection = s
        self.assertEqual(s.owning_collection, c)

        # self.assertIsNotNone(mo.get_absolute_url())


