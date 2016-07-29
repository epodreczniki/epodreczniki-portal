from django.contrib.auth.models import User


class FakeUser(User):
    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        pass

    def is_authenticated(self):
        return True


class OIDCUser(FakeUser):
    # temporary set perms for editing modules etc
    #superuser and staff not granted
    def has_perm(self, perm, obj=None):
        return True
