# coding: utf-8
from django.forms import fields, ValidationError
from widgets import RiddleInput
from models import Riddle
from utils import get_now

class RiddleField(fields.Field):

    widget = RiddleInput

    def __init__(self, *args, **kwargs):
        super(RiddleField, self).__init__(*args, **kwargs)
        self.label = ""

    def clean(self, value):
        Riddle.remove_expired()
        if not value:
            # for consistency with previous captcha
            raise ValidationError("To pole jest wymagane.")
        try:
            riddle = Riddle.objects.get(ans=value)
            riddle.delete()
            return True
        except Riddle.DoesNotExist:
            raise ValidationError(u'Nieprawidłowy kod')
        except Riddle.MultipleObjectsReturned:
            # should not happen, but still...
            return True
