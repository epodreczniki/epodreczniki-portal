define(['require', 'jquery', 'bowser', 'backbone', 'modules/core/Registry'], function (require, $, bowser, Backbone, Registry) {
    var readerDefinition = $('#reader-definition');
    var deviceDetection = require('device_detection');

    readerDefinition = {
        stylesheet: readerDefinition.data('stylesheet'),
        env: readerDefinition.data('environment-type')
    };
    return Backbone.View.extend({
        debounceTimeout: 500,
        maxPercentageHeight: 0.80,
        roles: {},

        initialize: function (options) {
            this.init(options.source, options.destination);
            this._opts = options.params;
            this._parentOptions = options.parentOptions
        },

        init: function (source, destination) {
            this.source = source;
            this.destination = destination;
            this.fsMode = false;
            var image = this.destination.find('.image-container');
            if (image.length == 1) {
                this.splashScreen = image.clone();
            }
            this.on('autoplay', function () {
                this._playScreenClicked = true;
            });
        },

        load: function () {
        },

        dispose: function () {
        },

        isBrowserFullscreen: function(){
            return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement ||
                document.msFullscreenElement;
        },

        createIframe: function (container, dimensions, onloadCallback, preLoadCallback) {
            var iframe = $('<iframe frameborder="0">').css({
                margin: 0,
                padding: 0,
                border: 'none',
                width: dimensions.width,
                height: dimensions.height
            });

            if (preLoadCallback) {
                preLoadCallback(iframe);
            }
            iframe.addClass('proper-element');

            iframe.load(function () {
                iframe.contents().find('body').css({
                    margin: 0,
                    padding: 0
                });

                onloadCallback(iframe);
            });

            $(container).append(iframe);
        },

        debounceBody: function (width, height) {
            this.dispose();
            this.load();
        },

        _reprocess: function () {
            if (!this._playScreenClicked) {
                this.dispose();
                this.load();
            }
            this.trigger('resize');
        },

        recalculate: function(){
            this.debounceBody();
        },

        _womiContainer: function () {
            return this.destination.closest('.womi-container')[0];
        },

        _processEvent: function (event, type) {
            if (typeof type !== 'undefined' && event.target == this._womiContainer()) {
                (this['_' + type])();
            }
        },

        hasOwnLoadedRule: function(){
            return false;
        },

        getButtons: function () {
            return null;
        },

        enterFS: function () {
        },

        closeFS: function () {
        },

        debouncedResizeHandler: function () {
            var _this = this;

            if (this._debounceHandler) {
                return this._debounceHandler;
            } else {
                this._debounceHandler = $.debounce(_this.debounceTimeout, (function () {
                    var lastWidth = $(window).width();
                    var lastHeight = $(window).height();

                    return function (event, type) {
                        // This is a fix for behaviour seen on iPhone where address bar show/hide events cause resize events
                        if (lastHeight == $(window).height() && lastWidth == $(window).width()) {
                            _this._processEvent(event, type);
                            return;
                        }
                        var ua = navigator.userAgent;

                        if (ua.indexOf('Android') != -1 || ua.indexOf('iPhone') != -1 || ua.indexOf('iPad') != -1 || ua.indexOf('Windows Phone') != -1) {
                            var rotated = (lastHeight != $(window).height()) && (lastWidth != $(window).width());
                            if (!rotated) {
                                return;
                            }

                        }

                        lastHeight = $(window).height();
                        lastWidth = $(window).width();

                        _this.debounceBody(lastWidth, lastHeight);
                    };
                }()));

                return this._debounceHandler;
            }
        },

        setFullScreenMode: function () {
            this.fsMode = true;
        },
        hasFullscreen: function () {
            return true;
        },
        setRoles: function (roles) {
            this.roles = roles;
        },
        _prependUnderlay: function (create) {
            var dest = $(this.destination), _this = this;
            var underlay = dest.parent().find('.womi-underlay');
            if (create && underlay.length == 0) {
                underlay = $('<div>', { class: 'womi-underlay' });
                dest.before(underlay);
            }
            var wc = $(_this._womiContainer());
            if (underlay.length > 0) {
                underlay.css('top', wc.top);
                underlay.css('left', wc.left);
                underlay.css('width', wc.width() + 'px');
                underlay.css('height', wc.height() + 'px');
            }
        },

        _removeOverlay: function () {
            $(this.destination).parent().find('.womi-underlay').remove();
        },

        _fsEvent: function () {
            var ev;
            if (!bowser.msie) {
                ev = new CustomEvent('fullscreen', {
                    bubbles: true,
                    cancelable: true
                });
            } else {
                ev = document.createEvent("Event");
                ev.initEvent('fullscreen', true, true);
            }
            return ev;
        },

        _initPlayScreen: function (dimension) {
            var _this = this;
            if (this._playScreenClicked) {
                this.destination.empty();
                return false;
            } else {
                this._recreateSplashScreen();
                this.playItem = this._playItem(dimension);
                this.playItem.click(function () {
                    if (!epGlobal.isMobile) {
                        _this._playScreenClicked = true;
                        _this.load();
                    } else {

                        _this.destination[0].dispatchEvent(_this._fsEvent());
                    }
                    return false;
                });
                if (this.destination.find('.play-div').length == 0) {
                    this.destination.append(this.playItem);
                }
                return true;
            }
        },

        triggerFS: function () {
            this.destination[0].dispatchEvent(this._fsEvent());
        },

        _playItem: function (dimension) {
            var image, width, height;
            var _this = this;
            if (this.splashScreen) {
                var womi = Registry.get('womi');
                image = new womi.SplashscreenImageContainer({
                    el: this.destination.find('.image-container'),
                    options: {}
                });
                image._isSplash = true;
                if (this.fsMode) {
                    //image._width = 100.0;
                    //image.maxHeight = 1.0;
                }
                this._playscreenImage = image;
                image.load();
                image.initSplash();
                var container = $(image._imgElement);
                width = container.width();
                height = container.height();
            } else {
                width = dimension.width;
                height = dimension.height;
            }

            var div = $('<div/>', {
                class: 'play-div',
                css: {
                    position: 'relative'
                }
            });
            this._modifyPlayDiv(div);
            var overlay = $('<div/>', {
                class: 'womi-overlay'
            });

            var buttonClass = ( !deviceDetection.isMobile ? 'play-button-classic' : 'play-button-mini' );

            var button = $('<button/>', {
                class: 'play-button ' + buttonClass,
                title: 'Uruchom'
            });

            div.append(button);

            if (image) {
                $(image._imgElement).addClass('proper-element');
                div.append(image._imgElement);
                var properImg = div.find('img');
                if(properImg.length > 0){
                    properImg.css('width', 'auto').css('height', 'auto').css('max-height', this.getSize().height);
                }
                div.on('remove', function () {
                    if (_this._playscreenImage) {
                        _this._playscreenImage.dispose();
                    }
                });
            }

            return div;
        },

        _modifyPlayDiv: function (div) {

        },

        _playLabel: function () {
            return '';
        },

        _loadEngineScript: function (name, url, callback) {
            if ($('script[data-engine-name="' + name + '"]').length == 0) {
                epGlobal.head.js(url, function () {
                    callback();
                });
            } else {
                callback();
            }
        },

        _loadScripts: function (args) {
            epGlobal.head.js.apply(this, arguments);
        },

        _recreateSplashScreen: function () {
            if (this.splashScreen) {
                if (this.destination.find('.image-container').length != 1) {
                    this.destination.append(this.splashScreen.clone());
                }
            }
        },
        getSize: function () {
        }
    });


});