from datetime import datetime, timedelta
import json

from auth.authentication import EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication
from auth.exceptions import EntityTooLargeException
from common.endpoint import UserEndpointBase, endpoint, endpoint_string_pattern
from common.models_cache import all_handbook_ids, get_handbook_ids_for_subject, all_handbooks_map
from django.conf import settings
from django.http import HttpResponse, Http404, HttpResponseForbidden
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from surround.django.simple_cors.decorators import cors_headers
from userapi.interceptors import TaskProgressInterceptor, TaskProgressTimelineInterceptor, \
    AggregateTasksProgressInterceptor, AggregateTasksTimelineInterceptor, NotesTimelineInterceptor
from userapi.models import Notes, WomiState, TaskProgress, TaskProgressTimeline, AggregateTasksProgress, \
    AggregateTasksTimeline, NotesTimeline, FileStore2, LastViewedCollections, OpenQuestion, UserMyTeacher
from userapi.rest import RetrieveUpdateDestroyAPIView, ListAPIView, RetrieveUpdateAPIView, PostDestroyAPIView, \
    CQLRestAPIView, UpdateAPIView
from userapi.serializers import NotesSerializer, WomiStateSerializer, TaskProgressSerializer, \
    TaskProgressTimelineSerializer, AggregateTasksProgressSerializer, AggregateTasksTimelineSerializer, \
    NotesTimelineSerializer, FileStoreSerializer, LastViewedCollectionsSerializer, OpenQuestionSerializer, \
    UserMyTeacherSerializer, NotesStatsSerializer


class WomiStateAPI(RetrieveUpdateAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = WomiStateSerializer
    model = WomiState
    interceptors = [TaskProgressInterceptor, TaskProgressTimelineInterceptor, AggregateTasksProgressInterceptor,
                    AggregateTasksTimelineInterceptor]

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }

    def create_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }

    def update_single_object(self, single_object, request, *args, **kwargs):
        single_object.modify_time = datetime.now()
        single_object.value = request.body


class ListWomiStateAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = WomiStateSerializer
    model = WomiState

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class UserNoteAPI(RetrieveUpdateDestroyAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = NotesSerializer
    model = Notes
    interceptors = [NotesTimelineInterceptor]

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }

    def create_additional_kwargs(self, request, *args, **kwargs):
        data = json.loads(request.body)
        return {
            'user_id': str(request.user.pk),
            'location': json.dumps(data['location']),
            'page_id': data['pageId'],
            'value': data['value'] if 'value' in data else ' ',
            'text': data.get('text', ''),
            'subject': data['subject'] if 'subject' in data else None,
            'type': data['type'],
            'accepted': data['accepted'],
            'modify_time': datetime.now()
        }

    def update_single_object(self, single_object, request, *args, **kwargs):
        data = json.loads(request.body)
        single_object.location = json.dumps(data['location'])
        single_object.value = data['value'] if 'value' in data else ' '
        single_object.text = data.get('text', '')
        single_object.subject = data['subject'] if 'subject' in data else None
        single_object.type = data['type']
        single_object.accepted = data['accepted']
        single_object.modify_time = datetime.now()


class ListUserNotesAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = NotesSerializer
    model = Notes
    context_query_params = ['use_related']

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class ListUserNotesTimelineAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = NotesTimelineSerializer
    model = NotesTimeline
    default_limit = 30
    context_query_params = ['use_related']

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class ListUserNotesStatsAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = NotesStatsSerializer
    model = NotesTimeline
    context_query_params = ['use_related']

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk),
            'modify_time__gt': datetime.now() - timedelta(days=11)
        }

    def post_filter(self, objects, filters):
        handbooks_map = all_handbooks_map()
        def note_id_hash(obj):
            def __hash__(self):
                return self.note_id
            obj.__hash__ = __hash__
            return obj

        _objects = set([note_id_hash(obj) for obj in objects])

        date_map = dict()

        class DateTasks(object):
            def __init__(self, date):
                self.date = date
                self.tasks = 0
                self.collections = []
                self._collections_map = {}

            def incr(self):
                self.tasks += 1

            def add_collection(self, handbook_id):
                if handbook_id not in self._collections_map:
                    self._collections_map[handbook_id] = True
                    if handbook_id in handbooks_map:
                        self.collections.append(handbooks_map[handbook_id])

        for obj in _objects:
            if obj.modify_time.date() not in date_map:
                date_map[obj.modify_time.date()] = DateTasks(obj.modify_time.date())
            d = date_map.get(obj.modify_time.date())
            d.add_collection(obj.handbook_id)
            d.incr()

        return date_map.values()


class ListTaskProgressAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TaskProgressSerializer
    model = TaskProgress

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class ListTaskProgressTimelineAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = TaskProgressTimelineSerializer
    model = TaskProgressTimeline
    default_limit = 100

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class ListAggregateTasksProgressAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = AggregateTasksProgressSerializer
    model = AggregateTasksProgress

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class ListAggregateTasksTimelineAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = AggregateTasksTimelineSerializer
    model = AggregateTasksTimeline
    default_limit = 100

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class FileStoreAPI(PostDestroyAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    model = FileStore2
    serializer_class = FileStoreSerializer

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }

    def create_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }

    def delete_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }

    def get_single_object(self, request, *args, **kwargs):
        if 'descriptor' not in kwargs:
            return None
        else:
            return super(FileStoreAPI, self).get_single_object(request, *args, **kwargs)

    def update_single_object(self, single_object, request, *args, **kwargs):
        single_object.modify_time = datetime.now()
        f = request.FILES['file']
        if f.size > pow(2, 19):
            raise EntityTooLargeException()
        single_object.type = f.content_type
        single_object.data = f.read()
        single_object.filename = f.fullname

    def post(self, request, *args, **kwargs):
        existing_objects_count = self.get_multiple_objects(request, *args, **kwargs).count()
        if settings.EPO_USERAPI_IMAGES_LIMIT < existing_objects_count:
            return HttpResponseForbidden()
        return super(FileStoreAPI, self).post(request, *args, **kwargs)


class FileStorePreviewAPI(CQLRestAPIView):
    authentication_classes = (SessionAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    model = FileStore2
    serializer_class = FileStoreSerializer

    def get(self, request, descriptor):
        try:
            file_to_serve = self.model.get(user_id=str(request.user.pk), descriptor=descriptor)
        except self.model.DoesNotExist:
            raise Http404
        return HttpResponse(file_to_serve.data, content_type=file_to_serve.type)


class LastViewedCollectionAPI(UpdateAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    model = LastViewedCollections
    serializer_class = LastViewedCollectionsSerializer
    use_related = 'no'

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }

    def create_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class ListLastViewedCollectionAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    model = LastViewedCollections
    serializer_class = LastViewedCollectionsSerializer

    use_related = 'yes'

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class OpenQuestionAPI(RetrieveUpdateDestroyAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = OpenQuestionSerializer
    model = OpenQuestion

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }

    def create_additional_kwargs(self, request, *args, **kwargs):
        data = json.loads(request.body)
        return {
            'user_id': str(request.user.pk),
            'page_id': data.get('pageId', ''),
            'value': data.get('value', ' '),
            'place': data.get('place', 0),
            'problem': data.get('problem', None),
            'modify_time': datetime.now()
        }

    def update_single_object(self, single_object, request, *args, **kwargs):
        data = json.loads(request.body)
        single_object.value = data.get('value', ' ')
        single_object.problem = data.get('problem', None)
        single_object.modify_time = datetime.now()


class ListOpenQuestionAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = OpenQuestionSerializer
    model = OpenQuestion
    context_query_params = ['use_related']

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


class UserMyTeacherAPI(PostDestroyAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserMyTeacherSerializer
    model = UserMyTeacher

    def get_additional_kwargs(self, request, *args, **kwargs):
        data = json.loads(request.body)
        return {
            'user_id': str(request.user.pk),
            'level_id': data.get('level_id', 0),
            'subject_id': data.get('subject_id', 0),
        }

    def create_additional_kwargs(self, request, *args, **kwargs):
        data = json.loads(request.body)
        return {
            'user_id': str(request.user.pk),
            'level_id': data.get('level_id', 0),
            'subject_id': data.get('subject_id', 0),
            'email': data.get('email', ' ')
        }

    def update_single_object(self, single_object, request, *args, **kwargs):
        data = json.loads(request.body)
        single_object.email = data.get('email', ' ')


class ListUserMyTeacherAPI(ListAPIView):
    authentication_classes = (EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserMyTeacherSerializer
    model = UserMyTeacher

    def get_additional_kwargs(self, request, *args, **kwargs):
        return {
            'user_id': str(request.user.pk)
        }


def search_notes(request):
    mode = request.GET.get('mode', 'latest')

    if mode == 'latest':
        return ListUserNotesTimelineAPI.as_view()(request)
    elif mode == 'filter':
        filters = {}
        kwargs = {}
        if 'subject' in request.GET and request.GET['subject'] != 'all':
            kwargs['handbook_id'] = get_handbook_ids_for_subject(int(request.GET['subject']))
        else:
            kwargs['handbook_id'] = all_handbook_ids()


        if 'color' in request.GET:
            filters['type'] = int(request.GET.get('color', 0))

        if 'type' in request.GET:
            if request.GET['type'] == 'note':
                filters['subject'] = None
            elif request.GET['type'] == 'bookmark':
                filters['value'] = ''

        if 'dateStart' in request.GET:
            if request.GET['dateStart'] != "-1":
                filters['modify_time__gt'] = datetime.fromtimestamp(float(request.GET['dateStart'])/1000.0)

        if 'dateEnd' in request.GET:
            if request.GET['dateEnd'] != "-1":
                filters['modify_time__lt'] = datetime.fromtimestamp(float(request.GET['dateEnd'])/1000.0)
        return ListUserNotesAPI.as_view(filters=filters)(request, **kwargs)
    else:
        return Response([])


def open_question_search(request):
    mode = request.GET.get('mode', 'latest')
    if mode == 'latest':
        return ListOpenQuestionAPI.as_view()(request, **{'handbook_id': all_handbook_ids()})
    elif mode == 'filter':
        filters = {}
        kwargs = {}
        if 'subject' in request.GET and request.GET['subject'] != 'all':
            kwargs['handbook_id'] = get_handbook_ids_for_subject(int(request.GET['subject']))
        else:
            kwargs['handbook_id'] = all_handbook_ids()

        if 'dateStart' in request.GET:
            if request.GET['dateStart'] != "-1":
                filters['modify_time__gt'] = datetime.fromtimestamp(float(request.GET['dateStart'])/1000.0)

        if 'dateEnd' in request.GET:
            if request.GET['dateEnd'] != "-1":
                filters['modify_time__lt'] = datetime.fromtimestamp(float(request.GET['dateEnd'])/1000.0)
        return ListOpenQuestionAPI.as_view(filters=filters)(request, **kwargs)
    else:
        return Response([])


@cors_headers(profile='userapi')
@api_view(['POST'])
@authentication_classes((EpoAuthTokenAuthentication, EpoJSONWebTokenAuthentication,))
@permission_classes((IsAuthenticated,))
def count_collection_notes(request):
    handbook_ids = json.loads(request.body)
    result = {}

    def count_stats(notes):
        _notes, bookmarks = 0, 0
        for note in notes:
            if note.subject is None:
                _notes += 1
            else:
                bookmarks += 1
        return _notes, bookmarks

    for handbook_id in handbook_ids:
        result[handbook_id] = count_stats(Notes.objects(user_id=str(request.user.pk), handbook_id=handbook_id))

    return Response(result)


FORCE_SECURE_ENDPOINT = settings.EPO_USERAPI_FORCE_SECURE


class WomiStateEndpoint(UserEndpointBase):
    name = 'womi_states'

    @endpoint
    def womi_state_key(self):
        return endpoint_string_pattern('userapi-womi-state-key', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def womi_state_collection(self):
        return endpoint_string_pattern('userapi-womi-state-collection', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)


class NotesEndpoint(UserEndpointBase):
    name = 'notes'

    @endpoint
    def note_update(self):
        return endpoint_string_pattern('userapi-notes-note', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def note_delete(self):
        return endpoint_string_pattern('userapi-notes-note', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def note_collection(self):
        return endpoint_string_pattern('userapi-notes-collection', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def timeline(self):
        return endpoint_string_pattern('userapi-notes-timeline', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def search(self):
        return endpoint_string_pattern('userapi-notes-search', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def stats(self):
        return endpoint_string_pattern('userapi-notes-stats', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)


class UserProgressEndpoint(UserEndpointBase):
    name = 'user_progress'

    @endpoint
    def task_progress_module(self):
        return endpoint_string_pattern('userapi-task-progress-timeline-module', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def task_progress_collection(self):
        return endpoint_string_pattern('userapi-task-progress-timeline-collection', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def aggregate_tasks_progress(self):
        return endpoint_string_pattern('userapi-aggregate-tasks-progress-collection', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def aggregate_tasks_timeline(self):
        return endpoint_string_pattern('userapi-aggregate-tasks-progress-collection', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)


class FileStoreEndpoint(UserEndpointBase):
    name = 'file_store'

    @endpoint
    def save_file(self):
        return endpoint_string_pattern('userapi-filestore-save', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def save_file_descriptor(self):
        return endpoint_string_pattern('userapi-filestore-save-descriptor', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def preview_file(self):
        return endpoint_string_pattern('userapi-filestore-preview', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)


class LastViewedCollectionsEndpoint(UserEndpointBase):
    name = 'last_collections'

    @endpoint
    def put_viewed(self):
        return endpoint_string_pattern('userapi-last-viewed-collection-put', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def list(self):
        return endpoint_string_pattern('userapi-last-viewed-collections', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def stats(self):
        return endpoint_string_pattern('userapi-last-viewed-collections-stats', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)


class OpenQuestionEndpoint(UserEndpointBase):
    name = 'open_question'

    @endpoint
    def question_update(self):
        return endpoint_string_pattern('userapi-open-question-update', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def question_list(self):
        return endpoint_string_pattern('userapi-open-question-list', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def question_search(self):
        return endpoint_string_pattern('userapi-open-question-search', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)


class UserMyTeacherEndpoint(UserEndpointBase):
    name = 'user_teacher'

    @endpoint
    def update(self):
        return endpoint_string_pattern('userapi-user-teacher-update', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def delete(self):
        return endpoint_string_pattern('userapi-user-teacher-update', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)

    @endpoint
    def list(self):
        return endpoint_string_pattern('userapi-user-teacher-list', with_host=True,
                                       pattern_subdomain='user',
                                       force_secure=FORCE_SECURE_ENDPOINT)
