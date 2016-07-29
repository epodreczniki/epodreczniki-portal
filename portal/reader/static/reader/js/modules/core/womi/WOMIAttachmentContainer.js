define(['jquery', 'backbone', 'modules/core/Registry', './WOMIContainerBase'], function ($, Backbone, Registry, Base) {
    return Base.extend({
        containerClass: 'attachment-container',
        _discoverContent: function () {
            this._title = this._mainContainerElement.data('title');
            this._src = this._mainContainerElement.data('src');
        },
        load: function () {
            if (this._mainContainerElement.find('.generated-attachment').length > 0 && !this._attachmentElement) {
                this._mainContainerElement.find('.generated-attachment').remove();
            }
            if (!this._attachmentElement) {
                this._attachmentElement = $('<div />', {
                    'class': 'generated-attachment'
                });
                this._mainContainerElement.append(this._attachmentElement);
                this._attachmentElement.append($('<a>', {href: this._src, text: 'Pobierz załącznik', target: '_blank'}));
            }
        },
        hasFullscreenItem: function () {
            return false;

        },
        contextCallback: function () {

            //window.location.href = this._src;
            window.open(
                this._src,
                '_blank'
            );
        }

    });
});