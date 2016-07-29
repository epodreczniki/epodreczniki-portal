from django.conf import settings

class DatabaseAppsRouter(object):
    """ Based on http://diegobz.net/2011/02/10/django-database-router-using-settings/

    Remember to add all applications (also 3rdparty, like admin) to the DATABASE_APPS_MAPPING
    setting, otherwise syncing will not touch them at all.
    """

    def get_db(self, model):
        from django.core.exceptions import ImproperlyConfigured
        try:
            return settings.DATABASE_APPS_MAPPING[model._meta.app_label]
        except KeyError:
            raise ImproperlyConfigured('unregistered app %s (of model %s) - please add entry in DATABASE_APPS_MAPPING' % (model._meta.app_label, model))

    def db_for_read(self, model, **hints):
        """"Point all read operations to the specific database."""
        return self.get_db(model)

    def db_for_write(self, model, **hints):
        """Point all write operations to the specific database."""
        return self.get_db(model)

    def allow_relation(self, obj1, obj2, **hints):
        """Allow any relation between apps that use the same database."""
        return self.get_db(obj1) == self.get_db(obj2)

    def allow_syncdb(self, db, model):
        """Make sure that apps only appear in the related database."""
        return self.get_db(model) == db
