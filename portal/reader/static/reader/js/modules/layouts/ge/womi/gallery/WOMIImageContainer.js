define(['modules/core/womi/gallery/WOMIImageContainer'
], function (WOMIImageContainer) {
    return WOMIImageContainer.extend({

        _selectMedia: function () {
            return this.maxAvailableMedia();
        },

        imageOriginalSize: function(){
            return {
                width: this._imgElement[0].naturalWidth,
                height: this._imgElement[0].naturalHeight
            }
        },

        elementAttributes: function(){
            return {
                'class': 'generated-image',
                alt: this.options.alt,
                title: this.options.alt,
                'aria-label': this.options.alt
            }
        },

    });
});