# coding=utf-8

from functools import wraps
import hashlib
import inspect
import sys
import re
from django.contrib.admindocs.utils import trim_docstring
from django_hosts import reverse_full
import requests
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_docs.docs import DocumentationGenerator
from django.conf import settings
from surround.django.decorators import legacy_cache_page
from surround.django import sentry


from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

API_VERSION_PREFIX = 'application/psnc.epo.api'
API_VERSION_PATTERN = r'application/psnc.epo.api-v([0-9]*\.?[0-9]*);?'
API_CURRENT_VERSION = '2.0'

#DocGen = type('DocumentationGenerator', (DocumentationGenerator, object,), {})

def str2bool(v):
    return v.lower() in ("yes", "true", "True", "t", "1")


def content_type_editor(content_type_str, to_add, add_policy='append'):
    def check_semicolon(cnt_type_str):
        if cnt_type_str[-1] not in (';', ',',):
            cnt_type_str += ';'
        return cnt_type_str + ' '

    ADD_POLICIES = {'append': lambda s, a: check_semicolon(s) + a, 'prepend': lambda s, a: check_semicolon(a) + s}

    if add_policy in ADD_POLICIES:
        return ADD_POLICIES[add_policy](content_type_str.strip(), to_add)
    else:
        raise Exception('bad add policy setting')


def resolve_api_version(accept_header_str):
    m = re.search(API_VERSION_PATTERN, accept_header_str)
    if m:
        return m.group(1)
    else:
        return None


def get_source(source, idx):
    switch = {'c': 'EXAMPLE_COLLECTIONS', 'm': 'EXAMPLE_MODULES'}
    return settings.DEV_PAGES_CONFIG[switch[source]][int(idx)]


class EnhancedDocumentationGenerator(DocumentationGenerator):
    def __init__(self, urlpatterns=None, response_formats=None, host='', schema='http'):
        """
        Sets urlpatterns
        urlpatterns -- List of UrlPatterns
        """
        if urlpatterns is None:
            urlpatterns = self.get_url_patterns()
        else:
            urlpatterns = self._flatten_patterns_tree(urlpatterns)

        if response_formats is None:
            self.response_formats = ['json']
        else:
            self.response_formats = response_formats

        self.host = host
        self.schema = schema

        self.urlpatterns = urlpatterns
        DocumentationGenerator._DocumentationGenerator__process_urlpatterns = self.__process_urlpatterns__

    def __parse_docstring__(self, docstring):
        return self.get_parsed_docstring(docstring)

    @staticmethod
    def get_parsed_docstring(docstring):

        docstring = trim_docstring(docstring)
        split_lines = docstring.split('\n')
        trimmed = False  # Flag if string needs to be trimmed
        _params = []
        description = docstring
        version = '0'
        auth_req = False
        output_method = ''
        attr_found = False

        for line in split_lines:
            if not trimmed:
                needle = line.find('--')
                if needle != -1:
                    trim_at = docstring.find(line)
                    description = docstring[:trim_at]
                    trimmed = True

            params = line.split(' -- ')
            if len(params) == 2:
                param = params[0]
                optional = False
                if params[0].startswith('!'):
                    optional = True
                    param = param[1:]
                _params.append([param.strip(), params[1].strip(), optional])
            if line.find('version:') != -1:
                version = line.split(':')[1].strip()
                attr_found = True
            if line.find('auth_req:') != -1:
                auth_req = str2bool(line.split(':')[1].strip())
                attr_found = True
            if line.find('output_method:') != -1:
                output_method = line.split(':', 1)[1].strip()
                attr_found = True

            if attr_found and not trimmed:
                trim_at = docstring.find(line)
                description = docstring[:trim_at - 1]
                trimmed = True

        return {'description': description, 'params': _params, 'version': version, 'auth_req': auth_req,
                'output_method': output_method}

    def __process_urlpatterns__(self):
        """ Assembles ApiDocObject """
        docs = []

        for endpoint in self.urlpatterns:

            # Skip if callback isn't an APIView
            callback = self._get_api_callback(endpoint)
            if callback is None:
                continue

            supported_versions = None
            if inspect.isclass(callback) and hasattr(callback(), 'supported_versions'):
                supported_versions = callback().supported_versions
            elif hasattr(callback, 'supported_versions'):
                supported_versions = callback.supported_versions

            default_version = None
            if inspect.isclass(callback) and hasattr(callback(), 'default_version'):
                default_version = callback().default_version
            elif hasattr(callback, 'default_version'):
                default_version = callback.default_version

            if supported_versions is not None:
                versions = sorted(supported_versions.keys())
            elif default_version is not None:
                versions = [default_version]
                supported_versions = {default_version: callback}
            else:
                versions = [API_CURRENT_VERSION]
                supported_versions = {API_CURRENT_VERSION: callback}

            if endpoint.name == 'collection-cover' or endpoint.name == 'collection-cover-thumb':
                temp_response_formats = ['jpg', 'png', 'svg']
            else:
                temp_response_formats = self.response_formats

            for ver in versions:
                callback = supported_versions[ver]
                # Build object and add it to the list
                doc = self.EnhancedApiDocObject(self.host, self.schema)
                doc.title = self.__get_title__(endpoint)
                doc.url_name = endpoint.name if endpoint.name is not None else ''
                docstring = callback.__doc__ #self.__get_docstring__(endpoint)
                docstring_meta = self.__parse_docstring__(docstring)
                doc.description = docstring_meta['description']
                doc.params = docstring_meta['params']
                doc.path = self.__get_path__(endpoint)
                doc.model = self.__get_model__(callback)
                doc.allowed_methods = self.__get_allowed_methods__(callback)
                doc.fields = self.__get_serializer_fields__(callback)
                doc.version = ver #docstring_meta['version']
                doc.versions = versions
                doc.default_version = True#ver == versions[-1]
                doc.response_formats = temp_response_formats
                doc.auth_req = docstring_meta['auth_req']
                doc.output_method = docstring_meta['output_method']
                docs.append(doc)
                del doc  # Clean up

        return docs

    def __cut(self, string):
        if hasattr(string, 'split'):
            return string.split('<term>')[0]
        return string

    def __get_serializer_fields__(self, callback):

        data = []
        if not hasattr(callback, 'get_serializer_class'):
            return data

        if hasattr(callback, '__call__'):
            serializer = callback().get_serializer_class()
        else:
            serializer = callback.get_serializer_class()

        try:
            _serializer = serializer()
            fields = _serializer.get_fields()
            if hasattr(_serializer, 'get_additional_fields'):
                fields.update(_serializer.get_additional_fields())
        except:
            _serializer = serializer(None)
            fields = _serializer.get_fields()
            if hasattr(_serializer, 'get_additional_fields'):
                fields.update(_serializer.get_additional_fields())

        for name, field in fields.items():
            field_data = dict()

            field_data['type'] = DocumentationGenerator._DocumentationGenerator__camelcase_to_spaces(self,
                                                                                                     field.__class__.__name__)
            for key in ('help_text', 'default'):#('read_only', 'default', 'max_length', 'min_length'):
                if hasattr(field, key):
                    field_data[key] = self.__cut(getattr(field, key))

            data.append({name: field_data})
        return data

    class EnhancedApiDocObject(DocumentationGenerator.ApiDocObject):
        version = '0'
        response_formats = ['json']
        auth_req = False
        url_name = ''
        output_method = ''

        def __init__(self, host='', schema='http'):
            self.host = host
            self.schema = schema

        def get_snippet_request_method(self):
            method_type, args, params = self.output_method.split(' ')[:3]
            return method_type

        def get_snippet_request_url(self):
            unp = self.output_method.split(' ')
            (method_type, args, params) = unp[:3]
            example = unp[3:]
            if params is None or params == 'None':
                params = ''

            if args is None:
                args = ''

            kwargs = {}

            for arg in args.split(';'):
                if arg == 'None':
                    continue
                key, value = arg.split('=')
                kwargs[key] = value

            example = example[0] if example else None
            if example is not None and example != 'None':
                source, idx = example.split(':')
                for k in kwargs:
                    kwargs[k] = get_source(source, idx)[k]

            url = reverse_full('api', self.url_name, view_kwargs=kwargs)
            url = self.schema + ':' + url + ('?' + params if params != '' else '')
            return url

        def has_snippet(self):
            if self.output_method == '':
                return False
            return True

        def get_snippet(self):
            if self.output_method == '':
                return None

            url = self.get_snippet_request_url()
            method_type = self.get_snippet_request_method()
            method = getattr(requests, method_type.lower())
            response = method(url, headers={
                'Accept': 'application/json; indent=4; ' + API_VERSION_PREFIX + '-v' + self.version})
            try:
                response.raise_for_status()
                return response.content
            except requests.exceptions.HTTPError:
                error('snippet generation failured: %s', url)
                return 'Wystąpił błąd.'


def get_docs(host, scheme, response_formats):
    import urls

    if response_formats == None:
        response_formats = ['json', 'xml']
    docs = EnhancedDocumentationGenerator(urls.raw_urlpatterns, response_formats, host).get_docs(as_objects=True)
    #sanitize output paths
    for doc in docs:
        doc.path = doc.path.replace(')', '')
        doc.id_hash = doc_path_hasher(doc.path + doc.version)
    return docs


def doc_path_hasher(path):
    return hashlib.md5(path).hexdigest()


def include_docs(view_func, response_formats=None):

    @legacy_cache_page(timeout=settings.DEFAULT_CACHE_TIME)
    @wraps(view_func)
    def _decorator(request, *args, **kwargs):
        scheme = 'https' if request.is_secure() else 'http'
        request.docs = get_docs(request.get_host(), scheme, response_formats)
        response = view_func(request, *args, **kwargs)
        return response

    return _decorator


class ApiVersionNotSupported(Exception):
    value = 'API version not supported'


def api_version_decorator(decorated_class):
    class APIVersionDispatcher(decorated_class):
        __doc__ = decorated_class.__doc__

        def _change_api_class(self, request):
            self._api_version = resolve_api_version(request.META['HTTP_ACCEPT'])
            if self._api_version is not None and hasattr(self,
                                                         'supported_versions') and self.supported_versions is not None:
                if self._api_version in self.supported_versions:
                    self.__class__ = self.supported_versions[self._api_version]
                else:
                    raise ApiVersionNotSupported
            elif self._api_version is not None and hasattr(self,
                                                           'default_version') and self.default_version is not None:
                if self.default_version == self._api_version:
                    pass
                else:
                    raise ApiVersionNotSupported
            elif self._api_version is None and hasattr(self, 'default_version') and self.default_version is not None:
                self._api_version = self.default_version
            elif self._api_version is None:
                self._api_version = API_CURRENT_VERSION
            elif self._api_version is not None and self._api_version == API_CURRENT_VERSION:
                pass
            else:
                raise ApiVersionNotSupported

        def get_object(self):
            queryset = self.get_queryset()
            filter = {}
            for field in self.multiple_lookup_fields:
                filter[field] = self.kwargs[field]
            obj = get_object_or_404(queryset, **filter)
            return obj

        def build_response(self, method_name, request, *args, **kwargs):
            try:
                self._change_api_class(request)
            except ApiVersionNotSupported as e:
                content = {'detail': e.value}
                return Response(content, status=status.HTTP_406_NOT_ACCEPTABLE)

            method = getattr(super(APIVersionDispatcher, self), method_name)
            response = method(request, *args, **kwargs)
            response.api_content_type = API_VERSION_PREFIX + '-v' + self._api_version
            return response

        def get(self, request, *args, **kwargs):
            return self.build_response('get', request, *args, **kwargs)

        def options(self, request, *args, **kwargs):
            return self.build_response('options', request, *args, **kwargs)

    return APIVersionDispatcher

def count_collection_modules(collection_tab):
    counter = 0
    for module in collection_tab:
        if module.has_key('modules'):
            counter = counter + count_collection_modules(module['modules'])
        else:
            counter = counter +1
    return counter

def str_to_class(_str):
    return getattr(sys.modules[__name__], _str)
