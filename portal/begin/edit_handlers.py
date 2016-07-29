import json
from django.utils.encoding import force_text
from wagtail.wagtailsnippets.edit_handlers import BaseSnippetChooserPanel
from wagtail.wagtailsnippets.widgets import AdminSnippetChooser

class AdminItemGroupChooser(AdminSnippetChooser):
    def render_js_init(self, id_, name, value):
        content_type = self.target_content_type

        return "createSnippetChooserFilter({id}, {content_type});".format(
            id=json.dumps(id_),
            content_type=json.dumps('{app}/{model}'.format(
                app=content_type.app_label,
                model=content_type.model))
        )


class BaseItemGroupChooserPanel(BaseSnippetChooserPanel):
    @classmethod
    def widget_overrides(cls):
        return {cls.field_name: AdminItemGroupChooser(
            content_type=cls.content_type(), snippet_type_name=cls.snippet_type_name)}


class ItemGroupChooserPanel(object):
    def __init__(self, field_name, snippet_type):
        self.field_name = field_name
        self.snippet_type = snippet_type

    def bind_to_model(self, model):
        return type(str('_ItemGroupChooserPanel'), (BaseItemGroupChooserPanel,), {
            'model': model,
            'field_name': self.field_name,
            'snippet_type_name': force_text(self.snippet_type._meta.verbose_name),
            'snippet_type': self.snippet_type,
        })