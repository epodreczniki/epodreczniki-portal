# coding=utf-8
from django.db import models

class AdminMessage(models.Model):
    
    text = models.CharField(max_length=134)
    date = models.DateTimeField(auto_now_add=True)
    shown = models.BooleanField(default=True)
