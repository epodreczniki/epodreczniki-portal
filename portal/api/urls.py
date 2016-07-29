from api import views
from api.decorators import default_view
from django.conf.urls import patterns, url
from api.views import CollectionList, CollectionDetail, SubjectList, SubjectDetail, SchoolList, SchoolDetail, CoreCurriculumList, CoreCurriculumDetail,\
    WomiList, WomiDetail, ModulesCollectionDetail_v1, CollectionDetail_v1_0, CollectionDetail_old, CollectionListMobile, \
    CollectionFormats, CollectionCovers, CollectionAuthors, CollectionWomisDeep
from api.views import MetadataCollectionDetail, ModulesCollectionDetail, ModuleDetail, MetadataModuleDetail
from api.views import AuthorList, AuthorDetail, KeywordList, KeywordDetail, api_root, MetadataCollectionList,\
    ModuleList
from api import doc_urls
raw_urlpatterns = patterns('api.views',
                           url(r'^$', default_view(api_root), name='api-root'),
                           url(r'^collections_mobile/$', default_view(CollectionListMobile.as_view()), name='collection-list-mobile'), #
                           url(r'^collections/$', default_view(CollectionList.as_view()), name='collection-list'), #
                           url(r'^collections/metadata$', default_view(MetadataCollectionList.as_view()), #
                               name='metadata-collection-list'),
                           url(r'^collections/count$', default_view(views.get_collection_count), #
                               name='collection-count'),

                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)$', #
                               default_view(CollectionDetail.as_view()), name='collection-detail'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)/formats$',
                               default_view(CollectionFormats.as_view()), name='collection-formats'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)/covers$',
                               default_view(CollectionCovers.as_view()), name='collection-covers'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)/authors$',
                               default_view(CollectionAuthors.as_view()), name='collection-authors'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)/womis-deep$',
                               default_view(CollectionWomisDeep.as_view()), name='collection-womis'),
                           url(r'^collections/(?P<md_content_id>\w+)$', default_view(CollectionDetail_old.as_view()),
                               name='collection-detail-old'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)/modules$', #
                               default_view(ModulesCollectionDetail.as_view()), name='collection-detail-modules'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)/metadata$',
                               default_view(MetadataCollectionDetail.as_view()), name='metadata-collection-detail'),
                           url(r'^collections/(?P<md_content_id>\w+)/modules$',
                               default_view(ModulesCollectionDetail_v1.as_view()), name='collection-modules-v1-0'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)\.xml$',
                               default_view(views.get_collection_source), name='collection-source'),
                           url(r'^collections/(?P<collection_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)/(?P<module_id>[\w\-]+)\.html$',
                               default_view(views.get_module_html), name='module-html'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)/(?P<emission_format>[\w\.-]+)$', #
                               default_view(views.get_collection_static_format), name='collection-format'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/cover\.(?P<content_format>(jpg|png|svg))$',
                               default_view(views.get_collection_cover), name='collection-cover'),
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/cover-thumb\.(?P<content_format>(jpg|png|svg))$',
                               default_view(views.get_collection_cover_thumb), name='collection-cover-thumb'),


                           url(r'^modules/$', default_view(ModuleList.as_view()), name='module-list'), #
                           url(r'^modules/(?P<md_content_id>\w+)/(?P<md_version>\d+)$', #
                               default_view(ModuleDetail.as_view()), name='module-detail'),
                           url(r'^modules/(?P<md_content_id>\w+)/(?P<md_version>\d+)/metadata$', #
                               default_view(MetadataModuleDetail.as_view()), name='metadata-module-detail'),
                           url(r'^modules/(?P<md_content_id>\w+)/(?P<md_version>\d+)/source$', #
                               default_view(views.get_module_source), name='module-source'),

                           url(r'^subjects/$', default_view(SubjectList.as_view()), name='subject-list'), #
                           url(r'^subjects/(?P<pk>\d+)$', default_view(SubjectDetail.as_view()), name='subject-detail'), #
                           url(r'^schools/$', default_view(SchoolList.as_view()), name='school-list'), #
                           url(r'^schools/(?P<pk>\d+)$', default_view(SchoolDetail.as_view()), name='school-detail'), #
                           url(r'^authors/$', default_view(AuthorList.as_view()), name='author-list'), #
                           url(r'^authors/(?P<pk>\d+)$', default_view(AuthorDetail.as_view()), name='author-detail'),#
                           url(r'^keywords/$', default_view(KeywordList.as_view()), name='keyword-list'),
                           url(r'^keywords/(?P<pk>\d+)$', default_view(KeywordDetail.as_view()), name='keyword-detail'),
                           url(r'^core_curriculums/$', default_view(CoreCurriculumList.as_view()), name='core-curriculum-list'), #
                           url(r'^core_curriculums/(?P<pk>\d+)$', default_view(CoreCurriculumDetail.as_view()), name='core-curriculum-detail'), #

                           url(r'^womis/$', default_view(WomiList.as_view()), name='womi-list'), #
                           url(r'^womis/(?P<womi_id>\d+)$', default_view(WomiDetail.as_view()), name='womi-detail'), #
                           url(r'^collections/(?P<md_content_id>\w+)/(?P<md_version>\d+)/(?P<variant>[\w\-]+)/(?P<module_id>\w+)/womis$',
                               default_view(views.get_module_womis), name='module-womis-list'),

)

# Format suffixes
urlpatterns = raw_urlpatterns # format_suffix_patterns(raw_urlpatterns, allowed=['json', 'xml', 'api'])
urlpatterns += doc_urls.urlpatterns
