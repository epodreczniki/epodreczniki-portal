from django.conf import settings
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.shortcuts import render
from django.utils.cache import patch_response_headers
from django.views.static import serve
from wagtail.wagtailadmin.modal_workflow import render_modal_workflow
from wagtail.wagtailsnippets.views.snippets import get_content_type_from_url_params, get_snippet_type_name


def image_serve(request, path):
    response = serve(request, path, document_root=settings.MEDIA_ROOT)
    patch_response_headers(response, cache_timeout=settings.WAGTAIL_IMAGE_SERVE_CACHE_TIMEOUT)
    return response


def intro(request):
    return render(request, 'begin/intro.html')

def licenses(request):
    return render(request, 'begin/licenses-page.html')

def data_protection(request):
    return render(request, 'begin/begin-data-protection.html')

def copyright_exceptions(request):
    return render(request, 'begin/begin-copyright-exceptions.html')


def choose_snippet(request, content_type_app_name, content_type_model_name):
    content_type = get_content_type_from_url_params(content_type_app_name, content_type_model_name)
    model = content_type.model_class()
    snippet_type_name = get_snippet_type_name(content_type)[0]
    if 'filter' in request.GET and request.GET['filter'] >= 0:
        items = model.objects.filter(snippet__id=request.GET['filter'])
    else:
        items = model.objects.all()

    p = request.GET.get("p", 1)
    paginator = Paginator(items, 25)

    try:
        paginated_items = paginator.page(p)
    except PageNotAnInteger:
        paginated_items = paginator.page(1)
    except EmptyPage:
        paginated_items = paginator.page(paginator.num_pages)

    return render_modal_workflow(
        request,
        'wagtailsnippets/chooser/choose.html', 'wagtailsnippets/chooser/choose.js',
        {
            'content_type': content_type,
            'snippet_type_name': snippet_type_name,
            'items': paginated_items,
        }
    )
