# -*- coding: utf-8 -*-

import json
from auth.utils import epo_auth_required, group_required
from django.http import HttpResponse, HttpResponseRedirect
from django.core.servers.basehttp import FileWrapper
from surround.django.logging import setupModuleLogger
from django.shortcuts import render
from django.utils.functional import cached_property
from django.core.urlresolvers import reverse
from django.forms.utils import ErrorList
from django.conf import settings
from common.utils import wrap_nice_exceptions
from .objects import Resource, FtpFileNotFoundException, FtpConnectionException, ResourceNotFoundException
from .forms import ResourceEditForm


setupModuleLogger(globals())


@epo_auth_required(profile='default')
@group_required('kzd_editor')
@wrap_nice_exceptions
def edit_resource(request, womi_id, womi_version):
    resource = Resource(womi_id, womi_version)
    if request.method == 'POST':
        form = ResourceEditForm(request.POST)
        if form.is_valid():
            form.rewrite_fields(resource)
            try:
                resource.save()
                return HttpResponseRedirect(reverse('edit_resource_success', args=(womi_id, womi_version)))
            except FtpFileNotFoundException:
                form._errors.setdefault('thumbnail_ftp_path', ErrorList()).append(u"Podana ścieżka do okładki nie istnieje na serwerze FTP MEN.")
            except FtpConnectionException:
                form._errors.setdefault('thumbnail_ftp_path', ErrorList()).append(u"Wystąpił problem przy połączeniu z serwerem FTP MEN. Spróbuj ponownie później lub skontaktuj się z administratorem.")
    else:
        resource.load()
        form = ResourceEditForm(resource)
    
    return render(request, 'editkzd/edit_resource.html', {'resource': resource, 'form': form})


@epo_auth_required(profile='default')
@group_required('kzd_editor')
@wrap_nice_exceptions
def edit_resource_success(request, womi_id, womi_version):
    resource = Resource(womi_id, womi_version)
    return render(request, 'editkzd/edit_resource_success.html', {'resource': resource})


@epo_auth_required(profile='default')
@group_required('kzd_editor')
@wrap_nice_exceptions
def delete_resource(request, womi_id, womi_version):
    resource = Resource(womi_id, womi_version)
    if request.method == 'POST':
        resource.delete()
        return HttpResponseRedirect(reverse('delete_resource_success'))
    else:
        return HttpResponseRedirect(reverse('edit_resource', args=(womi_id, womi_version)))


@epo_auth_required(profile='default')
@group_required('kzd_editor')
@wrap_nice_exceptions
def delete_resource_success(request):
    return render(request, 'editkzd/delete_resource_success.html')


@wrap_nice_exceptions
def resource_xml(request, womi_id, womi_version):
    if request.method == 'GET':
        resource = Resource(womi_id, womi_version)
        response = HttpResponse(resource.xml, content_type='text/xml; charset=utf-8')
        response['Content-Length'] = len(resource.xml)
        return response

    elif request.method == 'PUT':
        if request.META.get('HTTP_X_KZD_SYNC_SECRET') != settings.EPO_KZD_SYNC_SECRET:
            return HttpResponse(status=403)

        resource = Resource(womi_id, womi_version)
        resource.custom_id
        try:
            resource.xml
            error("trying to put XML for already existing %s", resource)
            return HttpResponse(status=400)
        except ResourceNotFoundException:
            # it is expected that the resource does not exist yet
            pass

        xml = request.body
        try:
            Resource.validate_raw_xml(xml)
        except Exception as e:
            error("error validating raw XML to be put for %s: %s", resource, e)
            return HttpResponse(status=400)

        resource.save_raw(xml)
        return HttpResponse(status=201)

    else:
        return HttpResponse(status=405)


