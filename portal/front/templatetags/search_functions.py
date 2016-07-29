# coding=utf-8

from common.models import Collection, Module
from django import template
from django.core.urlresolvers import reverse
from django.db.models import Q
from surround.django.logging import setupModuleLogger
from common import models
from django_hosts.reverse import reverse_full
setupModuleLogger(globals())

register = template.Library()


class SearchResultUrl(template.Node):
    def __init__(self, path):
        self.is_variable = isinstance(path, template.Variable)
        self._path = path

    def get_path(self, context):
        if self.is_variable:
            return self._path.resolve(context)
        else:
            return self._path.replace('"', '').replace("'", '')

    def render(self, context):
        dirs = self.get_path(context).split('/')
        # print(dirs)
        output = ''
        if len(dirs) < 3:
            # raise Exception('invalid length of search result: ' + str(dirs))
            error('invalid length of search result: ', str(dirs))
            return '#'

        if len(dirs) == 3:
            output = reverse_full('www', 'reader_variant_details', view_args=dirs[0:3])
        elif len(dirs) == 4:
            output = reverse_full('www', 'reader_module_reader', view_args=dirs[0:4])
        elif len(dirs) > 4:
            output = reverse_full('www', 'reader_module_reader', view_args=dirs[0:4]) + '#' + dirs[-1]

        return output


class OutputObject(dict):
    def __init__(self, *args, **kwargs):
        super(OutputObject, self).__init__(*args, **kwargs)

    def __unicode__(self):
        return self.get('title', '')


class MakeTitle(SearchResultUrl):
    def __init__(self, path, lvl_id):
        super(MakeTitle, self).__init__(path)
        self._lvl_id = lvl_id

    def render(self, context):
        dirs = self.get_path(context).split('/')
        output = ''

        if len(dirs) >= 1 and int(self._lvl_id) == 1:
            try:
                md_content_id = dirs[0]
                if len(dirs) >= 2:
                    md_version = dirs[1]
                else:
                    md_version = 1
                if len(dirs) >= 3:
                    md_variant = dirs[2]
                else:
                    md_variant = models.Config.get_first_collection_variant_name_or_404(md_content_id, md_version)

                if md_variant.find("-") > 0:
                    md_varian_alt = md_variant.split('-')[0]
                else:
                    md_varian_alt = "%s-canon" % md_variant
                cols = Collection.objects.filter(md_content_id=md_content_id, md_version=md_version).filter(Q(variant__exact=md_variant) | Q(variant__exact=md_varian_alt))
                if len(cols) >= 1:
                    c = cols[0]
                else:
                    raise Collection.DoesNotExist
                school_type = ""
                school_ep_class = ""
                school_type_int = 0
                variant_nice_name = 'Podręcznik %s' % c.nice_variant_name
                from front.templatetags.collection_cover import cover_thumb_url

                if c.md_school:
                    school_type = c.md_school.get_school_type()
                    school_type_int = c.md_school.education_code
                    if c.md_school.ep_class is not None:
                        school_ep_class = c.md_school.ep_class
                output = OutputObject({'title': c.md_title, 'school': c.md_school, 'subject': c.md_subject,
                                       'school_type': school_type, 'school_type_int': school_type_int,
                                       'ep_class': school_ep_class, 'variant': variant_nice_name,
                                       'thumb_url': cover_thumb_url(c)})

            except Collection.DoesNotExist:
                error('failed to fetch collection object for SOLR result: %s/%s/%s', md_content_id, md_version, md_variant)

        if len(dirs) >= 4 and int(self._lvl_id) == 2:
            try:
                output = Module.objects.get(md_content_id=dirs[1]).md_title
            except Module.DoesNotExist:
                pass

        return output


def do_parse(token, has_lvl=False):
    try:
        if has_lvl:
            tag_name, content_id, lvl_id = token.split_contents()
        else:
            tag_name, content_id = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError("%r tag requires a single argument" % token.contents.split()[0])

    if not content_id[0] in ('"', "'"):
        content_id = template.Variable(content_id)

    if has_lvl:
        return content_id, lvl_id
    else:
        return content_id


@register.tag(name="search_result_url")
def do_search_result_url(parser, token):
    return SearchResultUrl(do_parse(token))


@register.tag(name="search_result_title")
def do_search_result_title(parser, token):
    content_id, lvl_id = do_parse(token, True)
    return MakeTitle(content_id, lvl_id)

@register.assignment_tag(takes_context=True)
def assign_search_result(context, content_id, *args, **kwargs):
    lvl_id = None
    if args:
        lvl_id = args[0]

    make_title = MakeTitle(content_id, lvl_id)
    return make_title.render(context)

@register.filter(name="search_result_style")
def search_result_style(value):
    if value and value.has_key('type'):
        return value['type']
    else:
        return 'unknown-index-item'

@register.filter(name="search_link_prepare")
def search_link_prepare(value):
    if value:
        splitted = value.split("/")
        if splitted[2].find("-") < 0:
            splitted[2] = "%s-canon" % (splitted[2])
        return "/".join(splitted)
    else:
        return None

@register.filter(name="search_cover_url_prepare")
def search_cover_url_prepare(value):
    if value:
        splitted = value.split("/")
        if splitted[2].find("-") < 0:
            splitted[2] = "%s-canon" % (splitted[2])
        return "/".join(splitted)
    else:
        return None
