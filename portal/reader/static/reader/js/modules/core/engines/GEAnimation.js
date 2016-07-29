define(['require', 'jquery', 'bowser', 'backbone', './GeneratedExerciseEngine', 'libs/avplayer/player.ext', 'modules/core/WomiManager', 'modules/api/apilistener'], function (require, $, bowser, Backbone, EngineInterface, player, WomiManager, apilistener) {
    var readerDefinition = $('#reader-definition');

    readerDefinition = {
        stylesheet: readerDefinition.data('stylesheet'),
        env: readerDefinition.data('environment-type')
    };

    var apiListener = apilistener;

    return EngineInterface.extend({
        url: '/global/libraries/ge/runner.html',
        urlPattern: '/global/libraries/ge/{ver}/runner.html',
        maxPercentageHeight: 1,

        avatarConfig: function () {
            return {
                ratio: 16 / 9
            }
        },

        _getUrl: function(){
            if(this._opts.engineVersion){
                return this.urlPattern.replace('{ver}','v' + (this._opts.engineVersion + '').replace('.', '_'))
            }
            return this.url;
        },

        _calcDimensions: function (isAvatar) {
            if (isAvatar) {
                return {
                    height: $(this._womiContainer()).height(),
                    width: $(this._womiContainer()).width()
                };
            }

            var hR = this._opts.heightRatio;
            var tile = this.destination.closest('.tile');
            var dimensions = {
                width: $(this.destination.parent()).width(),
                height: $(this.destination.parent()).width() * (hR ? hR : 1)
            };


            var maxHeight = this.maxPercentageHeight * $(window).height();
            if (tile.length > 0) {
                if (!tile.hasClass('anchor-padding')) {
                    maxHeight = tile.height() * this.maxPercentageHeight;
                }
                //_this._mainContainerElement.closest('.womi-container').find('.title').hide();
            }
            dimensions.height = maxHeight;

//            if (this.fsMode) {
//                maxHeight = $(window).height();
//            }
//            if (dimensions.height > maxHeight) {
//                var scale = maxHeight / dimensions.height;
//                dimensions.width *= scale;
//                dimensions.height *= scale;
//            }
            return dimensions;
        },

        _calcMaximized: function () {
            return {
                height: $(window).height(),
                width: $(window).width()
            };
        },

        _calcContainer: function () {
            if (this.roles.context) {
                var a = $(window).height() * 0.25;
                $(this._womiContainer()).css({
                    'position': 'fixed',
                    'bottom': '0px',
                    'left': '80px',
                    padding: 0,
                    width: a,
                    height: a
                });
            }
        },

        _modifyPlayDiv: function (div) {
            //var dimm = this._calcDimensions(this.obj && this.obj.isAvatar);

            //div.css('min-height', dimm.height);
        },

        hasOwnLoadedRule: function(){
            return true;
        },

        getPosition: function () {
            return this.destination[0].getBoundingClientRect();
        },

        prepareSourceUrl: function(source){
            return source;
        },

        load: function () {

            var _this = this;
            var dimensions = _this._calcDimensions(_this.roles.avatar);
            if (_this._initPlayScreen(dimensions)) {
                _this.on('resize', _this.debouncedResizeHandler());
                return;
            } else {
                _this.off('resize', _this.debouncedResizeHandler());
                require(['require', 'reader.api', 'reader.communication.api'], function (require, api, commapi) {
                    _this.savedStyle = _this.destination.attr('style');
                    var d = $('<iframe>');
                    d.css({'width': '100%', 'height': '100%', border: 0, 'background-color': 'transparent' });
                    _this.destination.append(d);
                    _this.destination.css({ width: dimensions.width + 'px', height: dimensions.height + 'px'});

                    var api = new api(require, true, _this.source);
                    d.load(function(){
                        _this.trigger('fullyLoaded');
                    });
                    d[0].src = _this._getUrl() + '?id=' + _this.prepareSourceUrl(_this.source);

                    _this.on('resize', _this.debouncedResizeHandler());

                    _this.apiListenerClose = apiListener(_this, window, d[0].contentWindow, api, commapi);

//                        $(document).on('keyup.geanimation', function (e) {
//
//                            if (e.keyCode == 27) {
//                                if (_this._playScreenClicked) {
//                                    _this.closeWomi();
//                                    $(document).unbind('keyup.geanimation');
//                                }
//                            }
//                        });

                });

            }


        },

        _visibleOverflows: function () {
            var parents = [];
            this.parents = parents;
            this.destination.parents().each(function () {
                var t = $(this);
                if (t.css('overflow') === 'hidden' && !t.is('body')) {
                    parents.push({
                        el: $(this),
                        overflowAction: (t.attr('style') && t.attr('style').indexOf('hidden') < 0 ? 'del' : 'reset')
                    });
                    t.css('overflow', 'visible');
                }
            });
        },

        _rollbackOverflows: function () {
            _.each(this.parents, function (parent) {
                if (parent.overflowAction === 'del') {
                    parent.el.css('overflow', '');
                } else if (parent.overflowAction === 'reset') {
                    parent.el.css('overflow', 'hidden');
                }
            })
        },

        maximize: function () {
            this.maximized = true;
            this._visibleOverflows();
            var dimensions = this._calcMaximized();
            if (!this.roles.avatar) {
                WomiManager.womiEventBus.trigger('navHideDisplay');
                this.destination.css({
                    'background-color': 'transparent',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    'z-index': '2147483647'
                });
                this.destination.css({width: dimensions.width + 'px',
                    height: dimensions.height + 'px'});
            } else {
                this.destination.css({
                    'background-color': 'transparent',
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    'z-index': '2147483647',
                    width: dimensions.width,
                    height: dimensions.height
                });
                WomiManager.womiEventBus.trigger('hideNavigation');
//                this.destination.animate({
//                    width: dimensions.width,
//                    height: dimensions.height
//
//                }, 400);
                this.destination.closest('div.womi-avatar').addClass('womi-avatar-max');
            }


        },

        closeMaximize: function () {
            this.maximized = false;
            if (!this.roles.avatar) {
                WomiManager.womiEventBus.trigger('navShowDisplay');
            }
            this.destination.closest('div.womi-avatar').removeClass('womi-avatar-max');
            this.destination.attr('style', this.savedStyle);
            this._rollbackOverflows();
            var dimensions = this._calcDimensions(this.roles.avatar);
            this.destination.css({width: dimensions.width + 'px', height: dimensions.height + 'px'});
            //this.load();
        },
        dispose: function () {
            try {

                this.apiListenerClose && this.apiListenerClose();
                $(this.destination).children().remove();
                this._playScreenClicked = false;
                this.off('resize', this.debouncedResizeHandler());


            } catch (err) {
                console.error(err);
            }

        },
        debounceBody: function (width, height) {
            try {
                //this._calcContainer();
                var dimensions = this._calcDimensions(this.roles.avatar);
                if (this.maximized) {
                    dimensions = this._calcMaximized();
                    console.log(dimensions);
                }
                this.destination.css({width: dimensions.width + 'px',
                    height: dimensions.height + 'px'});
            } catch (err) {
                console.error(err);
            }
        },
        hasFullscreen: function () {
            return false;
        },
        getSize: function () {
            return this._calcDimensions(false);
        }
    });
});
