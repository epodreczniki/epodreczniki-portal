import random, datetime
from django.conf import settings

def gen_riddle():
    num = ''.join([str(random.randint(0,9)) for x in xrange(6)])
    idx = random.randint(0,5)
    ans = num[:idx]+num[(idx+1):]
    return (num, idx, ans)

def get_now():
    try:
        from django.utils.timezone import utc
        if settings.USE_TZ:
            return datetime.datetime.utcnow().replace(tzinfo=utc)
    except:
        pass
    return datetime.datetime.now()

def get_exp():
    return get_now()+datetime.timedelta(minutes=2)
