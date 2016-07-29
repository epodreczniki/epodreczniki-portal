from auth.views import EpoObtainJSONWebToken
from django.conf.urls import *
from django.conf import settings
from userapi.views import UserNoteAPI, ListUserNotesAPI, WomiStateAPI, ListTaskProgressAPI, ListTaskProgressTimelineAPI, \
    ListAggregateTasksProgressAPI, ListAggregateTasksTimelineAPI, ListUserNotesTimelineAPI, ListWomiStateAPI, \
    FileStoreAPI, FileStorePreviewAPI, search_notes, LastViewedCollectionAPI, ListLastViewedCollectionAPI, \
    OpenQuestionAPI, ListOpenQuestionAPI, open_question_search, UserMyTeacherAPI, ListUserMyTeacherAPI, \
    ListUserNotesStatsAPI, count_collection_notes

urlpatterns = patterns('userapi.views',
    url(r'^api_auth$', EpoObtainJSONWebToken.as_view()),
)

if settings.EPO_ENABLE_USERAPI:
    urlpatterns += patterns('userapi.views',
        url(r'^womi_state/(?P<bookpart_id>[\w:-]+)/(?P<womi_id>\w+)/(?P<name>[_\w-]+)$', WomiStateAPI.as_view(), name='userapi-womi-state-key'),
        url(r'^womi_state/(?P<bookpart_id>[\w:-]+)/$', ListWomiStateAPI.as_view(), name='userapi-womi-state-collection'),

        url(r'^notes/(?P<handbook_id>[\w:-]+)/(?P<module_id>\w+)/(?P<note_id>[\w-]+)$', UserNoteAPI.as_view(), name='userapi-notes-note'),
        url(r'^notes/(?P<handbook_id>[\w:-]+)/$', ListUserNotesAPI.as_view(), name='userapi-notes-collection'),
        url(r'^notes_timeline/$', ListUserNotesTimelineAPI.as_view(), name='userapi-notes-timeline'),
        url(r'^notes_search/$', search_notes, name='userapi-notes-search'),
        url(r'^notes_stats/$', ListUserNotesStatsAPI.as_view(), name='userapi-notes-stats'),

        url(r'^task_progress/(?P<handbook_id>[\w:-]+)/(?P<module_id>\w+)/$', ListTaskProgressAPI.as_view(), name='userapi-task-progress-module'),
        url(r'^task_progress/(?P<handbook_id>[\w:-]+)/$', ListTaskProgressAPI.as_view(), name='userapi-task-progress-collection'),

        url(r'^task_progress_timeline/(?P<handbook_id>[\w:-]+)/(?P<module_id>\w+)/$', ListTaskProgressTimelineAPI.as_view(), name='userapi-task-progress-timeline-module'),
        url(r'^task_progress_timeline/(?P<handbook_id>[\w:-]+)/$', ListTaskProgressTimelineAPI.as_view(), name='userapi-task-progress-timeline-collection'),

        url(r'^aggregate_tasks_progress/(?P<handbook_id>[\w:-]+)/$', ListAggregateTasksProgressAPI.as_view(), name='userapi-aggregate-tasks-progress-collection'),

        url(r'^aggregate_tasks_timeline/$', ListAggregateTasksTimelineAPI.as_view(), name='userapi-aggregate-tasks-timeline-collection'),

        url(r'^file_store/save_file/(?P<descriptor>[\w-]+)$', FileStoreAPI.as_view(), name='userapi-filestore-save-descriptor'),
        url(r'^file_store/save_file$', FileStoreAPI.as_view(), name='userapi-filestore-save'),

        url(r'^file_store/preview/(?P<descriptor>[\w-]+)$', FileStorePreviewAPI.as_view(), name='userapi-filestore-preview'),

        url(r'^last_collections/(?P<handbook_id>[\w:-]+)$', LastViewedCollectionAPI.as_view(), name='userapi-last-viewed-collection-put'),
        url(r'^last_collections/$', ListLastViewedCollectionAPI.as_view(), name='userapi-last-viewed-collections'),
        url(r'^last_collections_stats/$', count_collection_notes, name='userapi-last-viewed-collections-stats'),

        url(r'^open_question/(?P<handbook_id>[\w:-]+)/(?P<module_id>\w+)/(?P<question_id>[\w-]+)$', OpenQuestionAPI.as_view(), name='userapi-open-question-update'),
        url(r'^open_question/(?P<handbook_id>[\w:-]+)/$', ListOpenQuestionAPI.as_view(), name='userapi-open-question-list'),
        url(r'^open_question_search/$', open_question_search, name='userapi-open-question-search'),

        url(r'^user_teacher/update$', UserMyTeacherAPI.as_view(), name='userapi-user-teacher-update'),
        url(r'^user_teacher/list$', ListUserMyTeacherAPI.as_view(), name='userapi-user-teacher-list')
    )
