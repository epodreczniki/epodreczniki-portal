define([
    './WOMIImageContainer',
    'underscore'
], function (WOMIImageContainer, _) {
    return WOMIImageContainer.extend({
//        render: function () {
//            this._mainContainerElement.remove();
//            this._mainContainerElement = $('<div>', { 'class': this.containerClass });
//            this.load();
//            return this._mainContainerElement;
//        },
        _renderDoneRegister: function () {
        },
        getLoadedImage: function (callback) {
            if (this._imgElement.naturalHeight) {
                callback({img: this._imgElement});
            } else {
                this.once('imageLoaded', function (o) {
                    callback(o);
                });
            }

        },
        _resize: function () {
            return function(){}
        },
        load: function () {
            var selectedMedia = this._selectMedia();
            this._imgElement = $('<img>', {
                'class': 'generated-image',
                alt: this._altText,
                'aria-label': this._altText//,
                //style: 'width: ' + this._width + "; ",//width: auto;",
                //src: this._buildMediaUrl(this._src, selectedMedia)
            });
            var url = this._buildMediaUrl(this._src, selectedMedia);
            this._imgElement.load(_.bind(function () {
                this.trigger('imageLoaded', {img: this._imgElement})
            }, this));
            this._imgElement.attr('src', url);
            this._mainContainerElement.append(this._imgElement);
        }
    });
});