from shutil import copytree
import shutil
import time

import codecs
from codingserver.views import collection_index, before_render
from common.model_mixins import ModuleOccurrenceMixin
from common.volatile import ModuleOccurrence
from compressor.base import METHOD_INPUT, SOURCE_FILE
from compressor.templatetags.compress import CompressorMixin
from django.core.management import call_command
from django.core.urlresolvers import reverse, resolve
from django.utils import encoding
from django_hosts import reverse_full
from os import mkdir, makedirs, walk
import os
from os.path import join
from compressor_requirejs.compiler import RequireJSCompiler
from django.conf import settings
from compressor.js import Compressor
from surround.django.basic.templatetags.common_ext import register
from surround.django.esi import process_esi


TEST_COLLECTION = {
    'identifier': '67060',
    'version': '1',
    'variant': 'student-canon'
}


class JSCompressor(CompressorMixin):
    def compress_file(self, filename):
        if os.path.splitext(filename)[1] != '.js':
            return
        compressor = self.compressor_cls('js')
        content = compressor.get_filecontent(filename, 'utf8')

        if content:
            filtered_file = compressor.filter(content, 'input')

            with codecs.open(filename, 'w', 'utf8') as to_write:
                to_write.write(filtered_file)


def init():
    def get_filepath(self, content, basename=None):
        parts = []
        if basename:
            filename = basename.replace('\\', '_').replace('/', '_').replace('.', '_')
            parts.append(filename)
            parts.append(self.type)
        return os.path.join(self.output_dir, self.output_prefix, '.'.join(parts))


    def output(self, mode='file', forced=False):

            output = '\n'.join(self.filter_input(True))

            if not output:
                return ''


            return output

    def hunks(self, forced=False):
            enabled = settings.COMPRESS_ENABLED or forced

            for kind, value, basename, elem in self.split_contents():
                precompiled = False
                attribs = self.parser.elem_attribs(elem)
                charset = attribs.get("charset", self.charset)
                options = {
                    'method': METHOD_INPUT,
                    'elem': elem,
                    'kind': kind,
                    'basename': basename,
                    'charset': charset,
                }

                if kind == SOURCE_FILE:
                    options = dict(options, filename=value)
                    value = self.get_filecontent(value, charset)

                if self.all_mimetypes:
                    precompiled, value = self.precompile(value, **options)

                #if enabled:
                value = self.filter(value, **options)
                #else:
                if precompiled:
                        yield self.handle_output(kind, value, forced=True,
                                                 basename=basename)
                else:
                        yield self.parser.elem_str(elem)


    domain = getattr(settings, 'CONTENT_DOMAIN_STATIC_READER', '')

    def subdomain(self):
        return domain

    Compressor.get_filepath = get_filepath
    Compressor.output = output
    Compressor.hunks = hunks

    setattr(ModuleOccurrenceMixin, 'subdomain', property(subdomain))


    def esi_url(context, host, view, *args, **kwargs):
        from django.test import RequestFactory

        request_factory = RequestFactory()
        for_resolver_link = reverse(view, args=args, kwargs=kwargs)
        link = reverse_full(host, view, view_args=args, view_kwargs=kwargs)
        request = request_factory.get(link, data={'name': u'test'})
        func, _args, _kwargs = resolve(for_resolver_link)
        response = func(request, *args, **kwargs)

        return response.content

    register.simple_tag(esi_url, takes_context=True)
    #common_ext.esi_url = esi_url


def html_url(self):
    domain = getattr(settings, 'CONTENT_DOMAIN_STATIC_READER', '')
    return '%s/content/collection/%s/module.html' % (domain, '/'.join(map(str, (self.collection.identifier, self.collection.version, self.collection.variant, self.module.identifier))))
    #return url_providers.get_module_occurrence_html_url(self.collection.CONFIG.SUBDOMAIN, self.collection.identifier, self.collection.version, self.collection.variant, self.module.identifier)


def handler(sender, **kwargs):
    setattr(ModuleOccurrenceMixin, 'html_url', property(html_url))
    setattr(ModuleOccurrence, 'html_url', property(html_url))


before_render.connect(handler, weak=False)


def run_command_collect_static():
    call_command('collectstatic', ignore_patterns=['3rdparty',
                                                   'repository',
                                                   'edit*',
                                                   'django*',
                                                   'wagtail*',
                                                   'rest_framework',
                                                   'admin',
                                                   'api',
                                                   'auth',
                                                   'djcelery',
                                                   'preview',
                                                   'publication',
                                                   'less*'],
                 post_process=False, interactive=False, verbosity=0, settings=settings)

def run_command_compress():
    call_command('compress')


def collect_require(filename, path):
    requireJSCompiler = RequireJSCompiler()
    compiled_path = join(path, 'compiled')
    mkdir(compiled_path)
    requireJSCompiler.requirejs_dir(filename, compiled_path, True)


def collect_3rdparty(path):
    requireJSCompiler = RequireJSCompiler()
    global_libraries = join(path, 'global', 'libraries')
    makedirs(global_libraries)

    for party in ['epo', 'ge']:
        party_path = requireJSCompiler.get_fullpath('static/3rdparty/%s' % party)
        copytree(party_path, join(global_libraries, party))


def compress_js(path):
    compressor_obj = JSCompressor()
    for root, dirs, files in walk(path):
        for _file in files:
            compressor_obj.compress_file(join(root, _file))


def request_for_index(params):
    from django.test import RequestFactory

    request_factory = RequestFactory()
    link = reverse(collection_index, kwargs=params)
    request = request_factory.get(link, data={'name': u'test'})

    resp = collection_index(request, params['identifier'], params['version'], params['variant'])

    return resp, request


def apply_middleware_on_response(request, response):

    process_esi(request, response)


def save_file(path, filename, content):
    with codecs.open(join(path, filename), 'w', 'utf8') as f:
        f.write(encoding.smart_unicode(content))


def build_reader_package(path, kind, params, create_static=True):
    init()

    print('start building package', params)

    if path is None:
        path = join(settings.COMPRESSOR_REQUIREJS_TMP, '%s_reader_build_%s' % (kind, int(time.time())))

    mkdir(path)

    setattr(settings, 'STATIC_ROOT', join(path, 'static'))
    setattr(settings, 'COMPRESS_ROOT', join(path, 'static'))

    if create_static:
        print('collecting static')
        run_command_collect_static()
        #print('collecting reader files')
        #collect_require(filename, path)
    resp, req = request_for_index(params)
    apply_middleware_on_response(req, resp)
    save_file(path, 'index.html', resp.content)

    if create_static:
        print('compressing and filtering files')
        compress_js(path)

        print('collecting 3rdparty files')
        collect_3rdparty(path)
    else:
        shutil.rmtree(settings.STATIC_ROOT)

    print('build finished')

    print 'all files are in: %s' % path


def build_ge_reader_package(args, path=None, create_static=True):
    params = {}
    params.update(TEST_COLLECTION)
    params.update({k: v for k, v in zip(['identifier', 'version', 'variant'], args)})
    build_reader_package(path, 'ge', params, create_static)
