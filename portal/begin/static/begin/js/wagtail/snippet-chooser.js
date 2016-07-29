function createSnippetChooserFilter(id, contentType) {
    var chooserElement = $('#' + id + '-chooser');
    var docTitle = chooserElement.find('.title');
    var input = $('#' + id);
    var editLink = chooserElement.find('.edit-link');
    var form = chooserElement.closest('form');
    var regex = /[\w\-\/]*\/snippets\/[\w]+\/[\w]+\/([\d]+)\//;
    var match = form.attr('action').match(regex);
    var _fltr = '';
    if(match){
        if(match.length > 0 && match[1]){
            _fltr = '?filter=' + match[1];
        }
    }

    $('.action-choose', chooserElement).click(function() {
        ModalWorkflow({
            'url': window.chooserUrls.snippetChooser + contentType + '/' + _fltr,
            'responses': {
                'snippetChosen': function(snippetData) {
                    input.val(snippetData.id);
                    docTitle.text(snippetData.string);
                    chooserElement.removeClass('blank');
                    editLink.attr('href', snippetData.edit_link);
                }
            }
        });
    });

    $('.action-clear', chooserElement).click(function() {
        input.val('');
        chooserElement.addClass('blank');
    });
}