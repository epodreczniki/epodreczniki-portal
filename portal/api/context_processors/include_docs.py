def include_docs(request):
    if hasattr(request, 'docs'):
        return {'docs': request.docs}

    return {}
