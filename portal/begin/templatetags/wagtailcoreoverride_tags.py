from django import template
from django.utils.safestring import mark_safe
from wagtail.wagtailcore.rich_text import extract_attrs, LINK_HANDLERS, EMBED_HANDLERS, FIND_A_TAG, FIND_EMBED_TAG, \
    ImageEmbedHandler

register = template.Library()


class NewImageEmbedHandler(object):
    @staticmethod
    def expand_db_attributes(attrs, for_editor):
        img = ImageEmbedHandler.expand_db_attributes(attrs, for_editor)
        clazz = ''
        if 'format' in attrs:
            clazz = 'class="image-%s-aligned"' % attrs['format']
        if not for_editor:
            return '<div %s>%s<p class="intext-image-title">%s</p></div>' % (clazz, img, attrs['alt'])


NEW_EMBED_HANDLERS = {}

NEW_EMBED_HANDLERS.update(EMBED_HANDLERS)

NEW_EMBED_HANDLERS['image'] = NewImageEmbedHandler


def expand_db_html(html, for_editor=False):
    """
    Expand database-representation HTML into proper HTML usable in either
    templates or the rich text editor
    """
    def replace_a_tag(m):
        attrs = extract_attrs(m.group(1))
        if 'linktype' not in attrs:
            # return unchanged
            return m.group(0)
        handler = LINK_HANDLERS[attrs['linktype']]
        return handler.expand_db_attributes(attrs, for_editor)

    def replace_embed_tag(m):
        attrs = extract_attrs(m.group(1))
        handler = NEW_EMBED_HANDLERS[attrs['embedtype']]
        return handler.expand_db_attributes(attrs, for_editor)

    html = FIND_A_TAG.sub(replace_a_tag, html)
    html = FIND_EMBED_TAG.sub(replace_embed_tag, html)
    return html


@register.filter
def richtext2(value):
    if value is not None:
        html = expand_db_html(value)
    else:
        html = ''

    return mark_safe('<div class="rich-text">' + html + '</div>')

