define(['require',
    'jquery',
    'bowser',
    'backbone',
    'underscore',
    './ScalingDivMixin',
    './PureHTMLEngine',
    './AdobeEdgeEngine'], function (require, $, bowser, Backbone, _, ScalingDivMixin, PureHTMLEngine, AdobeEdgeEngine) {

    var Engine = Backbone.View.extend({});

    _.extend(Engine.prototype, AdobeEdgeEngine.prototype, {
        initialize: function (options) {
            PureHTMLEngine.prototype.initialize.call(this, options);
        },
        contentsAdjust: function (iframe) {
            iframe.attr('allowfullscreen', true);
        },
        postIframeLoad: function (iframe) {
            var container = iframe.contents().find('#container');
            this._overrideOffsets(iframe);
            this.iframeResizeCallback(container.width(), container.height(), iframe);
            this.debounceBody(container.width(), container.height());
            var _this = this;
            var oldDebounce = this.debounceBody;
            this.debounceBody = function (width, height) {
                if (_this.isBrowserFullscreen()) {
                    iframe.css('transform', '');
                    return;
                }
                oldDebounce.call(_this, width, height);
            }
        },

        enterFS: function () {
            this._prependUnderlay(true);
            $(this.destination).children().remove();
            this._playScreenClicked = false;
            this.apiListenerClose && this.apiListenerClose();
            this.off('resize', this.debouncedResizeHandler());
        },

        closeFS: function () {
            this.load();
        },

        _overrideOffsets: function (iframe) {
            if (document.msExitFullscreen) {
                try {
                    var wnd = iframe[0].contentWindow;
                    var ElementClass = wnd.HTMLElement;
                    var offsets = ['offsetWidth', 'offsetHeight', 'offsetLeft', 'offsetTop'];
                    var offsetsMap = {};

                    function makeDefines(propertyName) {
                        offsetsMap[propertyName] = Object.getOwnPropertyDescriptor(ElementClass.prototype, propertyName);
                        Object.defineProperty(ElementClass.prototype, propertyName, {
                            get: function () {
                                var w = offsetsMap[propertyName].get.call(this);
                                if (document.msFullscreenElement && document.msExitFullscreen) {
                                    return (w * 100);
                                } else {
                                    return w;
                                }
                            }
                        });

                    }

                    _.each(offsets, function(name) {
                        makeDefines(name);
                    });
                } catch (ex) {
                    console.warn('problem with overriding offsets for pano2vr');
                }
            }
        }
    });

    return Engine;
});