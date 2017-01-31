# coding=utf-8
from __future__ import absolute_import

from elasticsearch import Elasticsearch, helpers
import os
import json
from django.conf import settings
import requests
import copy
import itertools
import editcommon.objects
from surround.django import redis
from . import keys
from . import exceptions
from django.utils import encoding
from celery.contrib.methods import task as method_task
from django.utils.functional import cached_property

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())

MATCH_ALL_QUERY = {u"query": {u"match_all": {}}}


QUERY_MODES = {
    u"term": u"term",
    u"in": u"terms",
    u"prefix": u"prefix",
    u"match": u"match",
    u"phrase": u"match_phrase",
    u"wildcard": u"wildcard",
    u"fuzzy": u"fuzzy",
    u"exact": u"match_phrase",
    u"range": u"range",
}


def chain_iterations_for_all_categories(func):
    return itertools.chain(*[func(category) for category in ('collection', 'module', 'womi')])


def recursive_content_driver_provider(content_driver):

    try:
        descriptor = content_driver.search_descriptor
    except Exception as e:
        logger.exception('failed to get search descriptor for: %s', content_driver)
        return

    yield content_driver

    if "using" in descriptor.keys():
        for using in descriptor["using"]:
            for used_driver in recursive_content_driver_provider(editcommon.objects.drivers.bind(using["category"], using["identifier"], using["version"])):
                yield used_driver


@redis.cache_result(timeout=(60 * 60), key=keys.app + 'latest:c:{category}:i:{identifier}:sealed:{only_sealed}')
def find_latest_version(category, identifier, only_sealed):
    import store.exceptions
    import editstore.objects
    import repo

    latest_sealed_version = repo.repositories.match_repository_for_id(category, identifier).find_latest_version(category, identifier)
    if not only_sealed:
        if latest_sealed_version is not None:
            edition_check = latest_sealed_version + 1
        else:
            edition_check = 1
        edition_driver = editstore.objects.drivers.bind(category, identifier, edition_check)
        if edition_driver.does_exist():
            return edition_driver

    if latest_sealed_version is None:
        return None

    return repo.objects.drivers.bind(category, identifier, latest_sealed_version)


def find_latest_version_from_index(category, identifier, only_sealed):
    index_driver = get_index_driver()
    for version in sorted(map(lambda x: int(x['version']), index_driver.objects.filter(category=category, identifier=identifier).values('version')), reverse=True):
        driver = editcommon.objects.drivers.bind(category, identifier, version)
        if not (only_sealed and driver.is_edition_driver):
            return driver

    return None


class QueryResultIterator(object):

    def __init__(self, driver, dsl_query, start=0, end=None):
        self.driver = driver
        self.dsl_query = dsl_query
        self.batch_size = 100
        self.batch_iterator = start
        self.finish = end

        self.total_number = 0

        self.result_iterator = 0
        self.current_batch = None
        self.try_next = True
        self.current_size = 0


    def __iter__(self):
        return self

    def next(self):

        if ((self.current_batch is None) or self.result_iterator == self.current_size):
            if not self.try_next:
                raise StopIteration

            next_size = self.batch_size
            if (self.finish is not None and next_size > self.finish - self.batch_iterator):
                next_size = self.finish - self.batch_iterator

            if next_size <= 0:
                raise StopIteration


            QueryParser.add_pagination(self.dsl_query, page=self.batch_iterator, size=next_size)
            next_batch = self.driver.query_index(transformed_query=self.dsl_query)

            if not next_batch:
                raise StopIteration

            self.current_batch = next_batch
            self.current_size = len(self.current_batch)
            self.try_next = (self.current_size == self.batch_size)
            self.batch_iterator += self.current_size
            self.result_iterator = 0

        result = self.current_batch[self.result_iterator]
        self.result_iterator += 1
        return result

    def __repr__(self):
        start = '[ ' + ', '.join(map(repr, itertools.islice(self, 5)))
        try:
            next(self)
            more = True
        except StopIteration:
            more = False
        return start + (' ... ]' if more else ' ]')



class QueryFilter(object):

    def __init__(self, filter):
        self.filter = filter

    @classmethod
    def build(cls, **kwargs):
        filters = [QueryParser.transform_operand(field=k, value=encoding.smart_text(v), mode='exact') for k, v in kwargs.items()]
        if not filters:
            raise ValueError('empty query')

        if len(filters) == 1:
            filter = filters[0]
        else:
            filter = filters
        return cls(filter)


    def __and__(self, other):
        return QueryFilter(QueryParser.transform_operator('and', [self.filter, other.filter]))

    def __or__(self, other):
        return QueryFilter(QueryParser.transform_operator('or', [self.filter, other.filter]))


Q = QueryFilter.build


class QueryChain(object):

    def __init__(self, driver):
        self.driver = driver
        self.filters = []
        self.fields = None
        self.ordering = []
        self.query_value = None

    def query(self, query_value):
        self.query_value = query_value
        return self

    def filter(self, _query=None, **kwargs):
        if _query is not None:
            if kwargs:
                raise ValueError('invalid filter')
            self.filters.append(_query.filter)
        for k, v in kwargs.items():
            self.filters.append(QueryParser.transform_operand(field=k, value=encoding.smart_text(v), mode='exact'))
        return self

    def values(self, *fields):
        if self.fields is None:
            self.fields = []
        self.fields.extend(fields)
        return self

    def all(self):
        return self

    def get(self):
        result = list(self[0:2])
        if len(result) == 1:
            return result[0]
        if len(result) == 0:
            raise exceptions.QueryEmptyResult('result for query is empty')
        else:
            raise exceptions.QueryMultipleResult('multitple results found')


    def count(self):
        self.fields = ['identifier']
        counter = 0
        for result in self:
            counter += 1
        return counter

    @property
    def dsl(self):
        if not self.filters:
            filter = None
        elif len(self.filters) == 1:
            filter = self.filters[0]
        else:
            filter = QueryParser.transform_operator('and', self.filters)

        return QueryParser.transform_query_pretransformed(fields=self.fields, filter_pretransformed=filter, query=self.query_value)


    def __getitem__(self, items):
        if isinstance(items, slice):
            return self._compile(items.start, items.stop)
        else:
            index = int(items)
            return next(self._compile(index, index + 1))


    def _compile(self, start=0, end=None):
        return QueryResultIterator(self.driver, self.dsl, start=start, end=end)


    def __iter__(self):
        return self._compile()


def divide_into_batches(source, size):
    result = []

    for obj in source:
        result.append(obj)
        if len(result) == size:
            yield result
            result = []

    if result:
        yield result






class EditSearchDriver(object):

    def __init__(self, name='editsearch'):
        self.name = name
        self.url = settings.HAYSTACK_CONNECTIONS['editsearch']['URL']
        self.index_name = settings.HAYSTACK_CONNECTIONS['editsearch']['INDEX_NAME']


    @cached_property
    def client(self):
        return Elasticsearch(self.url)


    def __reduce__(self):
        return (self.__class__, (self.name, ))


    def create_index(self):

        response = self.client.indices.create(index=self.index_name, ignore=400)
        return response


    def prepare_index(self):

        info("preparing editsearch index...")
        module_dir = os.path.dirname(__file__)  # get current directory
        file_path = os.path.join(module_dir, 'resources', 'json', 'datamapping.json')

        with open(file_path, "r") as json_file:
            parsed_json  = json.loads(json_file.read())

        for k, v in parsed_json['mappings'].items():
            self.client.indices.put_mapping(index=self.index_name, doc_type=k, body={ k: v })

        info("editsearch index prepared")


    def delete_index(self):

        info("deleting editsearch index...")
        response = self.client.indices.delete(index=self.index_name, ignore=404)
        info("editsearch index deleted")

        return response


    def query_index(self, query=None, transformed_query=None):

        if transformed_query is None:
            transformed_query = QueryParser.fuzzy_transform_query(query)

        # info('sending query: %s', transformed_query)
        response = self.client.search(index=self.index_name, body=transformed_query)

        results = []
        if "hits" in response.keys():
            hits_section = response["hits"]
            if (hits_section["total"] > 0) and ("hits" in hits_section.keys()):
                for hit in hits_section["hits"]:
                    if "_source" in hit.keys():
                        results.append(hit["_source"])
                    elif "fields" in hit.keys() and "_source" in hit["fields"]:
                        source = hit["fields"]["_source"]
                        if source:
                            if type(source) == list:
                                if len(source) == 1:
                                    results.append(source[0])
                                else:
                                    results.append(source)
                            else:
                                results.append(source)

        return results


    def list_source(self, all=False, edition=False, repository=None, repositories=None, category=None):

        import repo
        import editstore.objects

        providers = []

        if repository is not None:
            repository_driver = repo.repositories.get(repository)
            providers.append(repository_driver.list_all_verified_objects)

        if repositories:
            for repository_name in repositories:
                repository_driver = repo.repositories.get(repository_name)
                providers.append(repository_driver.list_all_verified_objects)

        if all:
            for repository_driver in repo.repositories.values():
                providers.append(repository_driver.list_all_verified_objects)

        if edition or all:
            providers.append(editstore.objects.drivers.list_all_existing_as_drivers)

        def take_category(provider):
            if category is not None:
                return provider(category)
            else:
                return chain_iterations_for_all_categories(provider)


        return itertools.chain(*list(map(take_category, providers)))


    def filter_stale(self, drivers):
        return itertools.ifilter(lambda d: not self.is_object_current(d), drivers)

    def filter_valid(self, drivers):
        return itertools.ifilter(lambda d: d.parsed_object_result.success, drivers)


    def convert_driver(self, content_driver):
        return editcommon.objects.drivers.convert(content_driver)


    @method_task(ignore_result=True, queue='indexer')
    def index_all(self, async=True):
        return self.index_in_batches(self.list_source(all=True), async=async)


    def index_kzd(self, async=True):
        import repo
        womis = list(repo.repositories.content.get_kzd_womis())
        self.index_in_batches(womis, async=async)
        for obj in self.objects.all():
            driver = repo.objects.drivers.bind(category=obj['category'], identifier=obj['identifier'], version=obj['version'])
            if driver not in womis:
                warning('found %s in editsearch index, deleting because it is not KZD' % driver)
                self.remove_object(driver)


    def list_not_current_objects(self):
        found_stale = 0

        for content_driver in self.filter_stale(self.filter_valid(self.list_source(all=True))):
            found_stale += 1
            debug('found %s not current in index', content_driver)
            yield content_driver

        if found_stale:
            warning('found %s stale objects in index', found_stale)


    @method_task(ignore_result=True, queue='indexer')
    def validate_index(self):
        info('starting index validation')
        self.index_in_batches(self.list_not_current_objects())
        info('index validation finished')


    @method_task(ignore_result=True, queue='indexer')
    def index_object(self, content_driver, recursive=False):

        info("indexing %s: %s", 'recursive' if recursive else 'non-recursive', content_driver)
        if recursive:
            return self.index_in_batches(recursive_content_driver_provider(self.convert_driver(content_driver)), async=False)
        else:
            return self.index_batch([content_driver])


    def is_object_current(self, content_driver):
        content_driver = editcommon.objects.drivers.convert(content_driver)
        try:
            result = self.objects.filter(category=content_driver.category, identifier=content_driver.identifier, version=content_driver.version).get()

            if result['attributes']['title'] != content_driver.parsed_object.title:
                return False

            if result['attributes']['edited'] != content_driver.parsed_object.edition_timestamp.isoformat():
                return False

            return True
        except (exceptions.QueryEmptyResult, KeyError) as e:
            return False


    @method_task(ignore_result=True, queue='indexer')
    def index_batch(self, content_drivers):

        bulk_actions = []

        for content_driver in content_drivers:
            try:
                bulk_actions.append(self.prepare_single_object_action(content_driver))
                # info("preparing action for bulk index: %s", content_driver)
            except Exception as e:
                logger.exception('failed to schedule %s for bulk index: %s', content_driver, e)
                continue

        info('flushing actions %s in bulk', len(bulk_actions))
        return helpers.bulk(self.client, bulk_actions)

    @method_task(ignore_result=True, queue='indexer')
    def index_in_batches(self, content_drivers, bulk_size=5, async=True):

        for batch in divide_into_batches(content_drivers, size=bulk_size):
            (self.index_batch.delay if async else self.index_batch)(batch)

    def prepare_single_object_action(self, content_driver):
        debug('preparing single object for %s', content_driver)
        content_driver = self.convert_driver(content_driver)

        if content_driver is None:
            error('content driver is None!!!')

        descriptor = content_driver.search_descriptor

        copied_descriptor = copy.deepcopy(descriptor)
        copied_descriptor["source"] = []

        for file_descriptor in descriptor.get('files', []):
            if file_descriptor.get('full_text', False):
                file_path = file_descriptor["path"]
                data = requests.get('http://preview.%s/content/%s/%s/%s/%s' % (settings.TOP_DOMAIN, content_driver.category, content_driver.identifier, content_driver.version, file_path))
                data.raise_for_status()
                copied_descriptor["source"].append(data.text)

        return {
            "_index": self.index_name,
            # TODO: missing content_driver.version here?
            "_type": content_driver.category,
            "_id": '%s:%s:%s' % (content_driver.category, content_driver.identifier, content_driver.version),
            "_source": copied_descriptor,
        }

    @property
    def objects(self):
        return QueryChain(self)

    def get_object_with_used(self, content_driver):
        # check if element exists in index
        identifier = '%s:%s:%s' % (content_driver.category, content_driver.identifier, content_driver.version)
        masters = helpers.scan(self.client, query={"query": {"match": {"_id": identifier}}, "partial_fields": {"_source": {"include": ["using"]}}}, index=self.index_name)
        for element in masters:
            # check if element is used somewhere
            query = {"query": {"bool": {"must": [{"term": {"using.category": content_driver.category}}, {"term": {"using.identifier": content_driver.identifier}}, {"term": {"using.version": content_driver.version}}]}}, "partial_fields": {"_source": {"include": ["using"]}}}
            used = list(helpers.scan(self.client, query=query, index=self.index_name))

            # check if it is using another
            try:
                for entry in element["fields"]["_source"]:
                    try:
                        for using in entry["using"]:
                            for child in self.get_object_with_used(ElementIdBinder(using["category"], using["identifier"], using["version"])):
                                yield child
                    except:
                        debug("no 'using' element for %s" % identifier)
            except:
                debug("no 'source' element for %s" % identifier)

        yield content_driver

    @method_task(ignore_result=True, queue='indexer')
    def remove_object(self, content_driver, recursive=False):

        info("removing %s: %s", 'recursive' if recursive else 'non-recursive', content_driver)
        if recursive:
            return self.remove_in_batches(self.get_object_with_used(content_driver))
        else:
            return self.remove_batch([content_driver])

    @method_task(ignore_result=True, queue='indexer')
    def remove_batch(self, content_drivers):

        bulk_actions = []

        for content_driver in content_drivers:
            try:
                bulk_actions.append(self.prepare_single_object_to_remove_action(content_driver))
                # info("preparing action for bulk index: %s", content_driver)
            except Exception as e:
                logger.exception('failed to schedule %s for bulk index: %s', content_driver, e)
                continue

        info('flushing actions %s in bulk', len(bulk_actions))
        return helpers.bulk(self.client, bulk_actions)

    @method_task(ignore_result=True, queue='indexer')
    def remove_in_batches(self, content_drivers, bulk_size=5, async=True):

        for batch in divide_into_batches(content_drivers, size=bulk_size):
            (self.remove_batch.delay if async else self.remove_batch)(batch)

    def prepare_single_object_to_remove_action(self, content_driver):

        return {
            "_op_type": 'delete',
            "_index": self.index_name,
            # TODO: missing content_driver.version here?
            "_type": content_driver.category,
            "_id": '%s:%s:%s' % (content_driver.category, content_driver.identifier, content_driver.version),
        }

def get_index_driver():
    return EditSearchDriver()




class QueryParser(object):

    @classmethod
    def parse_ordering(cls, ordering):
        if ordering in ("ascending", "asc", "A", "a"):
            return { 'order': 'asc' }
        elif ordering in ("descending", "desc", "D", "d"):
            return { 'order': 'desc' }
        else:
            raise ValueError('invalid ordering: %s' % ordering)


    @classmethod
    def transform_operator_or_operand(cls, source):
        if source is None:
            return None

        if 'operator' in source:
            return cls.transform_operator_deep(**source)

        return cls.transform_operand(**source)


    @classmethod
    def transform_operator_deep(cls, operator, operands):
        return cls.transform_operator(operator, map(cls.transform_operator_or_operand, operands))


    @classmethod
    def transform_operator(cls, operator, operands):
        return { operator: operands }


    @classmethod
    def transform_operand(cls, field=None, value=None, mode='match', fixed=False):

        #self.start = json.get('start', None)
        #self.end = json.get('end', None)


        if not value or not any(value) or value == u"":
            result[u"match_all"] = {}
            return { 'match_all': {} }

        result = {}
        condition = {}

        if type(value) == list:
            if mode == u"in":
                comp_value = value
            elif mode == u"range":
                if type(value) in (tuple, list):
                    range_start = value[0]
                    if len(value) >= 2:
                        range_end = value[1]
                else:
                    range_start = value
                comp_value = dict()
                comp_value[u"gte"] = range_start
                if range_end:
                    comp_value[u"lte"] = range_end
            else:
                comp_value = " ".join(value)
        else:
            comp_value = value


        if field:
            condition[field] = comp_value
        else:
            condition["_all"] = comp_value

        try:
            result['query'] = { QUERY_MODES[mode]: condition }
        except KeyError:
            raise ValueError("could not parse mode for query: {mode}".format(mode=repr(mode)))

        return result


    @classmethod
    def transform_favorite(cls, field=None, values=None, weight=2):

        result = {}
        if values and field:
            result[u"filter"] = { 'terms': { field: values } }
        else:
            result[u"filter"] = MATCH_ALL_QUERY

        if weight:
            result[u"boost_factor"] = weight

        return result


    @classmethod
    def transform_favorites(cls, source):
        if source is None:
            return None

        if isinstance(source, (list, tuple)):
            functions = [cls.transform_favorite(**element) for element in source]
        else:
            functions = [cls.transform_favorite(**source)]

        return { 'functions': functions }


    @classmethod
    def transform_query(cls, filter=None, favorites=None, **kwargs):
        filter = cls.transform_operator_or_operand(filter)
        favorites = cls.transform_favorites(favorites)
        return cls.transform_query_pretransformed(filter_pretransformed=filter, favorites_pretransformed=favorites, **kwargs)


    @classmethod
    def transform_query_pretransformed(cls, name=None, id=None, filter_pretransformed=None, query=None, ordering=None, fields=None, page=None, size=None, favorites_pretransformed=None):

        if not filter_pretransformed:
            return MATCH_ALL_QUERY

        result = {}
        result[u"query"] = {}

        result[u"filter"] = filter_pretransformed

        if favorites_pretransformed:
            result[u"query"][u"function_score"] = {}
            result[u"query"][u"function_score"].update(favorites_pretransformed)
            if query:
                result[u"query"][u"function_score"][u"query"] = { "query_string": { 'query': query } }
        else:
            if query:
                result["query"] = { "query_string": { 'query': query } }
            else:
                result.update(MATCH_ALL_QUERY)

        if ordering:
            sort = []
            for sort_elem in ordering:
                if sort_elem.get('enabled', True):
                    sorting = {}
                    sort_order = cls.parse_ordering(sort_elem["mode"])
                    if sort_order:
                        sorting[sort_elem[u"field"]] = sort_order
                    sort.append(sorting)

            if len(sort) > 0:
                result[u"sort"] = sort

        result['partial_fields'] = { '_source': {
            'exclude': 'source',
            'include': (fields if fields else '*')
        } }

        cls.add_pagination(result, page, size)

        return result

    @classmethod
    def add_pagination(cls, query, page, size):

        if page >= 0:
            query[u"from"] = page

        if size >= 0:
            query[u"size"] = size


    @classmethod
    def fuzzy_transform_query(cls, query):

        if query:
            if isinstance(query, basestring):
                query = json.loads(query)
            dsl_query = cls.transform_query(**query)
        else:
            dsl_query = MATCH_ALL_QUERY

        return dsl_query


class ElementIdBinder(object):

    category = None
    identifier = None
    version = None

    def __init__(self, category, identifier, version):
        self.category = category
        self.version = version
        self.identifier = identifier

