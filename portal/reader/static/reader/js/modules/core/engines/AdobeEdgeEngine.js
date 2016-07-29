define(['require', 'jquery', 'bowser', 'backbone', 'underscore', './ScalingDivMixin', './PureHTMLEngine'], function (require, $, bowser, Backbone, _, ScalingDivMixin, PureHTMLEngine) {

    var AdobeEdgeEngine = Backbone.View.extend({});

    _.extend(AdobeEdgeEngine.prototype, PureHTMLEngine.prototype, ScalingDivMixin, {
        plusWH: 0,
        _4k: 4000,
        addMessageEvent: true,
        initialize: function (options) {
            PureHTMLEngine.prototype.initialize.call(this, options);
            var ver = this._opts.engineVersion;
            if(ver == '5.0.1' || ver == '5.0.0'){
                _.extend(this, PureHTMLEngine.prototype);
                this._connectApiListener = function(){};
            }
        },
        contentsAdjust: function () {
        },
        iframeResizeCallback: function (width, height, iframe) {
            this.savedHeight = height;
            this.savedWidth = width;
            var dimensions = this._calcDimensions();
            iframe.width(width).height(height);
            iframe.css('transform', 'scale(' + (dimensions.scale) + ')');
            iframe.css('transform-origin', '0 0');
            var _this = this;
            this.debounceBody = function (width, height) {
                var d = _this._calcDimensions();
                iframe.parent().css({
                    width: d.desiredWidth,
                    height: d.desiredHeight
                });
                iframe.css('transform', 'scale(' + (d.scale) + ')');
                iframe.css('transform-origin', '0 0');
            };
        },
        _calcDimensions: function () {
            var hRatio = this._opts.heightRatio;
            var dimensions = {
                width: $(this.destination).width(),
                height: $(this.destination).width() * hRatio
            };

            var maxHeight = this.maxPercentageHeight * $(window).height();
            if (this.fsMode) {
                maxHeight = $(window).height();
            }

            if (dimensions.height > maxHeight) {
                var scale = maxHeight / dimensions.height;
                dimensions.width *= scale;
                dimensions.height *= scale;
            }
            dimensions.desiredWidth = dimensions.width;
            dimensions.desiredHeight = dimensions.height;
            dimensions.width = this.savedWidth || dimensions.desiredWidth;
            dimensions.height = this.savedHeight || dimensions.desiredHeight;
            dimensions.scale = Math.min(dimensions.desiredWidth / dimensions.width, dimensions.desiredHeight / dimensions.height);
            return dimensions;
        }
    });
    return AdobeEdgeEngine;
});