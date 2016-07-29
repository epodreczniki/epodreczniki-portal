define(['../WOMIImageContainer'
], function (WOMIImageContainer) {
    return WOMIImageContainer.extend({

        _calcDimensions: function () {

            return {maxHeight: this.galleryHeight,
                maxWidth: this._mainContainerElement.width() };
        },

        changeSize: function(size){
            //console.log(size);
            this.galleryHeight = size.height;
            this._resize()();
        },

        _createOverlayFullscreenField: function () {

        },
        hasFullscreenItem: function () {

        },

        applyNewPrototype: function(){
            this.on('changeSize', this.changeSize);
            this.galleryHeight = $(window).height();
        },
        _maxHModifier: function(dimensions){
            dimensions.maxHeight = '';
        }

    });
});