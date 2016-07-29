define(['require', 'jquery', 'bowser', 'backbone', './EngineInterface'], function (require, $, bowser, Backbone, EngineInterface) {
    var readerDefinition = $('#reader-definition');

    readerDefinition = {
        stylesheet: readerDefinition.data('stylesheet'),
        env: readerDefinition.data('environment-type')
    };

    return EngineInterface.extend({
        _playScreenClicked: true, //temporary!!!
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
                width: $(this.destination).width(),
                height: $(this.destination).width() * (hR ? hR : 1)
            };

            if (readerDefinition.env == 'uwr') {
                return dimensions;
            }
            var maxHeight = this.maxPercentageHeight * $(window).height();
            if (tile.length > 0) {
                if (!tile.hasClass('anchor-padding')) {
                    maxHeight = tile.height() * this.maxPercentageHeight;
                }
                //_this._mainContainerElement.closest('.womi-container').find('.title').hide();
            }

            if (this.fsMode) {
                maxHeight = $(window).height();
            }
            if (dimensions.height > maxHeight) {
                var scale = maxHeight / dimensions.height;
                dimensions.width *= scale;
                dimensions.height *= scale;
            }
            return dimensions;
        },

        _calcMaximized: function () {
            return {
                height: $(window).height() - 10,
                width: $(window).width() - 10
            };
        },

        _calcContainer: function () {
            if (this.roles.avatar) {
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

        additionalOpts: function(require, obj, ReaderApi){
            return {};
        },

        getSource: function(){
            return this.source;
        },

        load: function () {

            var _this = this;
            require(['require', this.getSource(), 'reader.api'], function (require, lib, ReaderApi) {
                _this.obj = new lib();
//                if(readerDefinition.env == 'ee' || readerDefinition.env == 'early-education'){
//                    _this.obj.enableMaximize = true;
//                }

                _this._calcContainer();
                var dimensions = _this._calcDimensions(_this.roles.avatar);
                if (!_this.roles.avatar) {
                    if (!_this.fsMode) {
                        if (readerDefinition.env == 'uwr') {
                            _this._playScreenClicked = true;
                        }
                        if (_this._initPlayScreen(dimensions)) {
                            _this.on('resize', _this.debouncedResizeHandler());
                            return;
                        } else {
                            _this.off('resize', _this.debouncedResizeHandler());
                            if (_this.obj.enableMaximize) {
                                _this.savedStyle = _this.destination.attr('style');
                                _this.destination.css({
                                    'background-color': 'white',
                                    position: 'fixed',
                                    top: '5px',
                                    left: '5px',
                                    'z-index': '100000'
                                });
                                dimensions = _this._calcMaximized();
                                _this.destination.css({width: dimensions.width + 'px',
                                    height: dimensions.height + 'px'});

                            }
                        }
                    }
                }

                if (_this.obj.sizeChange) {
                    _this.obj.sizeChange(dimensions.width, dimensions.height);
                }

                var opts = {
                    width: dimensions.width,
                    height: dimensions.height,
                    isFullscreen: _this.fsMode,
                    methods: {
                        openFullscreen: function () {

                            _this.destination[0].dispatchEvent(_this._fsEvent());
                        },
                        closeFullscreen: function () {
                            $.fancybox.close(true);
                        }
                    }
                };
                if (_this.obj.enableMaximize) {
                    opts.methods = {
                        closeWomi: function () {
                            _this.dispose();
                            _this.destination.attr('style', _this.savedStyle);
                            _this.load();
                        }
                    }
                }

                _.extend(opts, _this.additionalOpts(require, _this.obj, ReaderApi));

                _this.obj.start(_this.destination, opts);
                _this.on('resize', _this.debouncedResizeHandler());
            });

        },
        dispose: function () {
            try {
                if (this.obj) {
                    if (this.obj.clean) {
                        this.obj.clean();
                    }

                    $(this.destination).children().remove();
                    this._playScreenClicked = false;
                    this.off('resize', this.debouncedResizeHandler());
                }

            } catch (err) {
                console.error(err);
            }

        },
        debounceBody: function (width, height) {
            try {
                this._calcContainer();
                var dimensions = this._calcDimensions(this.roles.avatar);
                if (this.obj.enableMaximize) {
                    dimensions = this._calcMaximized();
                }
                if (this.obj.sizeChange) {
                    this.obj.sizeChange(dimensions.width, dimensions.height);
                }
            } catch (err) {
                console.error(err);
            }
        },
        hasFullscreen: function () {
            return true;
        },
        getSize: function () {
            return this._calcDimensions(false);
        }
    });
});