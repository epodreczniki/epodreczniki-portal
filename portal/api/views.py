from urlparse import urljoin
from api.templatetags.cms_utils import parse_tags
from common.models import Womi, CollectionStaticFormat
from common import url_providers
import django
from django.conf import settings
from django.shortcuts import redirect
from api.utils import api_version_decorator, EnhancedDocumentationGenerator
from common.models import SchoolLevel, SubCollection, Module, Author, Keyword, CoreCurriculum
from common import models
from django.http import Http404
from django.utils import translation
from django.utils.safestring import mark_safe
from rest_framework import generics
from rest_framework.generics import get_object_or_404
from rest_framework.renderers import BrowsableAPIRenderer
from rest_framework.reverse import reverse
from rest_framework.response import Response
from serializers import SubjectSerializer, CollectionSerializer, SchoolSerializer, MetadataCollectionSerializer, \
    CoreCurriculumSerializer, WomiSerializer, MobileCollectionSerializer, FormatSerializer, CoverSerializer, \
    CollectionAuthorSerializer
from serializers import ModuleSerializer, MetadataModuleSerializer, AuthorSerializer, KeywordSerializer, \
    CollectionSerializer2
from common.models import Collection, Subject
from rest_framework.views import APIView
from api.decorators import default_api_view
from django.template import RequestContext, loader
from api.decorators import default_cache_page
from django.db.models import Q

from rest_framework.settings import api_settings
from rest_framework import status, VERSION

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

COLLECTION_PREFIX = 'collection'

def redirect_url_response(path):
    url = urljoin(settings.REPOSITORY_URL, path)
    return redirect(url)

pages = [
    {'url': '/details/', 'title': 'API Method Index'},
    {'url': '/version/', 'title': 'API Version Negotiation'},
    {'url': '/home/', 'title': 'Developers Home'},
    {'url': '/format/', 'title': 'Format Param and Content Negotiation'},
    {'url': '/source_formats/', 'title': 'Source formats - XML Languages'},

]


def render(self, data, accepted_media_type=None, renderer_context=None):
    """
    Render the HTML for the browsable API representation.
    """
    accepted_media_type = accepted_media_type or ''
    renderer_context = renderer_context or {}

    view = renderer_context['view']
    request = renderer_context['request']
    response = renderer_context['response']
    media_types = [parser.media_type for parser in view.parser_classes]

    renderer = self.get_default_renderer(view)
    content = self.get_content(renderer, data, accepted_media_type, renderer_context)

    put_form = self._get_form(view, 'PUT', request)
    post_form = self._get_form(view, 'POST', request)
    patch_form = self._get_form(view, 'PATCH', request)
    delete_form = self._get_form(view, 'DELETE', request)
    options_form = self._get_form(view, 'OPTIONS', request)

    raw_data_put_form = self._get_raw_data_form(view, 'PUT', request, media_types)
    raw_data_post_form = self._get_raw_data_form(view, 'POST', request, media_types)
    raw_data_patch_form = self._get_raw_data_form(view, 'PATCH', request, media_types)
    raw_data_put_or_patch_form = raw_data_put_form or raw_data_patch_form

    name = self.get_name(view)
    description = view.__class__.__doc__  # self.get_description(view)
    breadcrumb_list = self.get_breadcrumbs(request)

    docc = EnhancedDocumentationGenerator.get_parsed_docstring(description)

    template = loader.get_template(self.template)
    context = RequestContext(request, {
        'content': content,
        'view': view,
        'request': request,
        'response': response,
        'description': mark_safe(parse_tags(docc['description'])),
        'name': name,
        'version': VERSION,
        'breadcrumblist': breadcrumb_list,
        'allowed_methods': view.allowed_methods,
        'available_formats': [renderer.format for renderer in view.renderer_classes],

        'put_form': put_form,
        'post_form': post_form,
        'patch_form': patch_form,
        'delete_form': delete_form,
        'options_form': None,

        'raw_data_put_form': raw_data_put_form,
        'raw_data_post_form': raw_data_post_form,
        'raw_data_patch_form': raw_data_patch_form,
        'raw_data_put_or_patch_form': raw_data_put_or_patch_form,

        'api_settings': api_settings
    })

    ret = template.render(context)

    # Munge DELETE Response code to allow us to return content
    # (Do this *after* we've rendered the template so that we include
    # the normal deletion response code in the output)
    if response.status_code == status.HTTP_204_NO_CONTENT:
        response.status_code = status.HTTP_200_OK

    return ret

old_description = BrowsableAPIRenderer.get_description

def new_description(self, view):
    descr = view.__class__.__doc__#old_description(self, view)
    docc = EnhancedDocumentationGenerator.get_parsed_docstring(descr)
    return mark_safe(parse_tags(docc['description']))

#BrowsableAPIRenderer.render = render
BrowsableAPIRenderer.get_description = new_description

@default_api_view(version='2.0')
def api_root(request):
    """
    Returns object with links to all list-like resource methods.

    version: 2.0
    auth_req: False
    output_method: GET None None
    """
    return Response({
        'schools': reverse('school-list', request=request),
        'subjects': reverse('subject-list', request=request),
        'keywords': reverse('keyword-list', request=request),
        'authors': reverse('author-list', request=request),
        'collections': reverse('collection-list', request=request),
        'modules': reverse('module-list', request=request),
        'core curriculums': reverse('core-curriculum-list', request=request),
        'womis': reverse('womi-list', request=request),
    })


def remove_default_pagination(clazz):
    new = type(clazz.__name__, (clazz,), {'paginate_by': None,
                                          '__doc__': clazz.__doc__})
    return new


DEFAULT_PAGINATION_BY = 10


class CollectionList(api_version_decorator(generics.ListAPIView)):
    """
    Lists Collections from the database. Returns a full list of collections.
    Main identifier for collection is [val]md_content_id[/val].

    !school -- filter for school level with [val]id[/val] from [api v=2.0]/schools/[/api] [exval]1[/exval]
    !subject -- filter for classes level with [val]id[/val] from [api v=2.0]/subjects/[/api] [exval]1[/exval]
    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]
    version: 2.0
    auth_req: False
    output_method: GET None None
    """
    model = Collection
    serializer_class = CollectionSerializer
    paginate_by_param = 'limit'
    paginate_by = DEFAULT_PAGINATION_BY

    def __init__(self, *args, **kwargs):
        self.default_version = '2.1'
        self.supported_versions = {
            '2.1': CollectionList,
            '2.0': remove_default_pagination(CollectionList),
            '1.0': remove_default_pagination(CollectionList_v1_0)}

        super(CollectionList, self).__init__(*args, **kwargs)

    def _combine_filter_args(self, level, subject):
        kwargs = {'md_published': True}
        if level is not None:
            kwargs['md_school__id'] = level
        if subject is not None:
            kwargs['md_subject__id'] = subject
        return kwargs

    def get_queryset(self):
        params = self.request.QUERY_PARAMS
        level = None
        subject = None
        try:
            if 'school' in params:
                level = params['school']
                long(level)
            if 'subject' in params:
                subject = params['subject']
                long(subject)
        except ValueError:
            raise Http404

        return Collection.objects.filter(Q(variant__exact='student') | Q(variant__exact='student-canon'),
                                         **self._combine_filter_args(level, subject)).prefetch_related(
            'authorships').order_by('md_subject__id', 'md_school__md_education_level', 'md_school__ep_class')



class CollectionList_v1_0(CollectionList):
    """
    Lists Collections from the database. Returns a full list of collections.
    Main identifier for collection is [val]md_content_id[/val].

    !school -- filter for school level with [val]id[/val] from [api v=1.0]/schools/[/api] [exval]1[/exval]
    !subject -- filter for classes level with [val]id[/val] from [api v=1.0]/subjects/[/api] [exval]1[/exval]
    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]
    version: 1.0
    auth_req: False
    output_method: GET None None
    """
    serializer_class = CollectionSerializer2


class CollectionDetail(api_version_decorator(generics.RetrieveAPIView)):
    """
    Collection details from the database. Returns a list of fields of concrete model instance.
    Main identifier for collection is [val]md_content_id[/val].

    md_content_id -- collection id [exval]1309[/exval]
    md_version -- collection version [exval]1[/exval]
    variant -- collection variant [exval]student-canon[/exval]
    version: 2.0
    auth_req: False
    output_method: GET md_content_id=1309;md_version=1;variant=student-canon None c:0
    """

    model = Collection
    serializer_class = CollectionSerializer
    #paginate_by_param = 'limit'
    # lookup_field = 'md_content_id'
    multiple_lookup_fields = ['md_content_id', 'md_version', 'variant']

    def __init__(self, *args, **kwargs):
        self.default_version = '2.0'
        self.supported_versions = {'2.0': CollectionDetail}
        super(CollectionDetail, self).__init__(*args, **kwargs)


class CollectionDetail_v1_0(api_version_decorator(generics.RetrieveAPIView)):
    """
    Collection details from the database. Returns a list of fields of concrete model instance.
    Main identifier for collection is [val]md_content_id[/val].

    md_content_id -- collection id [exval]1309[/exval]
    md_version -- collection version [exval]1[/exval]
    variant -- collection variant [exval]student-canon[/exval]
    version: 2.0
    auth_req: False
    output_method: GET md_content_id=1309;md_version=1;variant=student-canon None c:0
    """
    serializer_class = CollectionSerializer2


class CollectionDetail_old(api_version_decorator(generics.RetrieveAPIView)):
    """
    [red]DEPRECATED[/red] Collection details from the database. Returns a list of fields of concrete model instance.
    Main identifier for collection is [val]md_content_id[/val].

    md_content_id -- collection id [exval]1309[/exval]
    version: 1.0
    auth_req: False
    output_method: GET md_content_id=1309 None c:0
    """
    model = Collection
    serializer_class = CollectionSerializer2
    paginate_by_param = 'limit'
    # lookup_field = 'md_content_id'
    multiple_lookup_fields = ['md_content_id', 'md_version', 'variant']

    def __init__(self, *args, **kwargs):
        self.default_version = '1.0'
        self.supported_versions = {'1.0': CollectionDetail_old, }

        super(CollectionDetail_old, self).__init__(*args, **kwargs)

    def get_object(self):
        return models.Config.get_collection_first_variant_or_404(self.kwargs['md_content_id'], version=1)


@default_api_view(version='2.0')
def get_collection_static_format(request, md_content_id, md_version, variant, emission_format):
    """
    Collection generated file formats as popular document containers[n]
    Currently supported formats:
    [i][val]pdf[/val] - as portable document format[/i]
    [i][val]epub[/val] - as popular format for ebook readers[/i]

    md_content_id -- mandatory parameter for getting collection [exval]1309[/exval]
    md_version -- collection version [exval]1[/exval]
    variant -- collection variant [exval]student-canon[/exval]
    content_format -- mandatory parameter for define output file format [exval]pdf[/exval]
    version: 2.0
    auth_req: False
    """
    # TODO: fetch CollectionStaticFormat object from DB and use get_absolute_url?
    collection = get_object_or_404(Collection, md_content_id=md_content_id, md_version=md_version, variant=variant)
    for static_format in collection.static_formats.all():
        if not static_format.present_in_api:
                continue
        if static_format.specification.name == emission_format:
            return redirect(static_format.get_absolute_url())
    raise Http404("Emission format not exists")
    #return redirect(url_providers.get_static_format_url('content', md_content_id, md_version, variant, file_name))


# is it not registered in URs anyway, and seems to be redundant to get_collection_static_format
# @default_api_view(version='2.0')
# def get_collection_zip(request, md_content_id, md_version, variant, filename):
#     """
#     Collection generated file formats as zip containers[n]
#     [i][val]zip[/val] - as archive of full htmls and multimedia objects[/i]

#     md_content_id -- mandatory parameter for getting proper collection [exval]1309[/exval]
#     md_version -- collection version [exval]1[/exval]
#     variant -- collection variant [exval]student-canon[/exval]
#     filename -- mandatory parameter for getting package format [exval]mobile-480[/exval]
#     version: 2.0
#     auth_req: False
#     """
#     return redirect(url_providers.get_static_format_url('content', md_content_id, md_version, variant, '%s.zip' % filename))


@default_api_view(version='2.0')
def get_collection_cover(request, md_content_id, md_version, content_format):
    """
    [red]DEPRECATED[/red] Collection cover formats as popular image containers[n]
    Currently supported formats:
    [i][val]png[/val] - as lossless image format[/i]
    [i][val]jpg[/val] - as compressed image format[/i]
    [i][val]svg[/val] - as scalable vector image format[/i]

    md_content_id -- mandatory parameter for getting collection [exval]1309[/exval]
    content_format -- mandatory parameter for define output file format [exval]jpg[/exval]
    version: 2.0
    auth_req: False
    """
    if content_format == 'svg':
        return redirect_url_response(
            "%s/%s/%s/cover.%s" % (COLLECTION_PREFIX, md_content_id, md_version, content_format))
    else:
        return redirect_url_response(
            "%s/%s/%s/cover-980.%s" % (COLLECTION_PREFIX, md_content_id, md_version, content_format))


@default_api_view(version='2.0')
def get_collection_cover_thumb(request, md_content_id, content_format, md_version):
    """
    [red]DEPRECATED[/red] Collection cover thumbnails formats as popular image containers[n]
    Currently supported formats:
    [i][val]png[/val] - as lossless image format[/i]
    [i][val]jpg[/val] - as compressed image format[/i]
    [i][val]svg[/val] - as scalable vector image format[/i]

    md_content_id -- mandatory parameter for getting collection [exval]1309[/exval]
    content_format -- mandatory parameter for define output file format [exval]jpg[/exval]
    version: 2.0
    auth_req: False
    """
    if content_format == 'svg':
        return redirect_url_response(
            "%s/%s/%s/cover-thumb.%s" % (COLLECTION_PREFIX, md_content_id, md_version, content_format))
    else:
        return redirect_url_response(
            "%s/%s/%s/cover-120.%s" % (COLLECTION_PREFIX, md_content_id, md_version, content_format))


@default_api_view(version='2.0')
def get_collection_source(request, md_content_id, md_version, variant):
    """
    Collection source as xml file.

    md_content_id -- obligatory parameter for getting collection [exval]1309[/exval]
    md_version -- collection version [exval]1[/exval]
    variant -- collection variant [exval]student-canon[/exval]
    version: 2.0
    auth_req: False
    """
    return redirect(url_providers.get_collection_variant_xml_url('content', md_content_id, md_version, variant))


@default_api_view(version='2.0')
def get_module_source(request, md_content_id, md_version):
    """
    Module source as XML format - this is source format for all other conversions.

    md_content_id -- mandatory parameter for getting module [exval]i2dnVn3HHk[/exval]
    md_version -- mandatory parameter of module version
    version: 2.0
    auth_req: False
    """

    return redirect(url_providers.get_module_xml_url('content', md_content_id, md_version))


@default_api_view(version='2.0')
def get_module_html(request, collection_id, md_version, variant, module_id):
    """
    Module source as HTML format. Remember that module occurrence is connected with particular collection

    mod_collection_id -- mandatory parameter for collection with desired module
    md_version -- collection version [exval]1[/exval]
    variant -- collection variant [exval]student-canon[/exval]
    md_content_id -- mandatory parameter for getting module [exval]i2dnVn3HHk[/exval]
    version: 2.0
    auth_req: False
    """
    return redirect(url_providers.get_module_occurrence_html_url('content', collection_id, md_version, variant, module_id))


@default_api_view(version='2.0')
def get_collection_count(request):
    """
    Returns number of all collection in database.

    version: 2.0
    auth_req: False
    output_method: GET None None
    """
    return Response({'count': Collection.objects.count()})


@default_api_view(version='2.0')
def get_module_womis(request, md_content_id, md_version, variant, module_id):
    """
    Returns list of womis referenced to module

    version: 2.0
    auth_req: False
    output_method: GET md_content_id=1309;md_version=1;variant=student-canon;module_id=ikqbJhUjBW None c:0
    """
    collection = get_object_or_404(Collection, md_content_id=md_content_id, md_version=md_version, variant=variant)
    module_occurrence = collection.get_module_occurrence_or_404(module_id, with_volatile=False)
    womis = []
    for j in module_occurrence.referred_womis:
        womis.append({
            'womi_id': j.womi_id,
            'womi_type': unicode(j.womi_type),
            'title': j.title,
            'version': j.version,
            'manifest_url': j.manifest_url,
            'metadata_url': j.metadata_url,
            'referrences_number': j.referrences_number,

        })
    return Response(womis)


class MetadataDetail(api_version_decorator(generics.RetrieveAPIView)):
    multiple_lookup_fields = ['md_content_id', 'md_version', 'variant']

    def get_serializer_context(self):
        context = super(MetadataDetail, self).get_serializer_context()
        if 'fields' in self.request.QUERY_PARAMS:
            context.update({
                'fields': self.request.QUERY_PARAMS['fields'].split(',')
            })
        return context


class MetadataCollectionList(CollectionList, MetadataDetail):
    """
    Selectable collection list from the database. Returns a customized list of fields of a list of collections.[n]
    The output is more different than output form from [api v=2.0]/collections/[/api]
    because serves related object as serialized object (full structure) rather than only ids.[n]

    !school -- filter for school level with [val]id[/val] from [api v=2.0]/schools/[/api] [exval]1[/exval]
    !subject -- filter for classes level with [val]id[/val] from [api v=2.0]/subjects/[/api] [exval]1[/exval]
    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]
    !fields -- optional parameter which contains list of model fields.
    version: 2.0
    auth_req: False
    output_method: GET None None
    """

    def __init__(self, *args, **kwargs):
        self.default_version = '2.1'
        self.supported_versions = {'2.1': MetadataCollectionList,
                                   '2.0': remove_default_pagination(MetadataCollectionList)}
        super(CollectionList, self).__init__(*args, **kwargs)

    serializer_class = MetadataCollectionSerializer


class CollectionListMobile(CollectionList, MetadataDetail):
    paginate_by = None
    serializer_class = MobileCollectionSerializer

    def __init__(self, *args, **kwargs):
        self.default_version = '2.1'
        self.supported_versions = {'2.1': CollectionListMobile, '2.0': CollectionListMobile}
        super(CollectionList, self).__init__(*args, **kwargs)


    def get_queryset(self):

        collections = Collection.objects.published().official().exclude(md_school=None).filter(static_formats__specification_code='mobile-1920').all_latest(refetch=True)
        return collections.prefetch_related('static_formats', 'authorships__author', 'md_school', 'md_subject')
        # return Collection.objects.filter(id__in=[c.id for c in collections]).prefetch_related('static_formats', 'authorships__author', 'md_school', 'md_subject')


class CollectionFormats(CollectionDetail):
    """
    Emission formats for specific collection.

    md_content_id -- collection id [exval]1309[/exval]
    md_version -- collection version [exval]1[/exval]
    variant -- collection variant [exval]student-canon[/exval]
    version: 2.0
    auth_req: False
    output_method: GET md_content_id=1309;md_version=1;variant=student-canon None c:0
    """
    serializer_class = FormatSerializer

    def __init__(self, *args, **kwargs):
        super(CollectionFormats, self).__init__(*args, **kwargs)
        self.default_version = '2.1'


class CollectionCovers(CollectionDetail):
    """
    Cover links for specific collection.

    md_content_id -- collection id [exval]1309[/exval]
    md_version -- collection version [exval]1[/exval]
    variant -- collection variant [exval]student-canon[/exval]
    version: 2.0
    auth_req: False
    output_method: GET md_content_id=1309;md_version=1;variant=student-canon None c:0
    """
    serializer_class = CoverSerializer

    def __init__(self, *args, **kwargs):
        super(CollectionCovers, self).__init__(*args, **kwargs)
        self.default_version = '2.1'


class CollectionAuthors(CollectionDetail):

    serializer_class = CollectionAuthorSerializer

    def __init__(self, *args, **kwargs):
        super(CollectionAuthors, self).__init__(*args, **kwargs)
        self.default_version = '2.1'

class CollectionWomisDeep(api_version_decorator(generics.ListAPIView)):

    model = Womi
    serializer_class = WomiSerializer

    def __init__(self, *args, **kwargs):
        super(CollectionWomisDeep, self).__init__(*args, **kwargs)
        self.default_version = '2.1'

    def get_queryset(self):
        return Collection.objects.get(**self.kwargs).referred_womis_deep_overall



class MetadataCollectionDetail(MetadataDetail):
    """
    Selectable collection details from the database. Returns a customized list of fields of concrete model instance.[n]
    The output is more different than output form from [api v=2.0]/collections/<md_content_id>/<md_version>/<variant>[/api]
    because serves related object as serialized object (full structure) rather than only ids.[n]
    The parameter [val]id[/val] is not significant for API wide usage.
    Main identifier for collection is [val]md_content_id[/val].

    md_content_id -- obligatory parameter for getting collection [exval]1309[/exval]
    md_version -- collection version [exval]1[/exval]
    variant -- collection variant [exval]student-canon[/exval]
    !fields -- optional parameter which contains list of model fields.
    version: 2.0
    auth_req: False
    output_method: GET md_content_id=1309;md_version=1;variant=student-canon None c:0
    """

    def __init__(self, *args, **kwargs):
        super(MetadataCollectionDetail, self).__init__(*args, **kwargs)
        self.default_version = '2.0'

    model = Collection
    serializer_class = MetadataCollectionSerializer
    lookup_field = 'md_content_id'


class TmpModulesCollectionDetail(APIView):
    def __init__(self, *args, **kwargs):
        self.default_version = '2.0'
        super(TmpModulesCollectionDetail, self).__init__(*args, **kwargs)

    def get(self, request, *args, **kw):
        collection_toc = self.get_object()
        return Response(collection_toc)

    def get_object(self):
        coll = models.Config.get_collection_first_variant_or_404(self.kwargs['md_content_id'], self.kwargs['md_version'])

        collection_toc = self._sub_collection_lookup(coll.root_collection)
        return collection_toc

    def _sub_collection_lookup(self, sub_collection):
        object_list = []
        collections = SubCollection.objects.filter(parent_collection__id=sub_collection.id).prefetch_related(
            'module_orders')

        for collection in collections:
            object_list.append({'md_title': collection.md_title, 'modules': self._sub_collection_lookup(collection)})
        for mo in sub_collection.module_orders.all():
            m = mo.module
            object_list.append({'md_title': m.md_title, 'md_content_id': m.md_content_id, 'md_version': m.md_version})
        return object_list


class ModulesCollectionDetail(api_version_decorator(TmpModulesCollectionDetail)):
    """
    Hierarchical modules list for particular collection from the database. Returns an object with fields:[n]
    [i][val]md_content_id[/val] - content id of module (from [api v=2.0]/modules/<md_content_id>[/api])[/i]
    [i][val]md_title[/val] - title of module[/i]

    md_content_id -- mandatory parameter for getting collection [exval]1309[/exval]
    md_version -- mandatory parameter for getting collection [exval]1[/exval]
    variant -- mandatory parameter for getting collection [exval]student-canon[/exval]
    version: 2.0
    auth_req: False
    output_method: GET md_content_id=1309;md_version=1;variant=student-canon None c:0
    """
    multiple_lookup_fields = ['md_content_id', 'md_version', 'variant']

    def __init__(self, *args, **kwargs):
        self.default_version = '2.0'
        self.supported_versions = {'2.0': ModulesCollectionDetail, }
        super(ModulesCollectionDetail, self).__init__(*args, **kwargs)


    def get_object(self):
        coll = Collection.objects.get(md_content_id=self.kwargs['md_content_id'], md_version=self.kwargs['md_version'],
                                      variant=self.kwargs['variant'])
        collection_toc = self._sub_collection_lookup(coll.root_collection)
        return collection_toc


class ModulesCollectionDetail_v1(api_version_decorator(TmpModulesCollectionDetail)):
    """
    [red]DEPRECATED[/red] Hierarchical modules list for particular collection from the database. Returns an object with fields:[n]
    [i][val]md_content_id[/val] - content id of module (from [api v=2.0]/modules/<md_content_id>[/api])[/i]
    [i][val]md_title[/val] - title of module[/i]

    md_content_id -- mandatory parameter for getting collection [exval]1309[/exval]
    version: 1.0
    auth_req: False
    output_method: GET md_content_id=1309 None c:0
    """

    multiple_lookup_fields = ['md_content_id', 'md_version', 'variant']

    def __init__(self, *args, **kwargs):
        super(ModulesCollectionDetail_v1, self).__init__(*args, **kwargs)
        self.default_version = '1.0'

    def get_object(self):
        coll = models.Config.get_collection_first_variant_or_404(self.kwargs['md_content_id'], 1)
        collection_toc = self._sub_collection_lookup(coll.root_collection)
        return collection_toc


class ModuleDetail(api_version_decorator(generics.RetrieveAPIView)):
    """
    Module description from the database. Returns a particular module with all fields.
    Main identifier for module is [val]md_content_id[/val].


    md_content_id -- mandatory parameter for getting module [exval]ikqbJhUjBW[/exval]
    md_version -- mandatory parameter for getting module [exval]1[/exval]
    version: 2.0
    auth_req: False
    output_method: GET md_content_id=ikqbJhUjBW;md_version=1 None m:0
    """
    multiple_lookup_fields = ['md_content_id', 'md_version']
    model = Module
    serializer_class = ModuleSerializer
    lookup_field = 'md_content_id'

    def __init__(self, *args, **kwargs):
        super(ModuleDetail, self).__init__(*args, **kwargs)
        self.default_version = '2.0'


class MetadataModuleDetail(MetadataDetail):
    """
    Selectable module details from the database. Returns a customized list of fields of concrete model instance.[n]
    The output is more different than output form from [api v=2.0]/modules/<md_content_id>/<md_version>[/api]
    because serves related object as serialized object (full structure) rather than only ids.[n]
    The parameter [val]id[/val] is not significant for API wide usage.
    Main identifier for module is [val]md_content_id[/val].

    md_content_id -- obligatory parameter for getting module [exval]i2dnVn3HHk[/exval]
    md_version -- obligatory parameter for getting module [exval]1[/exval]
    !fields -- optional parameter which contains list of model fields.
    version: 2.0
    auth_req: False
    output_method: GET md_content_id=i2dnVn3HHk;md_version=1 None m:0
    """
    model = Module
    serializer_class = MetadataModuleSerializer
    multiple_lookup_fields = ['md_content_id', 'md_version']

    def __init__(self, *args, **kwargs):
        super(MetadataModuleDetail, self).__init__(*args, **kwargs)
        self.default_version = '2.0'


class ModuleList(api_version_decorator(generics.ListAPIView)):
    """
    Lists Modules from the database. Returns a full list of modules.
    Main identifier for module is [val]md_content_id[/val].

    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]

    version: 2.0
    auth_req: False
    output_method: GET None None
    """
    model = Module
    serializer_class = ModuleSerializer

    paginate_by_param = 'limit'
    paginate_by = DEFAULT_PAGINATION_BY

    def __init__(self, *args, **kwargs):
        self.default_version = '2.1'
        self.supported_versions = {
            '2.1': ModuleList,
            '2.0': remove_default_pagination(ModuleList)}
        super(ModuleList, self).__init__(*args, **kwargs)



class SubjectList(api_version_decorator(generics.ListAPIView)):
    """
    List of subjects in system. Method returns all available subjects. Subject names are in polish for now.

    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]

    version: 2.0
    auth_req: False
    output_method: GET None None
    """

    def __init__(self, *args, **kwargs):
        self.default_version = '2.0'
        self.supported_versions = {
            '2.1': SubjectList,
            '2.0': remove_default_pagination(SubjectList)}
        super(SubjectList, self).__init__(*args, **kwargs)

    model = Subject
    serializer_class = SubjectSerializer
    paginate_by_param = 'limit'
    paginate_by = DEFAULT_PAGINATION_BY


class SubjectDetail(api_version_decorator(generics.RetrieveAPIView)):
    """
    Details of particular subject. [val]id[/val] is main identifier for subject.
    This filed is significant when connecting related models from [api v=2.0]/collections/<md_content_id>/<md_version>/<variant>[/api] or
    [api v=2.0]/modules/<md_content_id>/<md_version>[/api].

    version: 2.0
    auth_req: False
    output_method: GET pk=1 None
    """

    def __init__(self, *args, **kwargs):
        super(SubjectDetail, self).__init__(*args, **kwargs)
        self.default_version = '2.0'

    multiple_lookup_fields = ['pk']
    model = Subject
    serializer_class = SubjectSerializer


class SchoolList(api_version_decorator(generics.ListAPIView)):
    """
    List of schools in system. Method returns all available schools.
    Meaning of particular fields:
    [i][val]md_education_level[/val] - this is educational level related with order of education level in Poland[/i]
    [i][val]ep_class[/val] - this is class number correlated with education level[/i]

    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]

    version: 2.0
    auth_req: False
    output_method: GET None None
    """
    model = SchoolLevel
    serializer_class = SchoolSerializer
    paginate_by_param = 'limit'
    paginate_by = DEFAULT_PAGINATION_BY

    def __init__(self, *args, **kwargs):
        self.default_version = '2.1'
        self.supported_versions = {
            '2.1': SchoolList,
            '2.0': remove_default_pagination(SchoolList)}
        super(SchoolList, self).__init__(*args, **kwargs)


class SchoolDetail(api_version_decorator(generics.RetrieveAPIView)):
    """
    Details of particular school. Method returns school object using [val]id[/val] as key.
    Meaning of particular fields:
    [i][val]md_education_level[/val] - this is educational level related with order of education level in Poland[/i]
    [i][val]ep_class[/val] - this is class number correlated with education level[/i]

    pk -- id of particular school object [exval]10[/exval]
    version: 2.0
    auth_req: False
    output_method: GET pk=1 None
    """

    def __init__(self, *args, **kwargs):
        super(SchoolDetail, self).__init__(*args, **kwargs)
        self.default_version = '2.0'

    multiple_lookup_fields = ['pk']
    model = SchoolLevel
    serializer_class = SchoolSerializer


class AuthorList(api_version_decorator(generics.ListAPIView)):
    """
    List of authors in system. Method returns all available authors.

    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]

    version: 2.0
    auth_req: False
    output_method: GET None None
    """

    def __init__(self, *args, **kwargs):
        self.default_version = '2.1'
        self.supported_versions = {
            '2.1': AuthorList,
            '2.0': remove_default_pagination(AuthorList)}
        super(AuthorList, self).__init__(*args, **kwargs)

    model = Author
    serializer_class = AuthorSerializer
    paginate_by_param = 'limit'
    paginate_by = DEFAULT_PAGINATION_BY


class AuthorDetail(api_version_decorator(generics.RetrieveAPIView)):
    """
    Details of particular author. Method returns author object with [val]id[/val] as key.
    [n]
    This filed is significant when connecting related models from [api v=2.0]/collections/<md_content_id>/<md_version>/<variant>[/api] or
    [api v=2.0]/modules/<md_content_id>/<md_version>[/api].

    pk -- id of particular author object [exval]10[/exval]
    version: 2.0
    auth_req: False
    output_method: GET pk=1 None
    """

    def __init__(self, *args, **kwargs):
        self.default_version = '2.0'
        super(AuthorDetail, self).__init__(*args, **kwargs)

    multiple_lookup_fields = ['pk']
    model = Author
    serializer_class = AuthorSerializer


class KeywordList(api_version_decorator(generics.ListAPIView)):
    """
    Simple list of keywords in system. Method returns all available keywords.

    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]

    version: 2.0
    auth_req: False
    output_method: GET None None
    """

    def __init__(self, *args, **kwargs):
        self.default_version = '2.1'
        self.supported_versions = {
            '2.1': KeywordList,
            '2.0': remove_default_pagination(KeywordList)}
        super(KeywordList, self).__init__(*args, **kwargs)

    model = Keyword
    serializer_class = KeywordSerializer
    paginate_by_param = 'limit'
    paginate_by = DEFAULT_PAGINATION_BY


class KeywordDetail(api_version_decorator(generics.RetrieveAPIView)):
    """
    Details of particular keyword. Method returns keyword object with [val]id[/val] as key.
    [n]
    This filed is significant when connecting related models from [api v=2.0]/collections/<md_content_id>/<md_version>/<variant>[/api] or
    [api v=2.0]/modules/<md_content_id>/<md_version>[/api].

    pk -- id of particular keyword object [exval]1[/exval]
    version: 2.0
    auth_req: False
    """

    def __init__(self, *args, **kwargs):
        super(KeywordDetail, self).__init__(*args, **kwargs)
        self.default_version = '2.0'

    multiple_lookup_fields = ['pk']
    model = Keyword
    serializer_class = KeywordSerializer


class CoreCurriculumList(api_version_decorator(generics.ListAPIView)):
    """
    Simple list of core curriculums in system. Method returns all available core curriculums.

    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]

    version: 2.0
    auth_req: False
    output_method: GET None None
    """

    def __init__(self, *args, **kwargs):
        self.default_version = '2.1'
        self.supported_versions = {
            '2.1': CoreCurriculumList,
            '2.0': remove_default_pagination(CoreCurriculumList)}
        super(CoreCurriculumList, self).__init__(*args, **kwargs)

    model = CoreCurriculum
    serializer_class = CoreCurriculumSerializer
    paginate_by_param = 'limit'
    paginate_by = DEFAULT_PAGINATION_BY


class CoreCurriculumDetail(api_version_decorator(generics.RetrieveAPIView)):
    """
    Details of particular core curriculum. Method returns core curriculum object with [val]id[/val] as key.
    [n]
    This filed is significant when connecting related models from [api v=2.0]/collections/<md_content_id>/<md_version>/<variant>[/api] or
    [api v=2.0]/modules/<md_content_id>/<md_version>[/api].

    pk -- id of particular keyword object [exval]1[/exval]
    version: 2.0
    auth_req: False
    output_method: GET pk=1 None
    """

    def __init__(self, *args, **kwargs):
        super(CoreCurriculumDetail, self).__init__(*args, **kwargs)
        self.default_version = '2.0'

    multiple_lookup_fields = ['pk']
    model = CoreCurriculum
    serializer_class = CoreCurriculumSerializer


class WomiList(api_version_decorator(generics.ListAPIView)):
    """
    Lists Womis from the database. Returns a full list of womis.
    Main identifier for womi is [val]womi_id[/val].

    !limit -- limits result count to amount of value of this parameter [exval]4[/exval]
    !page -- shows page of results when limit is set [exval]1[/exval]

    version: 2.0
    auth_req: False
    output_method: GET None None
    """

    def __init__(self, *args, **kwargs):
        self.default_version = '2.1'
        self.supported_versions = {
            '2.1': WomiList,
            '2.0': remove_default_pagination(WomiList)}
        super(WomiList, self).__init__(*args, **kwargs)

    model = Womi
    serializer_class = WomiSerializer
    paginate_by_param = 'limit'
    paginate_by = DEFAULT_PAGINATION_BY


class WomiDetail(api_version_decorator(generics.RetrieveAPIView)):
    """
    Details of particular womi. Method returns womi object with [val]womi_id[/val] as key.
    [n]

    womi_id -- id of particular womi object [exval]669[/exval]
    version: 2.0
    auth_req: False
    output_method: GET womi_id=32463 None
    """

    def __init__(self, *args, **kwargs):
        super(WomiDetail, self).__init__(*args, **kwargs)
        self.default_version = '2.0'

    multiple_lookup_fields = ['womi_id']
    model = Womi
    serializer_class = WomiSerializer



def home(request):
    title = "Developers Home"
    return django.shortcuts.render(request, 'home.html', {'title': title, 'pages': pages})


def version(request):
    title = "API Version Negotiation"
    return django.shortcuts.render(request, 'version.html', {'title': title, 'pages': pages})


def format(request):
    title = 'Format Param and Content Negotiation'
    return django.shortcuts.render(request, 'format.html', {'title': title, 'pages': pages})


def source_formats(request):
    title = 'Source formats - XML Languages'
    return django.shortcuts.render(request, 'xml_languages.html', {'title': title, 'pages': pages})


def root_index(request):
    title = 'API Methods Index'
    return django.shortcuts.render(request, 'root_index.html', {'title': title, 'pages': pages})


def method_detail(request):
    return django.shortcuts.render(request, 'method_detail.html', {'pages': pages})
