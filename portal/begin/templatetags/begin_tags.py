from datetime import date
import urllib
import urlparse
from django import template
from django.conf import settings

from begin.models import *
from django.utils.html import strip_tags
import os
from wagtail.wagtailcore.templatetags.wagtailcore_tags import pageurl

register = template.Library()


# settings value
@register.assignment_tag
def get_google_maps_key():
    return getattr(settings, 'GOOGLE_MAPS_KEY', "")


@register.assignment_tag(takes_context=True)
def get_site_root(context):
    # NB this returns a core.Page, not the implementation-specific model used
    # so object-comparison to self will return false as objects would differ
    return context['request'].site.root_page


def has_menu_children(page):
    return page.get_children().live().in_menu().exists()


# Retrieves the top menu items - the immediate children of the parent page
# The has_menu_children method is necessary because the bootstrap menu requires
# a dropdown class to be applied to a parent
@register.inclusion_tag('begin/tags/top_menu.html', takes_context=True)
def top_menu(context, parent, calling_page=None):
    request = context['request']
    menuitems = parent.get_children().live().in_menu()
    for menuitem in menuitems:
        menuitem.show_dropdown = has_menu_children(menuitem)
        # We don't directly check if calling_page is None since the template
        # engine can pass an empty string to calling_page
        # if the variable passed as calling_page does not exist.
        menuitem.active = (calling_page.url.startswith(menuitem.url)
                           if calling_page else False)
    return {
        'calling_page': calling_page,
        'menuitems': menuitems,
        # required by the pageurl tag that we want to use within this template
        'request': request,
    }


# Retrieves the children of the top menu items for the drop downs
@register.inclusion_tag('begin/tags/top_menu_children.html', takes_context=True)
def top_menu_children(context, parent, calling_page=None):
    menuitems_children = parent.get_children()
    menuitems_children = menuitems_children.live().in_menu()
    for menuitem in menuitems_children:
        menuitem.show_dropdown = has_menu_children(menuitem)
        # We don't directly check if calling_page is None since the template
        # engine can pass an empty string to calling_page
        # if the variable passed as calling_page does not exist.
        menuitem.active = (calling_page.url.startswith(menuitem.url)
                           if calling_page else False)
    return {
        'parent': parent,
        'menuitems_children': menuitems_children,
        # required by the pageurl tag that we want to use within this template
        'request': context['request'],
    }


# Retrieves the secondary links for the 'also in this section' links
# - either the children or siblings of the current page
@register.inclusion_tag('begin/tags/secondary_menu.html', takes_context=True)
def secondary_menu(context, calling_page=None):
    pages = []
    if calling_page:
        pages = calling_page.get_children().live().in_menu()

        # If no children, get siblings instead
        if len(pages) == 0:
            pages = calling_page.get_siblings(inclusive=False).live().in_menu()
    return {
        'pages': pages,
        # required by the pageurl tag that we want to use within this template
        'request': context['request'],
    }


# Retrieves all live pages which are children of the calling page
#for standard index listing
@register.inclusion_tag(
    'begin/tags/standard_index_listing.html',
    takes_context=True
)
def standard_index_listing(context, calling_page):
    pages = calling_page.get_children().live()
    return {
        'pages': pages,
        # required by the pageurl tag that we want to use within this template
        'request': context['request'],
    }


# Person feed for home page
@register.inclusion_tag(
    'begin/tags/person_listing_homepage.html',
    takes_context=True
)
def person_listing_homepage(context, count=2):
    people = PersonPage.objects.live().order_by('?')
    return {
        'people': people[:count].select_related('feed_image'),
        # required by the pageurl tag that we want to use within this template
        'request': context['request'],
    }


# Blog feed for home page
@register.inclusion_tag(
    'begin/tags/blog_listing_homepage.html',
    takes_context=True
)
def blog_listing_homepage(context, count=2):
    blogs = BlogPage.objects.live().order_by('-date')
    return {
        'blogs': blogs[:count].select_related('feed_image'),
        # required by the pageurl tag that we want to use within this template
        'request': context['request'],
    }


# Events feed for home page
@register.inclusion_tag(
    'begin/tags/event_listing_homepage.html',
    takes_context=True
)
def event_listing_homepage(context, count=2):
    events = EventPage.objects.live()
    events = events.filter(date_from__gte=date.today()).order_by('date_from')
    return {
        'events': events[:count].select_related('feed_image'),
        'index_page': EventIndexPage.get_first_index(),
        # required by the pageurl tag that we want to use within this template
        'request': context['request'],
    }


@register.inclusion_tag('begin/tags/gallery_panel.html', takes_context=True)
def gallery_panel(context):
    gallery = GallerySnippet.objects.first()
    page_url = ''
    try:
        page = gallery.page
        page_url = pageurl(context, page.first())
    except Exception as e:
        print e

    return {
        'gallery': gallery,
        'page_url': page_url,
        'items': [] if gallery is None else gallery.gallery_items.all()[:12],
        'request': context['request'],
    }


@register.inclusion_tag('begin/tags/link_panel.html', takes_context=True)
def first_link_panel(context):
    links = LinkSnippet.objects.order_by('id').first()
    return {
        'links': links
    }


@register.inclusion_tag('begin/tags/link_panel.html', takes_context=True)
def second_link_panel(context):
    all_links = LinkSnippet.objects.order_by('id')
    links = None
    if all_links.count() > 1:
        links = all_links[1]
    return {
        'links': links
    }


@register.inclusion_tag('begin/tags/promoted_links.html')
def promo_links():
    all_links = PromotedLinkSnippet.objects.order_by('id')
    links = None
    if all_links.count() > 0:
        links = all_links[0]
    return {
        'links': links
    }


@register.inclusion_tag('begin/tags/extra_index_panel.html', takes_context=True)
def extra_index_panel(context):
    page = ExtraIndexPage.objects.first()
    return {
        'page': page,
        'request': context['request']
    }


@register.inclusion_tag('begin/tags/breadcrumbs.html', takes_context=True)
def breadcrumbs(context):
    self = context.get('self')
    if self is None or self.depth <= 2:
        # When on the home page, displaying breadcrumbs is irrelevant.
        ancestors = ()
    else:
        ancestors = Page.objects.ancestor_of(
            self, inclusive=True).filter(depth__gt=2)
    return {
        'ancestors': ancestors,
        'request': context['request'],
    }


@register.assignment_tag(takes_context=True)
def bread_with_crumbs(context, self):
    #self = context.get('self')
    if self is None or self.depth <= 2:
        # When on the home page, displaying breadcrumbs is irrelevant.
        ancestors = ()
    else:
        ancestors = Page.objects.ancestor_of(
            self, inclusive=True).filter(depth__gt=2)
    return {
        'ancestors': ancestors,
    }


EXT_CLASSES = [
    {
        'class': 'image',
        'extensions': '.jpg .jpeg .png .svg .bmp'
    },
    {
        'class': 'film',
        'extensions': '.avi .mkv .mp4 .mov .webm .wmv'
    },
    {
        'class': 'music',
        'extensions': '.mp3 .wav .ogg .aac'
    },
    {
        'class': 'text',
        'extensions': '.txt .doc. docx .pdf .odt'
    },
    {
        'class': 'zip',
        'extensions': '.zip .rar .gz .7z'
    }
]


@register.simple_tag
def file_class(url):
    parsed = urlparse.urlparse(url)
    if parsed and parsed.path:
        name, ext = os.path.splitext(parsed.path)
        for item in EXT_CLASSES:
            if ext in item['extensions']:
                return 'file-type-%s' % item['class']
    return 'file-type-settings'


@register.filter
def break_on_comma(value):
    return value.replace(', ', ',<br>')


@register.assignment_tag(takes_context=True)
def carousel_item_data(context, item):
    if item.link_external:
        return {
            'url': item.link_external,
            'caption': item.caption,
            'subcaption': None
        }
    elif item.link_page is not None:
        subcaption = None
        if hasattr(item.link_page.specific, 'intro'):
            subcaption = strip_tags(item.link_page.specific.intro)
        return {
            'url': pageurl(context, item.link_page),
            'caption': item.caption if item.link_page.title is None else item.link_page.title,
            'subcaption': subcaption
        }
    else:
        return {
            'url': '',
            'caption': item.caption,
            'subcaption': None
        }


@register.filter
def force_html5(link):
    parsed = urlparse.urlsplit(link)
    query = urlparse.parse_qs(parsed.query)
    query['html5'] = '1'
    query = urllib.urlencode(query)
    return urlparse.urlunsplit(parsed[0:3] + (query,) + parsed[4:])