from django.core import urlresolvers
from django.utils.html import format_html
from django.conf import settings
from wagtail.wagtailcore import hooks


@hooks.register('insert_editor_js')
def editor_js():
    return format_html("""
            <script src="{0}{1}"></script>
            <script>window.chooserUrls.snippetChooserFilter = '{2}';</script>
        """,
        settings.STATIC_URL,
        'begin/js/wagtail/snippet-chooser.js',
        urlresolvers.reverse('wagtailsnippets_choose_generic')
    )

