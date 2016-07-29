# coding=utf-8
from urlparse import urljoin
from common.endpoint import endpoint_string_pattern
import re
from django.core.urlresolvers import reverse

from django.views.generic import View
from django.template.loader import render_to_string
from django.shortcuts import render
from django_hosts import reverse_full
from requests import ConnectionError
import requests
from django.conf import settings
from django.utils.safestring import mark_safe
from surround.django.esi import render_with_esi
from surround.django.logging import setupModuleLogger
from common import models
from surround.django.utils import absolute_url

setupModuleLogger(globals())

CONTENT_TYPE_MAP = {
    "image/jpeg": 'jpg',
    "image/svg+xml": 'svg',
    "image/png": 'png'
}


def height_ratio(params):
    if 'object' in params:
        if 'heightRatio' in params['object']:
            return params['object']['heightRatio']

    return 1


def image_render(womi_descr):
    platform = womi_descr['platform']
    platform_obj = womi_descr['parameters'].get(platform)
    ext = CONTENT_TYPE_MAP.get(platform_obj.get('mimeType'))
    return render_to_string('womi_render/womi_image_template.html', {
        'data_src': urljoin(womi_descr['womi_url'], platform + '.' + ext),
        'resolutions': platform_obj.get('resolution')
    })


def interactive_render(womi_descr):
    platform = womi_descr['platform']
    params = womi_descr['parameters']
    platform_obj = params.get(platform, None)

    alternative = image_render(womi_descr) if platform_obj else None

    return render_to_string('womi_render/womi_interactive_template.html', {
        'data_src': urljoin(womi_descr['womi_url'], womi_descr['mainFile']),
        'alternative': alternative,
        'engine': womi_descr['engine'],
        'engine_version': womi_descr['version'],
        'height_ratio': height_ratio(params)
    })


def interactive_with_resource_render(womi_descr):
    platform = womi_descr['platform']
    params = womi_descr['parameters']
    platform_obj = params.get(platform, None)

    alternative = image_render(womi_descr) if platform_obj else None

    r = requests.get(urljoin(womi_descr['base_url'], urljoin(womi_descr['womi_url'], womi_descr['mainFile'])))

    return render_to_string('womi_render/womi_interactive_with_resource_template.html', {
        'data_src': r.text,
        'alternative': alternative,
        'engine': womi_descr['engine'],
        'engine_version': womi_descr['version'],
        'height_ratio': height_ratio(params)
    })


def resolve_womi(womi_descr):
    data = {'platform': 'classic'}
    data.update(womi_descr)
    womi_tpl = {
        'image': image_render,
        'swiffy': interactive_render,
        'edge_animation': interactive_render,
        'createjs_animation': interactive_render,
        'custom_womi': interactive_render,
        'ge_animation': interactive_render,
        'custom_logic_exercise_womi': interactive_render,
        'geogebra': interactive_with_resource_render
    }.get(womi_descr['engine'], interactive_render)(data)

    return render_to_string('womi_render/womi_template.html', {'classic': womi_tpl})


class WomiReaderMixin(object):
    endpoints = {}
    template = 'womi_preview.html'
    use_version = True
    use_dynamic = settings.PREVIEW_WOMI_USE_DYNAMIC
    config = None

    def get_full_domain(self):
        return '//%s.%s' % (self.config.SUBDOMAIN, settings.TOP_DOMAIN)

    def get_dynamic_loader(self, womi_id, version):
        return '<div id="dynamic-womi" data-womi-id="%s" data-womi-version="%s" data-use-version="%s"></div>' % (
        womi_id, (version if version else ''), 'true' if self.use_version else 'false')

    def _fetch_womi_params(self, request, womi_id, version):
        if version == 'none' or not self.use_version:
            version = None

        # TODO better way to obtain this path?
        womi_url = '/content/womi/%s/' % womi_id
        if self.use_version:
            womi_url += ('%s/' % version)

        full_domain = self.get_full_domain()
        with_schema_base_url = ('https:' if request.is_secure() else 'http:') + full_domain
        data = {'womi_url': womi_url,
                'base_url': with_schema_base_url}

        if self.use_dynamic:
            womi_content = mark_safe(self.get_dynamic_loader(womi_id, version))
        else:
            try:
                manifest_url = 'http:' + full_domain + womi_url + 'manifest.json'
                debug('fetching manifest %s', manifest_url)
                r = requests.get(manifest_url)
                r.raise_for_status()
                data.update(r.json())
                womi_content = resolve_womi(data)
            except ConnectionError as ce:
                womi_content = mark_safe(self.get_dynamic_loader(womi_id, version))

        return {
            'base_url': full_domain,
            'womi_id': womi_id,
            'version': version,
            'data': data,
            'womi_content': womi_content,
            'endpoints': self.endpoints
        }


class WomiReader(View, WomiReaderMixin):

    def get(self, request, womi_id, version):
        params = self._fetch_womi_params(request, womi_id, version)

        return render(request, self.template, params)


class AutonomicWomiReader(View, WomiReaderMixin):
    template = 'autonomic_womi.html'
    use_dynamic = False
    use_version = True

    def get(self, request, presentation, module_id):
        module_presentation = presentation.bind_module_or_404(module_id)
        womi = module_presentation.module_occurrence.single_referred_womi_or_none(models.WomiReference.PLAY_AND_LEARN_UNBOUND_KIND)

        womi_id = womi.womi_id
        womi_version = womi.version

        params = self._fetch_womi_params(request, womi_id, womi_version)
        module_name = module_presentation.module_occurrence.module.md_title

        # TODO: determine collection and module peculiarities

        back_url = module_presentation.url

        params.update({
            "back_url": back_url,
            "module_name": module_name,
            "module": module_presentation.module_occurrence.module,

            "config": self.config,
            "presentation": presentation,
            'results_url_base': absolute_url(request, '')
        })

        return render_with_esi(request, self.template, params)


class LegacyWomiReader(WomiReader):
    use_version = False

    def get_full_domain(self):
        return self.full_domain

    def get(self, request, subdomain_with_optional_port, womi_id):

        if ':' in subdomain_with_optional_port:
            subdomain, port = subdomain_with_optional_port.split(':')
            self.full_domain = '//%s.%s' % (subdomain, re.sub(r'(:[0-9]+)?$', ':%s' % port, settings.TOP_DOMAIN))
        else:
            self.full_domain = '//%s.%s' % (subdomain_with_optional_port, settings.TOP_DOMAIN)

        return super(LegacyWomiReader, self).get(request, womi_id, version=None)
