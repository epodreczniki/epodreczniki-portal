from common.context_processors.external_dependencies import engines
from django.template import Template, Context
from django.conf import settings

from compressor.filters import FilterBase


class TemplateFilter(FilterBase):
    def input(self, filename=None, basename=None, **kwargs):
        template = Template(self.content)
        js_variables = {'TOP_DOMAIN': settings.TOP_DOMAIN,
                        'EPO_GE_GETJSON_OVERRIDE': settings.EPO_GE_GETJSON_OVERRIDE,
                        'EPO_READER_USE_PERF_COUNTER': settings.EPO_READER_USE_PERF_COUNTER,
                        'EPO_READER_USE_LOGGING': settings.EPO_READER_USE_LOGGING,
                        'DEPLOYMENT_TYPE': settings.DEPLOYMENT_TYPE,
                        'EPO_READER_API_MODES': settings.EPO_READER_API_MODES,
                        'EPO_ETX_IFRAME_ACTIVE_DOMAIN': settings.EPO_ETX_IFRAME_ACTIVE_DOMAIN,
                        'EPO_READER_AUTH_ENABLE': settings.EPO_READER_AUTH_ENABLE,
                        'EPO_USERAPI_FORCE_SECURE': settings.EPO_USERAPI_FORCE_SECURE
                       }
        js_variables.update(engines(None))
        js_variables.update(settings.COMPRESS_TEMPLATE_FILTER_CONTEXT)
        context = Context(js_variables)
        return template.render(context)
