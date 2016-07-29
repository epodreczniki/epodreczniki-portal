from compressor.css import CssCompressor
from compressor.conf import settings


class NewCssCompressor(CssCompressor):
    def __init__(self, content=None, output_prefix="css", context=None):
        super(NewCssCompressor, self).__init__(content=content,
                                               output_prefix=output_prefix, context=context)
        self.filters = list(settings.COMPRESS_CSS_FILTERS)
        self.type = output_prefix
        rel = 'stylesheet'
        title = ''
        if 'compressed' in self.context and 'name' in self.context['compressed'] and self.context['compressed']['name']:
            if self.context['compressed']['name'] != 'base':
                rel = 'alternate stylesheet'
            title = self.context['compressed']['name']

        if 'compressed' not in self.context:
            self.context['compressed'] = {}

        self.context['compressed']['rel'] = rel
        self.context['compressed']['title'] = title

        CssCompressor.get_template_name = self.get_template_name_

    def get_template_name_(self, mode):

        return "compressor_ext/%s_%s.html" % (self.type, mode)


