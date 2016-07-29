from django.db import models
from riddle.utils import gen_riddle, get_exp, get_now

class Riddle(models.Model):
    num = models.CharField(max_length=6)
    idx = models.IntegerField()
    ans = models.CharField(max_length=5)
    exp = models.DateTimeField()

    def __init__(self, *args, **kwargs):
        super(Riddle, self).__init__(*args, **kwargs)
        if not self.num:
            self.num, self.idx, self.ans = gen_riddle()
            self.exp = get_exp()
            self.save()
    
    @classmethod
    def remove_expired(cls):
        cls.objects.filter(exp__lte=get_now()).delete()            
