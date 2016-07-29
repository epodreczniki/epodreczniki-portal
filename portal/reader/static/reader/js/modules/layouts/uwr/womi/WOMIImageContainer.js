define(['modules/core/womi/WOMIImageContainer', 'jquery'], function (WOMIImageContainer, $) {

    return WOMIImageContainer.extend({

//        load: function () {
//            WOMIImageContainer.prototype.load.apply(this);
//            var container = this._imgElement;
//            alert(container.parent().html());
//            if (container.closest('div.para.full-width').length > 0) {
//                alert(container.closest('.womi-container').html());
//                var movedDetails = $('<div class="full-width-image-details">');
//            }
//        },
        _calcSvgDimensions: function (d) {
            var desiredWidth = this.svgViewBoxWidth || this.svgWidth || d.maxWidth;
            var desiredHeight = this.svgViewBoxHeight || this.svgHeight || d.maxHeight;
            var ratio = desiredHeight / desiredWidth;
            if (ratio == 0) {ratio = 0.5;}

            var dimensions = {
                width: d.containerWidth,
                height: d.containerWidth * ratio
            };

            var maxHeight = d.maxHeight;
            if (this._isFS) {
                maxHeight = $(window).height();
            }

            if ((maxHeight>0)&&(dimensions.height > maxHeight)) {
                var scale = maxHeight / dimensions.height;
                dimensions.width *= scale;
                dimensions.height *= scale;
            }
            return dimensions;
        },
        _resize: function () {
            var _this = this;
            if (!this._resizeHandler) {
                this._resizeHandler = function () {
                    var dimensions = _this._calcDimensions();
                    //$(_this._imgElement).
                    if (_this._isEmbed) {

                        if (_this.svgWidth) {
                            _this._maxHModifier(dimensions);
                            dimensions.containerWidth = _this._mainContainerElement.width();
                            var d = _this._calcSvgDimensions(dimensions);
                            $(_this._imgElement).css({width: d.width, height: d.height});

                            try {
                                $(_this._imgElement).find('iframe')[0].contentWindow.postMessage({msg: 'svgIframeSize', width: d.width, height: d.height, haveSize: true, alt: _this._altText}, '*');
                            } catch (err) {
                                console.log($(_this._imgElement).find('iframe')[0]);
                            }
                        } else {
                            $(_this._imgElement).find('iframe')[0].contentWindow.postMessage({msg: 'svgIframeSize', haveSize: false, alt: _this._altText}, '*');
                            $(_this._imgElement).css({width: dimensions.maxWidth, height: dimensions.maxHeight});
                        }
                    } else {
                        _this._maxHModifier(dimensions);
                        if ((_this.roles && _this.roles.zoomable)) {
                            $(_this._imgElement).css(dimensions);
                            $(_this._imgElement).imageLens('delete');
                            $(_this._imgElement).imageLens({lensSize: _this.lensSize, lensCss: 'lens-style',
                                imageSrc: _this._buildMediaUrl(_this._src, _this.maxAvailableMedia())});
                        } else {
                            $(_this._imgElement).css(dimensions);
                        }
                    }
                    _this._setFullScreenImageWidth($(_this._imgElement));
                }
            }
            return this._resizeHandler;
        },

        _maxHModifier: function(dimensions){
            dimensions.maxHeight = '';
        },

        _titleAfterImage: function(){
            if ($($(this.parent.el).find('.image-container'))) {
                $($(this.parent.el).find('.title')).insertAfter($($(this.parent.el).find('.image-container')));
            }

        },
        _moveCaptionAndTitle: function() {
            var womi = this._mainContainerElement.closest('.womi-container');
            if (womi.closest('div.para.full-width').length > 0) {
                var movedDetails = $('<div class="full-width-image-details">');
                womi.find('.title, .caption').appendTo(movedDetails);
                womi.find('.image-container').append(movedDetails);
            }
        },
        _renderDoneRegister: function () {
            this.on('renderDone', function () {
                this._titleAfterImage();
                this._resize()();
                if (!this.hasFullscreenItem()) {
                    this._createOverlayFullscreenField();
                }
                this._moveCaptionAndTitle();
            });
        }
    });
});