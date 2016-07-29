define(['jquery',
    '../../Component',
    'underscore',
    'backbone',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    'modules/core/HookManager'], function ($, Component, _, Backbone, Logger, Utils, HookManager) {

    function sgn(x) {
        return (x > 0) - (x < 0);
    }

    var PanoramaElement = Backbone.View.extend({
        stripWidth: 200, //px
        initialize: function (options) {
            this.top = options.corner.top;
            this.left = options.corner.left;

            this.context = options.context;
            this.canvas = options.canvas;

            this.spaceWidth = options.spaceWidth;
            this.spaceHeight = options.spaceHeight;

            this.images = [];
            this.firstImage = Math.ceil(this.left / this.stripWidth);
            if (this.firstImage > 0 && this.firstImage > (this.left / this.stripWidth)) {
                this.firstImage--;
            }
            this.lastImage = Math.ceil((this.left + this.spaceWidth) / this.stripWidth) - 1;
            this.imagesToLoad = this.lastImage - this.firstImage + 1;

            this.shiftX = 0;
            this.shiftY = 0;

            this.imageLinkCreator = options.imageLinkCreator;
        },

        downloadImages: function (callback) {
            var _this = this;
            if (this.images.length == 0) {
                for (var i = this.firstImage; i <= this.lastImage; i++) {

                    var img = new Image();
                    img.crossOrigin = "anonymous";

                    img.onload = function () {
                        this.loaded = true;
                        _this.imagesToLoad--;
                        if (_this.imagesToLoad == 0) {
                            callback({ready: true});
                        }
                    };
                    this.images.push(img);
                    img.src = this.imageLinkCreator(i);

                }
            }
        },

        askReadiness: function (callback) {
            if (this.imagesToLoad > 0) {
                this.downloadImages(callback);
            } else {
                callback({ready: true});
            }

        },

        //most problematic friendly code here
        render: function () {
            var _this = this;
            var width = this.canvas.width();
            var height = this.canvas.height();
            var scale = (width / _this.spaceWidth);
            var scaledStripWidth = Math.ceil(scale * this.stripWidth);
//            this.context.fillStyle = "rgb(0,204,255)";
//            this.context.fillRect(0, 0, width, height);
            var firstStrip = scaledStripWidth;
            var sX = _this.shiftX * scale;
            var sY = _this.shiftY * scale;
            _.each(this.images, function (image, index) {
                if (index == 0) {
                    var maxStrip = _this.left % _this.stripWidth;
                    firstStrip = Math.ceil((_this.stripWidth - maxStrip) * scale);
                    //off screen cutoff
                    if (sX + firstStrip >= 0 && sX <= width) {
                        _this.context.drawImage(image, maxStrip, _this.top, _this.stripWidth - maxStrip, _this.spaceHeight, 0 + sX, 0 + sY, firstStrip, height);
                    }
                } else {
                    //off screen cutoff
                    var stripWidth = Math.min(image.width, _this.stripWidth);//because some strips (last) can be thinner
                    var _scaledStripWidth = Math.min(Math.ceil(scale * stripWidth), scaledStripWidth);
                    var offset = firstStrip + ((index - 1) * scaledStripWidth) + sX;
                    if (offset + _scaledStripWidth >= 0 && offset <= width) {
                        _this.context.drawImage(image, 0, _this.top, stripWidth, _this.spaceHeight, offset, 0 + sY, _scaledStripWidth, height);
                    }
                }
            });
        },

        shift: function (sX, sY) {
            this.shiftX = sX;
            this.shiftY = sY;
            this.render();
        },

        clearShift: function () {
            this.shiftX = 0;
            this.shiftY = 0;
        }
    });

    var Panorama = Backbone.View.extend({

        initialize: function (options) {

            _.extend(this, options);

            this.panoramaElements = [];
        },
        addPanoramaElement: function (corner) {
            var _this = this;

            var pe = new PanoramaElement({
                corner: corner,
                context: this.context,
                canvas: this.canvas,
                spaceWidth: this.spaceWidth,
                spaceHeight: this.spaceHeight,
                imageLinkCreator: function (imageNumber) {
                    return _this.womiPath + _this.tileScheme + imageNumber + '.' + _this.tileExtension;
                }
            });
            this.panoramaElements.push(pe);
        },

        showElement: function (id, readyCallback) {

            var pe = this.panoramaElements[id];
            pe.askReadiness(function (o) {
                pe.render();
                readyCallback();
            })
        },

        render: function () {
        },

        animationStepPixels: 20,
        pixelVelocity: 4000, //px per second,
        timeout: 17, //timeout for achieve 60Hz redraw animation

        animate: function (from, to, animationEndCallback) {
            var _this = this;
            var dir = from - to;
            var elements = _.range(from, to + -sgn(dir), -sgn(dir));
            var toLoad = elements.length;

            _.each(elements, function (idx) {
                _this.panoramaElements[idx].askReadiness(function () {
                    toLoad--;
                    if (toLoad == 0) {
                        _this._stepByStepAnimation(elements, animationEndCallback);
                    }
                })
            });
        },

        _stepByStepAnimation: function (elements, animationEndCallback) {
            var buckets = [];
            var _this = this;
            for (var i = 0; i < elements.length - 1; i++) {
                buckets.push({from: elements[i], to: elements[i + 1]});
            }
            buckets = buckets.reverse();

            var anim = function () {
                var b = buckets.pop();
                if (b) {
                    _this._animate(b.from, b.to, function () {
                        anim();
                    });
                } else {
                    animationEndCallback();
                }
            };

            anim();
        },

        _animate: function (from, to, animationEndCallback) {
            var _this = this;
            var pe1 = this.panoramaElements[from];
            var pe2 = this.panoramaElements[to];
            var pe1X = 0, pe2X;
            var direction = from - to;
            var w = Math.abs(pe1.left - pe2.left);
            pe2X = w * -sgn(direction);
            var v = this.pixelVelocity * (this.timeout / 1000);

            var motion = function () {
                var stop = false;
                if (direction < 0) {
                    pe1X -= v;
                    pe2X -= v;
                    if (pe2X <= 0) {
                        stop = true;
                        pe2X = 0;
                    }
                } else {
                    pe1X += v;
                    pe2X += v;
                    if (pe2X >= 0) {
                        stop = true;
                        pe2X = 0;
                    }
                }

                pe1.shift(pe1X, 0);
                pe2.shift(pe2X, 0);
                if (!stop) {
                    setTimeout(motion, _this.timeout);
                } else {
                    pe1.clearShift();
                    pe2.clearShift();
                    animationEndCallback();
                }
            };

            setTimeout(motion, _this.timeout);

        }


    });


    return Component.extend({
        name: 'Space2d',
        elementSelector: '[data-grid-width]',
        topbarHeight: 0,
        womiConfigFile: 'config/main.json',
        womiMetadata: 'metadata.json',

        postInitialize: function (options) {
            //var space = newSpace(this);
            var _this = this;
            var spaceInitialized = false;
            HookManager.addHook('loadModuleHook', function (kernel, moduleElement, fromClick, save) {
                var params = ['save', 'ajaxUrl', 'module_id', 'version', 'href', 'dependencies', 'click', 'moduleElement'];
                //we can add one more condition to disable image space
                //TODO: consider rework loadModule to accept just HTML element - resolve attr()
                if (spaceInitialized && moduleElement) {
                    var temp = $(moduleElement);
                    var parent = $('#table-of-contents').find('[data-toc-path=' + moduleElement.attr('data-toc-parent-path') + ']');
                    var base = $('#module-base');
                    //base.attr('href', temp.data('ajax-url'));
                    kernel._layout.trigger('space2dMoveStart', moduleElement);
                    kernel._layout.trigger('space2dMoveTo', [moduleElement.attr('data-toc-parent-path'),
                        Number(moduleElement.attr('data-attribute-panorama-order') - 1), function () {
                            $('#module-content').html('');
                        }, function () {
                            kernel.trigger('loadModule', _.object(params, [save, temp.data('ajax-url'),
                                temp.data('module-id'), temp.data('module-version'), temp.attr('href'), temp.data('dependencies-url'), fromClick, temp]));
                            kernel._layout.trigger('space2dMoveEnd', moduleElement);
                        }, parent.attr('data-attribute-panorama-womi-id'), Utils.collectTilesDummies(parent)]);
                    return false;
                } else {
                    return true;
                }
            });

            this.listenTo(this._layout, 'initSpace', function (args) {
                spaceInitialized = true;
                _this.initFunction.apply(_this, args);
                _this.trigger('hideTOC');
            });


            this.listenTo(this._layout, 'space2dMoveTo', function (args) {
                _this.moveTo.apply(_this, args);
            });

            this.listenTo(this._layout, 'windowResize', function () {
                _this.trigger('resizeSpace2d');
            });

            this.listenTo(this._layout, 'userTypeSelect', function () {
                _this.trigger('resizeSpace2d');
            });

            this.resizeFunc = function () {
                var canvas = _this.canvas;
                //to avoid horizontal scrolling
                var aspect = 1.0 / Math.max((_this.viewHeight / (window.innerHeight - _this.topbarHeight)),
                    (_this.viewWidth / window.innerWidth));
                canvas[0].width = _this.viewWidth * aspect;
                canvas[0].height = _this.viewHeight * aspect;
                canvas.css({left: 0, top: _this.topbarHeight});
                if (Math.round(canvas[0].width) != Math.round(window.innerWidth)) {
                    canvas.css('left', (window.innerWidth - canvas[0].width) / 2);
                } else {
                    canvas.css('top', (((window.innerHeight - _this.topbarHeight) - canvas[0].height) / 2) + _this.topbarHeight);
                }
            };

            this.on('resizeSpace2d', _.debounce(function () {
                _this.resizeFunc();
                _this.render();
            }, 300));
        },

        initFunction: function (collectionIdentifier, moduleNumber, womiId, dummyJson) {

            if (womiId === undefined) {
                this.space2dUsed = false;
                this.trigger('tilesSetSpace2d', false);
                return;
            }
            this.womiPath = '/content/womi/' + womiId + '/';

            this.space2dUsed = true;
            this.trigger('tilesSetSpace2d', true);
            this.trigger('tilesPositionElements');

            this.currentModuleInCollection = moduleNumber;
            this.currentCollection = collectionIdentifier;

            $('body').css('overflow', 'hidden');
            this.canvas = $('<canvas id="canvas"></canvas>');
            $('.reader-content').parent().append(this.canvas);
            this.canvas.css({'position': 'absolute', 'z-index': '-10', 'display': 'block', 'left': '0px', 'top': this.topbarHeight });

            this.context = this.canvas[0].getContext('2d');

            this.loadMetadata();
        },

        loadMetadata: function () {

            var _this = this;
            Logger.log('downloading ' + (this.womiPath + this.womiConfigFile), this.name);
            require(['json!' + (this.womiPath + this.womiConfigFile)], function (data) {

                _this.panorama = new Panorama({
                    womiPath: _this.womiPath,
                    context: _this.context,
                    canvas: _this.canvas,
                    tileScheme: data['stripesNamingScheme'],
                    tileExtension: data['stripesExtension'],
                    spaceWidth: Number(data['screenWidth']),
                    spaceHeight: Number(data['screenHeight']),
                    stripesCount: Number(data['stripesCount'])
                });


                _this.viewWidth = _this.panorama.spaceWidth;
                _this.viewHeight = _this.panorama.spaceHeight;
                _this.trigger('backgroundParams', {
                    viewWidth: _this.panorama.spaceWidth,
                    viewHeight: _this.panorama.spaceHeight
                });
                $.each(data['corners'], function (index, d) {
                    _this.panorama.addPanoramaElement(d);
                });
                _this.resizeFunc();
                _this.afterMetadataLoaded();
            });

            require(['json!' + (this.womiPath + this.womiMetadata)], function (data) {
                if(data && data.alternativeText){
                    _this.canvas.text(data.alternativeText);
                }
            });
        },

        afterMetadataLoaded: function () {
            this.render();
        },

        render: function () {
            this.panorama.showElement(this.currentModuleInCollection, function () {
            });

        },

        moveTo: function (collection, module, beginHandler, endHandler, womiId, dummyJson) {
            if (this.currentCollection != collection) { //we moved to another module, which may have its own image space

                beginHandler();
                $('#canvas').remove();
                this.currentCollection = collection;
                endHandler();
                this.initFunction(collection, module, womiId, dummyJson);
                return;
            } else if (!this.space2dUsed) {
                endHandler();
                return;
            }

            beginHandler();
            this.panorama.animate(this.currentModuleInCollection, module, function () {
                endHandler();
            });
            this.currentModuleInCollection = module;

        }


    });
});
