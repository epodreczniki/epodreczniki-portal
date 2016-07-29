# -*- coding: utf-8 -*-
from django import template
from django.conf import settings
from django.template.loader import render_to_string
from django.templatetags.static import static
from surround.django.basic.templatetags.common_ext import make_schemeless

register = template.Library()



@register.simple_tag
def nice_variant_name(collection):
    return 'e-podręcznik ' + collection.nice_variant_name


@register.filter
def get_collection_level_x_content(collection, level):
    fetched = []
    level = int(level)
    def fetch(coll, lev):
        sub = []
        for c in coll.get_all_children_ordered():
            if lev < level and not c.is_module:
                fetch(c, lev + 1)
            elif lev == level:
                sub.append(c)
        fetched.append({'list': sub, 'toc_path': coll.toc_path, 'technical_toc_path': coll.technical_toc_path})
    fetch(collection, 1)
    return fetched


#TODO: improve that
@register.simple_tag
def get_womi_icon(attrs, presentation):
    link = static("front/img/one2three/jesien_ikony.svg")
    for attr in attrs:
        if attr.present_in_toc and attr.name == "icon-womi-id":
            link = 'http://%s.%s/content/womi/%s/icon.svg' % (presentation.config.SUBDOMAIN, settings.TOP_DOMAIN, attr.value)
    return link



@register.simple_tag(takes_context=True)
def details_toc_iteration(context, presentation, parent_content):
    return render_to_string('front/details_toc.html',
                            {'parent_content': parent_content, 'presentation': presentation}, context)

@register.simple_tag
def get_presentation_module_occurrence_url(presentation, module_occurrence, schemeless=True):
    if module_occurrence is None:
        return '#'

    url = presentation.bind_module_or_404(module_occurrence.module.md_content_id).url
    if schemeless:
        return make_schemeless(url)
    else:
        return url

