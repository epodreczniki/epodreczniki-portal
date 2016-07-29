from sunburnt.schema import SolrUnicodeField
from sunburnt.search import LuceneQuery
from sunburnt.strings import SolrString
from sunburnt.sunburnt import SolrSchema, SolrConnection

SolrSchema.solr_data_types.update({
    'solr.CurrencyField': SolrUnicodeField,
    'solr.SpatialRecursivePrefixTreeFieldType': SolrUnicodeField,
})

old_init = LuceneQuery.__init__


class SolrNonEscapedUnicodeField(SolrUnicodeField):
    def from_user_data(self, value):
        return SolrString(value)

    def to_query(self, value):
        return SolrString(value)


def new_init(self, schema, option_flag=None, original=None, non_escaped_default=True):
    old_init(self, schema, option_flag, original)
    self.schema.default_field = SolrNonEscapedUnicodeField('') if non_escaped_default else SolrUnicodeField('')


LuceneQuery.__init__ = new_init


def request_handler_name(self, name):
    self.select_url = self.url + name + '/'


SolrConnection.request_handler_name = request_handler_name


def use_patch():
    pass
