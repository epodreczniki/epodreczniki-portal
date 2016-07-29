# coding=utf-8
from datetime import date
from itertools import groupby
from begin.edit_handlers import ItemGroupChooserPanel
from django import forms
from django.core.urlresolvers import reverse
from django.core.validators import URLValidator
from django.db import models
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.forms import TextInput
from django.http import HttpResponse

from wagtail.wagtailcore.models import Page, Orderable
from wagtail.wagtailcore.fields import RichTextField
from wagtail.wagtailadmin.edit_handlers import FieldPanel, MultiFieldPanel, \
    InlinePanel, PageChooserPanel
from wagtail.wagtailimages.edit_handlers import ImageChooserPanel
from wagtail.wagtailimages.models import AbstractRendition
from wagtail.wagtailimages.models import Image
from wagtail.wagtailimages.models import Rendition
from wagtail.wagtaildocs.edit_handlers import DocumentChooserPanel
from wagtail.wagtailsnippets.edit_handlers import SnippetChooserPanel
from wagtail.wagtailsnippets.models import register_snippet
from wagtail.wagtailforms.models import AbstractEmailForm
from wagtail.wagtailforms.models import AbstractForm
from wagtail.wagtailforms.models import AbstractFormField
from wagtail.wagtailsearch import index

from modelcluster.fields import ParentalKey
from modelcluster.tags import ClusterTaggableManager
from taggit.models import Tag
from taggit.models import TaggedItemBase

from .utils import export_event


def new_url(self):
    return reverse('images_serve', args=(self.file,))

setattr(Rendition, 'url', property(new_url))


EVENT_AUDIENCE_CHOICES = (
    ('public', "Public"),
    ('private', "Private"),
)


# class TextareaCharField(models.CharField):
#     def formfield(self, **kwargs):
#         defaults = {'max_length': self.max_length, 'widget': forms.Textarea}
#         defaults.update(kwargs)
#         return super(TextareaCharField, self).formfield(**defaults)
#
#
# for f in Page._meta.fields:
#     if f.name == 'search_description':
#         f.__class__ = TextareaCharField

# A couple of abstract classes that contain commonly used fields

class LinkFields(models.Model):
    link_external = models.URLField("External link", blank=True)
    link_page = models.ForeignKey(
        'wagtailcore.Page',
        null=True,
        blank=True,
        related_name='+'
    )
    link_document = models.ForeignKey(
        'wagtaildocs.Document',
        null=True,
        blank=True,
        related_name='+'
    )

    @property
    def link(self):
        if self.link_page:
            return self.link_page.url
        elif self.link_document:
            return self.link_document.url
        else:
            return self.link_external

    panels = [
        FieldPanel('link_external'),
        PageChooserPanel('link_page'),
        DocumentChooserPanel('link_document'),
    ]

    class Meta:
        abstract = True


class ContactFields(models.Model):
    telephone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    address_1 = models.CharField(max_length=255, blank=True)
    address_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=255, blank=True)
    post_code = models.CharField(max_length=10, blank=True)

    panels = [
        FieldPanel('telephone'),
        FieldPanel('email'),
        FieldPanel('address_1'),
        FieldPanel('address_2'),
        FieldPanel('city'),
        FieldPanel('country'),
        FieldPanel('post_code'),
    ]

    class Meta:
        abstract = True


# Carousel items
class WeakURLValidator(URLValidator):
    def __call__(self, value):
        if value.startswith('//'):
            value = 'http:%s' % value

        super(WeakURLValidator, self).__call__(value)

class WeakUrl(models.URLField):
    validators = [WeakURLValidator()]

    class UrlField(forms.URLField):
        widget = TextInput

        def clean(self, value):
            without_scheme = False
            if value.startswith('//'):
                without_scheme = True
            value = self.to_python(value).strip()
            value = super(forms.CharField, self).clean(value)
            if without_scheme:
                strt = value.index('//')
                value = value[strt:]
            return value

    def formfield(self, **kwargs):
            defaults = {
                'form_class': self.UrlField,
            }
            defaults.update(kwargs)
            return super(WeakUrl, self).formfield(**defaults)


class CarouselItem(LinkFields):
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    embed_url = WeakUrl("Embed URL", blank=True)
    caption = models.CharField(max_length=255, blank=True)

    panels = [
        ImageChooserPanel('image'),
        FieldPanel('embed_url'),
        FieldPanel('caption'),
        MultiFieldPanel(LinkFields.panels, "Link"),
    ]

    class Meta:
        abstract = True


# Related links

class RelatedLink(LinkFields):
    title = models.CharField(max_length=255, help_text="Link title")

    panels = [
        FieldPanel('title'),
        MultiFieldPanel(LinkFields.panels, "Link"),
    ]

    class Meta:
        abstract = True


# Bunch of snippets

# create side panels with image gallery

class GalleryItem(Orderable):
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    caption = models.CharField(max_length=255, blank=True)
    snippet = ParentalKey('begin.GallerySnippet', related_name='gallery_items')

    panels = [
        ImageChooserPanel('image'),
        FieldPanel('caption')
    ]


@register_snippet
class GallerySnippet(models.Model):
    name = models.CharField(max_length=255, blank=True)

    def __unicode__(self):
        return u'galeria: %s' % self.name

    class Meta:
        verbose_name = u'Galerie'
        verbose_name_plural = u'Galerie'


GallerySnippet.panels = [
    FieldPanel('name'),
    InlinePanel(GallerySnippet, 'gallery_items', label="Elementy galerii"),
]


class GalleryPage(Page):
    gallery = models.ForeignKey(
        'begin.GallerySnippet',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='page'
    )


GalleryPage.content_panels = [
    FieldPanel('title', classname="full title"),
    SnippetChooserPanel('gallery', GallerySnippet)
]

# creating side panels with extra items
@register_snippet
class ExtraItemGroup(Orderable):
    name = models.CharField(max_length=255)
    snippet = ParentalKey('begin.ExtraSnippet', related_name='extra_item_groups')

    def __unicode__(self):
        return u'%s' % self.name

    class Meta:
        verbose_name = u'Grupa elementów ekstra'
        verbose_name_plural = u'Grupy elementów ekstra'


class ExtraItem(Orderable):
    extra = models.ForeignKey(
        'wagtaildocs.Document',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        verbose_name='Extra plik'
    )
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        related_name='+',
        verbose_name='Miniaturka pliku lub obraz'
    )
    link_external = models.URLField(verbose_name="Link", blank=True)
    caption = models.CharField(verbose_name='Podpis', max_length=255, blank=True)
    snippet = ParentalKey('begin.ExtraSnippet', related_name='extra_items')
    group = models.ForeignKey('begin.ExtraItemGroup',
                              null=True,
                              blank=True,
                              related_name='+',
                              verbose_name='Grupa')

    panels = [
        DocumentChooserPanel('extra'),
        ImageChooserPanel('image'),
        FieldPanel('link_external'),
        FieldPanel('caption'),
        ItemGroupChooserPanel('group', ExtraItemGroup)
    ]


@register_snippet
class ExtraSnippet(models.Model):
    name = models.CharField(max_length=255, blank=True)
    lead_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    def __unicode__(self):
        return u'extra: %s' % self.name

    class Meta:
        verbose_name = u'Zbiór extra elementów'
        verbose_name_plural = u'Zbiór extra elementów'

    def items_by_group(self):
        items_without_group = sorted(self.extra_items.filter(group__isnull=True), key=lambda i: i.sort_order)
        items_with_group = sorted(self.extra_items.filter(group__isnull=False), key=lambda i: i.group.sort_order)
        groups = []
        for k, g in groupby(items_with_group, lambda i: i.group.name):
            groups.append({
                'name': k,
                'items': sorted(g, key=lambda i: i.sort_order)
            })

        return groups, items_without_group

ExtraSnippet.panels = [
    FieldPanel('name'),
    ImageChooserPanel('lead_image'),
    InlinePanel(ExtraSnippet, 'extra_item_groups', label="Grupy"),
    InlinePanel(ExtraSnippet, 'extra_items', label="Extra pliki"),
]


class ExtraPage(Page):
    extra = models.ForeignKey(
        'begin.ExtraSnippet',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='page'
    )


ExtraPage.content_panels = [
    FieldPanel('title', classname="full title"),
    SnippetChooserPanel('extra', ExtraSnippet)
]


class ExtraIndexPage(Page):
    intro = RichTextField(blank=True)
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    @property
    def extras(self):
        extras = ExtraPage.objects.live().descendant_of(self)
        extras = extras.order_by('id')

        return extras


ExtraIndexPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full")
]


ExtraIndexPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]


# creating side panels with links

class LinkItem(Orderable, LinkFields):
    title = models.CharField(max_length=255, blank=False, default='link')
    snippet = ParentalKey('begin.LinkSnippet', related_name='link_items')


# mus be explicit merge two lists in fact of producing new list
LinkItem.panels = LinkItem.panels + [FieldPanel('title')]


@register_snippet
class LinkSnippet(models.Model):
    name = models.CharField(max_length=255, blank=True)

    def __unicode__(self):
        return u'linki: %s' % self.name

    class Meta:
        verbose_name = u'Panel linków'
        verbose_name_plural = u'Panel linków'


LinkSnippet.panels = [
    FieldPanel('name'),
    InlinePanel(LinkSnippet, 'link_items', label="Linki"),
]

# creating top panel with promoted links

class PromotedItem(Orderable, LinkFields):
    title = models.CharField(max_length=255, blank=False, default='polecane')
    subtitle = models.CharField(max_length=255, blank=True)
    snippet = ParentalKey('begin.PromotedLinkSnippet', related_name='promoted_items')


# mus be explicit merge two lists in fact of producing new list
PromotedItem.panels = PromotedItem.panels + [FieldPanel('title'), FieldPanel('subtitle')]


@register_snippet
class PromotedLinkSnippet(models.Model):
    name = models.CharField(max_length=255, blank=True)

    def __unicode__(self):
        return u'polecane linki: %s' % self.name

    class Meta:
        verbose_name = u'Panel polecanych linków'
        verbose_name_plural = u'Panel polecanych linków'


PromotedLinkSnippet.panels = [
    FieldPanel('name'),
    InlinePanel(PromotedLinkSnippet, 'promoted_items', label="Polecane linki"),
]

# Home Page

class HomePageCarouselItem(Orderable, CarouselItem):
    page = ParentalKey('begin.HomePage', related_name='carousel_items')


class HomePageMultimediaItem(Orderable, CarouselItem):
    page = ParentalKey('begin.HomePage', related_name='multimedia_items')


class HomePageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('begin.HomePage', related_name='related_links')


class HomePage(Page):
    body = RichTextField(blank=True)

    search_fields = Page.search_fields + (
        index.SearchField('body'),
    )

    class Meta:
        verbose_name = "Homepage"

HomePage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('body', classname="full"),
    InlinePanel(HomePage, 'carousel_items', label="Carousel items"),
    InlinePanel(HomePage, 'multimedia_items', label="Multimedia"),
    InlinePanel(HomePage, 'related_links', label="Related links"),
]

HomePage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
]

#setattr(HomePage, 'search_description', TextareaCharField(blank=True, max_length=2000))

# Standard index page

class StandardIndexPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('begin.StandardIndexPage', related_name='related_links')


class StandardIndexPage(Page):
    intro = RichTextField(blank=True)
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + (
        index.SearchField('intro'),
    )

StandardIndexPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full"),
    InlinePanel(StandardIndexPage, 'related_links', label="Related links"),
]

StandardIndexPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]


# Standard page

class StandardPageCarouselItem(Orderable, CarouselItem):
    page = ParentalKey('begin.StandardPage', related_name='carousel_items')


class StandardPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('begin.StandardPage', related_name='related_links')


class StandardPage(Page):
    intro = RichTextField(blank=True)
    body = RichTextField(blank=True)
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + (
        index.SearchField('intro'),
        index.SearchField('body'),
    )

StandardPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full"),
    InlinePanel(StandardPage, 'carousel_items', label="Carousel items"),
    FieldPanel('body', classname="full"),
    InlinePanel(StandardPage, 'related_links', label="Related links"),
]

StandardPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]


# Blog index page

class BlogIndexPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('begin.BlogIndexPage', related_name='related_links')


class BlogIndexPage(Page):
    intro = RichTextField(blank=True)

    search_fields = Page.search_fields + (
        index.SearchField('intro'),
    )

    @property
    def blogs(self):
        # Get list of live blog pages that are descendants of this page
        blogs = BlogPage.objects.live().descendant_of(self)

        # Order by most recent date first
        blogs = blogs.order_by('-date')

        return blogs

    def get_context(self, request):
        # Get blogs
        blogs = self.blogs

        # Filter by tag
        tag = request.GET.get('tag')
        if tag:
            blogs = blogs.filter(tags__name=tag)

        # Pagination
        page = request.GET.get('page')
        paginator = Paginator(blogs, 3)  # Show 10 blogs per page
        try:
            blogs = paginator.page(page)
        except PageNotAnInteger:
            blogs = paginator.page(1)
        except EmptyPage:
            blogs = paginator.page(paginator.num_pages)

        # Update template context
        context = super(BlogIndexPage, self).get_context(request)
        context['blogs'] = blogs
        return context

BlogIndexPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full"),
    InlinePanel(BlogIndexPage, 'related_links', label="Related links"),
]

BlogIndexPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
]


# Blog page

class BlogPageCarouselItem(Orderable, CarouselItem):
    page = ParentalKey('begin.BlogPage', related_name='carousel_items')


class BlogPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('begin.BlogPage', related_name='related_links')


class BlogPageTag(TaggedItemBase):
    content_object = ParentalKey('begin.BlogPage', related_name='tagged_items')


class BlogPage(Page):
    intro = RichTextField(default="wstep postu")
    body = RichTextField()
    tags = ClusterTaggableManager(through=BlogPageTag, blank=True)
    date = models.DateField("Post date")
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    include_feed_image = models.BooleanField(default=True)

    search_fields = Page.search_fields + (
        index.SearchField('body'),
    )

    @property
    def blog_index(self):
        # Find closest ancestor which is a blog index
        return self.get_ancestors().type(BlogIndexPage).last()

BlogPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('date'),
    FieldPanel('intro'),
    FieldPanel('body', classname="full"),
    InlinePanel(BlogPage, 'carousel_items', label="Carousel items"),
    InlinePanel(BlogPage, 'related_links', label="Related links"),
]

BlogPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
    FieldPanel('include_feed_image'),
    FieldPanel('tags'),
]


# Person page

class PersonPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('begin.PersonPage', related_name='related_links')


class PersonPage(Page, ContactFields):
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    intro = RichTextField(blank=True)
    biography = RichTextField(blank=True)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + (
        index.SearchField('first_name'),
        index.SearchField('last_name'),
        index.SearchField('intro'),
        index.SearchField('biography'),
    )

PersonPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('first_name'),
    FieldPanel('last_name'),
    FieldPanel('intro', classname="full"),
    FieldPanel('biography', classname="full"),
    ImageChooserPanel('image'),
    MultiFieldPanel(ContactFields.panels, "Contact"),
    InlinePanel(PersonPage, 'related_links', label="Related links"),
]

PersonPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]


# Contact page

class ContactPage(Page, ContactFields):
    body = RichTextField(blank=True)
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + (
        index.SearchField('body'),
    )

ContactPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('body', classname="full"),
    MultiFieldPanel(ContactFields.panels, "Contact"),
]

ContactPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]


# Event index page

class EventIndexPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('begin.EventIndexPage', related_name='related_links')


class EventIndexPage(Page):
    intro = RichTextField(blank=True)

    search_fields = Page.search_fields + (
        index.SearchField('intro'),
    )

    @classmethod
    def get_first_index(cls):
        return cls.objects.live().first()

    @property
    def events(self):
        # Get list of live event pages that are descendants of this page
        events = EventPage.objects.live().descendant_of(self)

        # Filter events list to get ones that are either
        # running now or start in the future
        events = events.filter(date_from__gte=date.today())

        # Order by date
        events = events.order_by('date_from')

        return events

EventIndexPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full"),
    InlinePanel(EventIndexPage, 'related_links', label="Related links"),
]

EventIndexPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
]


# Event page

class EventPageCarouselItem(Orderable, CarouselItem):
    page = ParentalKey('begin.EventPage', related_name='carousel_items')


class EventPageRelatedLink(Orderable, RelatedLink):
    page = ParentalKey('begin.EventPage', related_name='related_links')


class EventPageSpeaker(Orderable, LinkFields):
    page = ParentalKey('begin.EventPage', related_name='speakers')
    first_name = models.CharField("Name", max_length=255, blank=True)
    last_name = models.CharField("Surname", max_length=255, blank=True)
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    @property
    def name_display(self):
        return self.first_name + " " + self.last_name

    panels = [
        FieldPanel('first_name'),
        FieldPanel('last_name'),
        ImageChooserPanel('image'),
        MultiFieldPanel(LinkFields.panels, "Link"),
    ]


class EventPage(Page):
    date_from = models.DateField("Start date")
    date_to = models.DateField(
        "End date",
        null=True,
        blank=True,
        help_text="Not required if event is on a single day"
    )
    time_from = models.TimeField("Start time", null=True, blank=True)
    time_to = models.TimeField("End time", null=True, blank=True)
    audience = models.CharField(max_length=255, choices=EVENT_AUDIENCE_CHOICES)
    location = models.CharField(max_length=255)
    body = RichTextField(blank=True)
    cost = models.CharField(max_length=255)
    signup_link = models.URLField(blank=True)
    feed_image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+'
    )

    search_fields = Page.search_fields + (
        index.SearchField('get_audience_display'),
        index.SearchField('location'),
        index.SearchField('body'),
    )

    @property
    def event_index(self):
        # Find closest ancestor which is an event index
        return self.get_ancestors().type(EventIndexPage).last()

    def serve(self, request):
        if "format" in request.GET:
            if request.GET['format'] == 'ical':
                # Export to ical format
                response = HttpResponse(
                    export_event(self, 'ical'),
                    content_type='text/calendar',
                )
                response['Content-Disposition'] = 'attachment; filename=' + self.slug + '.ics'
                return response
            else:
                # Unrecognised format error
                message = 'Could not export event\n\nUnrecognised format: ' + request.GET['format']
                return HttpResponse(message, content_type='text/plain')
        else:
            # Display event page as usual
            return super(EventPage, self).serve(request)

EventPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('date_from'),
    FieldPanel('date_to'),
    FieldPanel('time_from'),
    FieldPanel('time_to'),
    FieldPanel('location'),
    FieldPanel('audience'),
    FieldPanel('cost'),
    FieldPanel('signup_link'),
    InlinePanel(EventPage, 'carousel_items', label="Carousel items"),
    FieldPanel('body', classname="full"),
    InlinePanel(EventPage, 'speakers', label="Speakers"),
    InlinePanel(EventPage, 'related_links', label="Related links"),
]

EventPage.promote_panels = [
    MultiFieldPanel(Page.promote_panels, "Common page configuration"),
    ImageChooserPanel('feed_image'),
]


class FormField(AbstractFormField):
    page = ParentalKey('FormPage', related_name='form_fields')

class FormPage(AbstractEmailForm):
    intro = RichTextField(blank=True)
    thank_you_text = RichTextField(blank=True)

FormPage.content_panels = [
    FieldPanel('title', classname="full title"),
    FieldPanel('intro', classname="full"),
    InlinePanel(FormPage, 'form_fields', label="Form fields"),
    FieldPanel('thank_you_text', classname="full"),
    MultiFieldPanel([
        FieldPanel('to_address', classname="full"),
        FieldPanel('from_address', classname="full"),
        FieldPanel('subject', classname="full"),
    ], "Email")
]
