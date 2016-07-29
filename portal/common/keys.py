from surround.django.utils import CacheKey

app = CacheKey('common')


subject = app + ':subject'

model_object = '{category}:{identifier}:{version}'

handbook_ids = app + 'all_handbook_ids'

handbooks_map = app + 'all_handbooks_map'

subject_handbook_list = subject + ':s:{subject_id}'

all_subjects = subject + ':all'

filter_for_query = app + {':{model_name}:query:{query}'}

module_from_collection = app + ':{identifier}:{version}:{variant}:{module_id}'