//>startExclusion
{% load engines %}
//>endExclusion

define(['require', 'jquery', 'bowser', 'backbone', './EngineInterface'], function (require, $, bowser, Backbone, EngineInterface) {

    return EngineInterface.extend({
        scriptSrc: "{% autoescape off %}{{ STATIC_URL }}{{ EXTERNAL_ENGINES.ace_editor.url_template }}{% endautoescape %}",

        _getExt: function (src) {
            return src.substring(src.indexOf('.') + 1);
        },

        _calcDimensions: function () {
            return {
                width: $(this.destination).width(),
                height: this.maxPercentageHeight * $(window).height()
            };
        },

        load: function () {
            var src = this.source;
            var _this = this;
            var dimensions = this._calcDimensions();
            var ext = this._getExt(src);
            require(['require', 'text!' + src], function (r, config) {
                config = JSON.parse(config);
                require(['text!' + r.toUrl(src + '/../' + config.file)], function (code) {
                    var newSrc = _this.scriptSrc + '?mode=' + config.mode +
                        '&code=' + encodeURIComponent(code) +
                        '&theme=' + config.theme;
                    _this.createIframe(_this.destination, dimensions, function (iframe) {
                    }, function (iframe) {
                        iframe[0].src = newSrc;
                        _this.debounceBody = function (width, height) {
                            iframe.css(_this._calcDimensions());
                        };
                    });

                    this.on('resize', _this.debouncedResizeHandler());
                });
            });
        },

        hasFullscreen: function () {
            return false;
        }

    });
});