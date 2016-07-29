define(['require', 'jquery', 'bowser', 'backbone', './EngineInterface', 'modules/api/apilistener'], function (require, $, bowser, Backbone, EngineInterface, apilistener) {

    return EngineInterface.extend({
        _calcDimensions: function () {
            if ($(this.destination).closest('.interactive-banner').length) {
                return {
                    width: '100%',
                    height: $(window).width() * this._opts.heightRatio
                };
            }

            var dimensions = {
                width: $(this.destination).width(),
                height: $(this.destination).width() * this._opts.heightRatio
            };

            var maxHeight = this.maxPercentageHeight * $(window).height();
            if (this.fsMode) {
                maxHeight = $(window).height();
            }

            var scale = maxHeight / dimensions.height;
            if (dimensions.height > maxHeight) {

                dimensions.width *= scale;
                dimensions.height *= scale;
            }
            dimensions.scale = scale;
            return dimensions;
        },

        load: function () {

            var srcUrl = this.source;
            var dimensions = this._calcDimensions();

            if (!this.fsMode) {
                if (this._initPlayScreen(dimensions)) {
                    this.on('resize', this.debouncedResizeHandler());
                    return;
                } else {
                    this.off('resize', this.debouncedResizeHandler());
                }
            }
            var _this = this;
            this.createIframe(this.destination, dimensions, function (iframe) {
            }, function (iframe) {
                iframe[0].src = srcUrl;
                _this._connectApiListener(iframe);
                _this.debounceBody = function (width, height) {
                    iframe.css(_this._calcDimensions());
                };
            });

            this.on('resize', this.debouncedResizeHandler());

        },

        _connectApiListener: function(iframe){
            var _this = this;
            require(['require', 'reader.api', 'reader.communication.api'], function (require, Api, commapi) {
                var api = new Api(require, true, _this.source);
                _this.apiListenerClose = apilistener(_this, window, iframe[0].contentWindow, api, commapi);
            });
        },

        _modifyPlayDiv: function (div) {
            var dim = this._calcDimensions();
            div.css('min-height', dim.height);
        },
        dispose: function () {
            this._prependUnderlay(true);
            $(this.destination).children().remove();
            this._playScreenClicked = false;
            this.apiListenerClose && this.apiListenerClose();
            this.off('resize', this.debouncedResizeHandler());
        },

        getSize: function () {
            var hRatio = this._opts.heightRatio;

            return {width: 900, height: 900 * hRatio}
        }
    });
});