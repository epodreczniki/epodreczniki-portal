from django import template
from surround.django.logging import setupModuleLogger

setupModuleLogger(globals())

register = template.Library()

@register.simple_tag
def get_kzd_items_in_category(statistics, category):
    cats = statistics['categories']
    if category in cats:
        return cats[category]['count']

    return 0


@register.simple_tag
def kzd_womi_tumbnail(config, womi):
    manifest = womi.manifest
    for item in manifest['items']:
        if 'role' in item and item['role'] == 'thumbnail':
            try:
                thumb_womi = config.get_womi_or_404(item['womiId'], '1')
                return thumb_womi.get_image_url('classic', resolution=('120'))
            except:
                return None
    return None


@register.filter
def get_item_thumb(womi, config):
    return kzd_womi_tumbnail(config, womi)

@register.filter
def startswith(value, arg):
    return value.startswith(arg)


@register.filter
def edu_level(value, start):
    for element in value:
        if element.startswith(start):
            return True
    return False

@register.filter
def isempty_edu_level(value_list):
    for element in value_list:
        if not element:
                return True
        return False

