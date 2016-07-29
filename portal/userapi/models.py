# Create your models here.
from datetime import datetime
from uuid import uuid1
from cassandra.cqlengine import columns
from cassandra.cqlengine.models import Model
from django.db.models import signals


old_model_save = Model.save

def new_save(self):
    instance = old_model_save(self)
    signals.post_save.send(sender=self.__class__, instance=instance, created=None,
                                   update_fields=None, raw=None, using=None)
    return instance

Model.save = new_save


class UserData(Model):
    user_id = columns.Text(required=True, primary_key=True, partition_key=True)
    origin = columns.Text()
    school_name = columns.Text()
    bio = columns.Text()
    account_type = columns.Integer(default=0)
    gender = columns.Integer(default=0)
    avatar_descriptor = columns.UUID()
    avatar_type = columns.Integer()
    agreement_accepted = columns.Boolean(default=False)


class WomiState(Model):
    user_id = columns.Text(required=True, primary_key=True, partition_key=True)
    bookpart_id = columns.Text(required=True, primary_key=True, partition_key=True)
    womi_id = columns.Text(required=True, primary_key=True, clustering_order='asc')
    name = columns.Text(required=True, primary_key=True, clustering_order='asc')
    value = columns.Text()
    modify_time = columns.DateTime(default=datetime.now)


class Notes(Model):
    user_id = columns.Text(required=True, partition_key=True, primary_key=True)
    handbook_id = columns.Text(required=True, partition_key=True, primary_key=True)
    module_id = columns.Text(required=True, primary_key=True, clustering_order='asc')
    note_id = columns.UUID(required=True, primary_key=True, default=uuid1, clustering_order='asc')
    location = columns.Text(required=True)
    page_id = columns.Text(required=True)
    subject = columns.Text()
    value = columns.Text()
    text = columns.Text()
    type = columns.Integer(default=0)
    accepted = columns.Boolean(default=False)
    reference_to = columns.Text()
    referenced_by = columns.Set(columns.Text)
    modify_time = columns.DateTime(default=datetime.now)


class NotesTimeline(Model):
    user_id = columns.Text(required=True, primary_key=True)
    handbook_id = columns.Text(required=True)
    module_id = columns.Text(required=True)
    note_id = columns.UUID(required=True)
    location = columns.Text(required=True)
    page_id = columns.Text(required=True)
    subject = columns.Text()
    value = columns.Text()
    text = columns.Text()
    type = columns.Integer(default=0)
    accepted = columns.Boolean(default=False)
    reference_to = columns.Text()
    modify_time = columns.DateTime(default=datetime.now, primary_key=True, clustering_order='desc')


class TaskProgress(Model):
    user_id = columns.Text(required=True, partition_key=True, primary_key=True)
    handbook_id = columns.Text(required=True, partition_key=True, primary_key=True)
    module_id = columns.Text(required=True, primary_key=True, clustering_order='asc')
    womi_id = columns.Text(required=True, primary_key=True, clustering_order='asc')
    succ_tries = columns.Counter()
    num_tries = columns.Counter()


class TaskProgressTimeline(Model):
    user_id = columns.Text(required=True, primary_key=True)
    handbook_id = columns.Text(required=True, primary_key=True, clustering_order='asc')
    modify_time = columns.DateTime(default=datetime.now, primary_key=True, clustering_order='desc')
    womi_id = columns.Text(required=True)


class AggregateTasksProgress(Model):
    user_id = columns.Text(required=True, primary_key=True, partition_key=True)
    handbook_id = columns.Text(required=True, primary_key=True, partition_key=True)
    succ_tries = columns.Counter()
    num_tries = columns.Counter()


class AggregateTasksTimeline(Model):
    user_id = columns.Text(required=True, primary_key=True)
    handbook_id = columns.Text(required=True, primary_key=True, clustering_order='asc')
    modify_time = columns.DateTime(default=datetime.now, primary_key=True, clustering_order='desc')


# class FileStore(Model):
#     user_id = columns.Text(required=True, primary_key=True, partition_key=True)
#     descriptor = columns.UUID(required=True, primary_key=True, partition_key=True, default=uuid1)
#     filename = columns.Text()
#     type = columns.Text()
#     data = columns.Blob()
#     modify_time = columns.DateTime(default=datetime.now)

# updated model should be a new table (model)
class FileStore2(Model):
    user_id = columns.Text(required=True, primary_key=True, partition_key=True)
    descriptor = columns.UUID(required=True, primary_key=True, default=uuid1)
    filename = columns.Text()
    type = columns.Text()
    data = columns.Blob()
    modify_time = columns.DateTime(default=datetime.now)


class LastViewedCollections(Model):
    user_id = columns.Text(required=True, primary_key=True)
    handbook_id = columns.Text(required=True, primary_key=True, clustering_order='asc')
    modify_time = columns.DateTime(default=datetime.now)


class OpenQuestion(Model):
    user_id = columns.Text(required=True, partition_key=True, primary_key=True)
    handbook_id = columns.Text(required=True, partition_key=True, primary_key=True)
    module_id = columns.Text(required=True, primary_key=True)
    question_id = columns.Text(required=True, primary_key=True)
    place = columns.Integer(default=0)  # 0 - module, 1 - auto
    page_id = columns.Text()
    problem = columns.Text()
    value = columns.Text()
    modify_time = columns.DateTime(default=datetime.now)


class HealthCheck(Model):
    myid = columns.Text(required=True, partition_key=True, primary_key=True)
    value = columns.Text(required=True)
 

class UserMyTeacher(Model):
    user_id = columns.Text(required=True, partition_key=True, primary_key=True)
    level_id = columns.Integer(required=True, primary_key=True)
    subject_id = columns.Integer(required=True, primary_key=True)
    email = columns.Text(required=True)
