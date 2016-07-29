from common.utils import sub_collection_lookup
from django.contrib import admin
from django.contrib.admin import util
from common import models
from django.db.models import Count
from surround.django.basic.admin import action, absolute_link

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())





class CustomModelAdminBase(admin.ModelAdmin):
    save_on_top = True



class AdminException(Exception):
    pass



class CustomCollection(CustomModelAdminBase):

    # inlines = [InlineAuthorOrderCollection]
    save_on_top = True
    delete_confirmation_template = 'common_admin/collection_delete_confirmation.html'
    list_display = ('__unicode__', 'md_published', 'ep_environment_type', absolute_link('details'), absolute_link('xml', address_attribute="get_xml_url"))
    list_editable = ('md_published', 'ep_environment_type')
    actions = [
        action(models.Collection.sync_static),
        action(models.Collection.sync_static_from_metadata),
        # action(models.Collection.reimport),
    ]
    list_filter = ('md_subject', 'md_school')
    search_fields = ['=md_content_id', 'md_title']

    fieldsets = (
        ('Identification', {
            'fields': ('md_content_id', 'md_version', 'variant')
        }),
        ('Metadata', {
            'fields': ('md_title', 'md_subtitle', 'md_abstract', 'md_school', 'md_subject', 'volume', 'ep_signature', 'md_published', 'kind')
        }),
        ('Presentation', {
            # 'classes': ('collapse',),
            'fields': ('ep_cover_type', 'ep_stylesheet', 'ep_environment_type', 'ep_dummy')
        }),
        # ('Collection authorships', {
        #     'classes': ('collapse',),
        #     'fields': [],
        # }),
    )

    readonly_fields = ['md_content_id', 'md_version', 'variant']

    def delete_view(self, request, object_id, extra_context={}):

        collection = self.get_object(request, util.unquote(object_id))

        extra_context.update(extra_list=[m for m in collection.get_all_modules() if m.occurrences_number == 1])

        return super(CustomCollection, self).delete_view(request, object_id, extra_context)


    def delete_model(self, request, instance):
        modules = instance.get_all_modules()

        super(CustomCollection, self).delete_model(request, instance)

        for m in modules:
            if m.occurrences_number == 0:
                m.delete()


class CustomAuthor(CustomModelAdminBase):
    search_fields = ['md_full_name', 'md_email']
    # list_display = ('pk', '__unicode__', 'md_email', )
    list_display = ('__unicode__', 'md_email', )


class CustomAuthorship(CustomModelAdminBase):
    search_fields = ['author__md_full_name', 'author__md_email']
    # list_display = ('pk', '__unicode__', 'md_email', )
    list_display = ('__unicode__', )
    # TODO: these should be readonly in edit, but not in create
    # readonly_fields = ['author', 'metadata']

class ObjectUsedFilter(admin.SimpleListFilter):
    title = 'used'
    parameter_name = 'used'
    references_name = None

    def lookups(self, request, model_admin):
        return (
            ('yes', 'used'),
            ('no', 'not used'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            return queryset.annotate(occ_number=Count(self.references_name)).filter(occ_number__gt=0)

        if self.value() == 'no':
            return queryset.annotate(occ_number=Count(self.references_name)).filter(occ_number=0)

class WomiUsedFilter(ObjectUsedFilter):
    references_name = 'using_womi_references'


class CustomWomi(CustomModelAdminBase):
    search_fields = ['=womi_id', 'title']
    list_filter = ['womi_type', WomiUsedFilter]
    list_display = ('__unicode__', 'referrences_number')


class CustomWomiReference(CustomModelAdminBase):
    list_display = ('__unicode__', 'womi', 'referrer')
    search_fields = ('=womi__womi_id', )
    list_filter = ('kind', )



class CustomCollectionStaticFormat(CustomModelAdminBase):
    search_fields = ['=specification_code', 'collection__md_title', '=collection__md_content_id']
    list_display = ['__unicode__', 'present_in_interface', 'present_in_api', absolute_link('download'), 'filename']
    list_editable = ['present_in_interface', 'present_in_api']
    list_filter = ('specification_code', )
    actions = [action(models.CollectionStaticFormat.mark_last_changed)]


class SubCollection(CustomModelAdminBase):
    list_display = ['__unicode__', 'collection_variant']



class ModuleUsedFilter(ObjectUsedFilter):
    references_name = 'module_order'


class Module(CustomModelAdminBase):
    list_display = ['__unicode__', 'md_title', 'md_content_id', 'md_version', 'occurrences_number', absolute_link('xml', address_attribute="epxml_url")]
    list_filter = (ModuleUsedFilter, )
    list_per_page = 20


class ModuleOccurrence(CustomModelAdminBase):
    list_display = ['__unicode__', absolute_link('reader'), 'collection', absolute_link('xml', address_attribute="epxml_url")]
    search_fields = ['module__md_title', '=module__md_content_id']



class WomiType(CustomModelAdminBase):
    list_display = ('__unicode__', 'total_womi_count')


class InlineAttribute(admin.TabularInline):
    model = models.Attribute
    extra = 1



class Attribute(CustomModelAdminBase):
    list_per_page = 20

admin.site.register(models.Author, CustomAuthor)
admin.site.register(models.Subject, CustomModelAdminBase)
admin.site.register(models.SchoolLevel, CustomModelAdminBase)
admin.site.register(models.Keyword, CustomModelAdminBase)
admin.site.register(models.Module, Module)
admin.site.register(models.SubCollection, SubCollection)
admin.site.register(models.ModuleOccurrence, ModuleOccurrence)
admin.site.register(models.CoreCurriculum, CustomModelAdminBase)
admin.site.register(models.Authorship, CustomAuthorship)
admin.site.register(models.Attribute, Attribute)
admin.site.register(models.CollectionStaticFormat, CustomCollectionStaticFormat)
admin.site.register(models.Collection, CustomCollection)
admin.site.register(models.Womi, CustomWomi)
admin.site.register(models.WomiReference, CustomWomiReference)
admin.site.register(models.WomiType, WomiType)
