# coding=utf-8
from __future__ import absolute_import

from django.shortcuts import render
from auth.utils import anonymous_required
from auth.utils import epo_auth_required
from editcommon.decorators import must_revalidate_headers
from .utils import PublicationContext
from .models import Publication
from surround.django.decorators import never_cache_headers
from common import messages
from . import utils
from . import forms
from django.shortcuts import redirect
from django.http import JsonResponse
import json
from django.contrib.auth.decorators import user_passes_test
from django.views.decorators.http import require_http_methods
from django.http import HttpResponseBadRequest
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
from django.conf import settings
from collections import OrderedDict

from surround.django.logging import setupModuleLogger
setupModuleLogger(globals())


@epo_auth_required(profile='publication')
@must_revalidate_headers
def publication_aspects_view(request, category, identifier, version):
    publication = PublicationContext.bind_raw(category, identifier, version, 'portal', user=request.user)

    return render(request, 'publication/aspects.html', {
        'publication': publication,
        'root_descriptors': [context.full_descriptor for context in publication.sibling_aspects],
        'interface_depth': 1,
    })


@epo_auth_required(profile='publication')
@must_revalidate_headers
def publication_listing(request):
    root_descriptors = []
    portal_publications = OrderedDict()

    publications = Publication.objects.filter(category=Publication.COLLECTION_CATEGORY)
    if not (request.user.is_superuser or request.user.is_staff):
        publications = publications.filter(user=request.user)

    for publication_obj in publications:
        context = PublicationContext.bind_publication_obj(publication_obj, user=request.user)
        try:
            root_descriptors.append(context.full_descriptor)
            portal_publications['%s-%s-%s' % (context.category, context.identifier, context.version)] = context
        except Exception as e:
            error('failed to list load %s in publication listing', context)

    return render(request, 'publication/listing.html', {
        'root_descriptors': root_descriptors,
        'portal_publications': portal_publications.values(),
        'interface_depth': 1,
    })


@epo_auth_required(profile='publication')
@must_revalidate_headers
def publication_view(request, category, identifier, version, aspect):

    publication = PublicationContext.bind_raw(category, identifier, version, aspect, user=request.user)

    return render(request, 'publication/publish.html', {
        'publication': publication,
        'root_descriptors': [publication.full_descriptor],
        'interface_depth': None,
    })


@require_http_methods(["POST"])
@epo_auth_required(profile='publication')
def publication_execute(request, category, identifier, version, aspect):
    form = forms.PublicationForm(request.POST)
    if form.is_valid():
        context = utils.PublicationContext.bind_raw(category, identifier, version, aspect, user=request.user)
        info('bound publication context: %r', context)

        operation = form.cleaned_data['operation']
        if operation == forms.PublicationForm.PUBLISH:
            context.publish(user=request.user, async=True, arguments=utils.PublicationArguments())
        elif operation == forms.PublicationForm.RESTART:
            if not context.has_administration_persmissions:
                raise PermissionDenied('publication forcing on %s not allowed' % context)
            context.publish(user=request.user, async=True, arguments=utils.PublicationArguments(restart=True))
        elif operation == forms.PublicationForm.CANCEL:
            if not context.has_administration_persmissions:
                raise PermissionDenied('publication cancelation on %s not allowed' % context)
            context.cancel()
        elif operation == forms.PublicationForm.FORGET:
            if not context.has_administration_persmissions:
                raise PermissionDenied('publication forget on %s not allowed' % context)
            context.forget()

        return JsonResponse({ 'executed': True })
    else:
        return HttpResponseBadRequest()



@epo_auth_required(profile='publication')
@must_revalidate_headers
def publication_state(request, category, identifier, version, aspect):

    return JsonResponse(utils.cached_full_descriptor(category, identifier, version, aspect))


# @epo_auth_required(profile='default')
@must_revalidate_headers
def publication_multi_state(request):

    contexts = []

    for identification in request.GET.getlist('identification'):
        category, identifier, version, aspect = identification.split('-')
        contexts.append(utils.PublicationContext.bind_raw(category, identifier, version, aspect))

    utils.PublicationContext.prefetch_cached_full_descriptors(contexts)

    return JsonResponse({ context.short_identification: context.cached_full_descriptor for context in contexts })


@epo_auth_required(profile='publication')
@must_revalidate_headers
def redirect_published_or_publish(request, category, identifier, version):
    context = PublicationContext.bind_raw(category, identifier, version, 'portal')

    if context.is_published and context.driver.published_url:
        return redirect(context.driver.published_url)
    else:
        return redirect(publication_aspects_view, category, identifier, version)

