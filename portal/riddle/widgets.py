# coding: utf-8
from django.forms import widgets
from django.utils.safestring import mark_safe
from models import Riddle

class RiddleInput(widgets.Widget):
    
    IDX_TO_TEXT = [u'pierwszej',u'drugiej',u'trzeciej',u'czwartej',u'piątej',u'szóstej']
    
    def render(self, name, value, attrs = None):
        if not hasattr(self,'riddle'):
            self.riddle = Riddle()        
        raw_html = u'''<label class="captcha">
                             Przepisz liczbę %s z pominięciem <b>%s</b> cyfry
                             <input type="text" value="%s" name="%s" />
                       </label>''' % (self.riddle.num, self.IDX_TO_TEXT[self.riddle.idx], "", name)
        return mark_safe(raw_html)
