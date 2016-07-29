define(['jquery',
    'backbone',
    'modules/core/WomiManager',
    'layout',
    '../../Component',
    'underscore',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    'text!../templates/TapTile.html'], function ($, Backbone, womi, layout, Component, _, Logger, Utils, TapTitle) {

    'use strict';

    var activeClass = Utils.activeClass;


    function adjustHeights(elem, maxH) {
        var iters = 0;

        function _adjustHeights(elem, maxH) {
            if ($(elem).length == 0) {
                return
            }
            if (iters++ > 100) {
                return
            }
            var fontstep = 1;
            //console.log($(elem).outerHeight(), $(elem).parent().height(), $(elem).outerWidth(), $(elem).parent().width());
            if (($(elem).height()) > $(elem).parent().height() || $(elem).height() > maxH || $(elem).width() > $(elem).parent().width()) {
                $(elem).css('font-size', (($(elem).css('font-size').substr(0, 2) - fontstep)) + 'px').css('line-height', (($(elem).css('font-size').substr(0, 2))) + 'px');
                _adjustHeights(elem, maxH);
            }
        }

        _adjustHeights(elem, maxH);
    }

    var TileTap = Backbone.View.extend({
        LEFT_PADDING: 0.2,
        RIGHT_PADDING: 0.2,
        TOP_PADDING: 0.2,
        BOTTOM_PADDING: 0.2,
        DELAY: 3500,
        SKIN_TYPES: {
            title: 'tytul',
            titleIcon: 'tytul_ikona',
            titleLead: 'tytul_lead',
            titleGallery: 'tytul_galeria'
        },

        SKIN_MAPPINGS: [
            {
                regex: 'tresc',
                iconClass: 'slide-content',
                tileColor: 'skin-content'
            },
            {
                regex: 'slownik',
                iconClass: 'slide-dict',
                tileColor: 'skin-dict'
            },
            {
                regex: 'cwiczenia',
                iconClass: 'slide-exercise',
                tileColor: 'skin-exercise'
            },
            {
                regex: 'wstep',
                iconClass: 'slide-intro',
                tileColor: 'skin-intro'
            },
            {
                regex: 'podsumowanie',
                iconClass: 'slide-summary',
                tileColor: 'skin-summary'
            },
            {
                regex: 'womi',
                iconClass: 'womi',
                tileColor: '#80C7A5'
            }
        ],


        initialize: function (options) {
            this.tapCallback = options.callback;

            this.role = this.$el.data('skin-role');
            this.skinType = this.$el.data('skin-type');
            this.slideshow = null;
            this._titleLookup();
            var hasRole = this._roleIcon();
            this.resolvedRole = hasRole;
            if (hasRole && this.skinType == this.SKIN_TYPES.titleGallery) {
                this._imagesLookup();
            } else if (!hasRole) {
                this.stopRender = true;
            }

            if (!this.stopRender) {
                this.tapTile = this.$el.find('.tap-tile');
                if (this.tapTile.length == 0) {
                    this.tapTile = $('<div>', {'class': 'tap-tile'});
                    this.$el.prepend(this.tapTile);
                }
                this.tapTile.css({width: this.$el.outerWidth(), height: this.$el.outerHeight()});
            }

        },

        isActive: function () {
            return !this.stopRender;
        },

        _imagesLookup: function () {
            var _this = this;
            this.$el.find('.classic > .image-container').each(function () {
                _this.slideshow = _this.slideshow || [];
                var src = $(this).data('src');
                var res = [];
                $(this).find('[data-resolution]').each(function () {
                    res.push($(this).data('resolution'));
                });
                if (res.length > 0) {
                    var splitExt = src.split('.');
                    src = splitExt[0] + '-' + _.min(res) + '.' + splitExt[1];
                }
                _this.slideshow.push({
                    url: src
                });

            });

        },

        _roleIcon: function () {
            var _this = this;
            if (this.role) {
                var fit = null;

                _.each(this.SKIN_MAPPINGS, function (mapping) {
                    if (_this.role.toLowerCase().indexOf(mapping.regex) >= 0) {
                        fit = mapping;
                    }
                });
                if (fit && this.skinType == this.SKIN_TYPES.titleIcon) {
                    this.slideshow = [];
                    this.slideshow.push({
                        iconClass: fit.iconClass
                    });
                }
            }
            return fit;
        },

        _titleLookup: function () {
            this.title = this.$el.find('.section-header > .title').first().text();
        },
        click: function () {
            this.tapTile && this.tapTile.click();
        },

        render: function () {
            if (this.stopRender) {
                return;
            }
            this.tapTile.off('click');
            var _this = this;
            if (this.skinType == this.SKIN_TYPES.titleLead) {
                this.lead = this.$el.find('.section-contents > .lead').first().text();


            }
            this.tapTile.html(_.template(TapTitle, {title: this.title,
                slideshow: this.slideshow,
                skinType: this.skinType,
                lead: this.lead,
                TYPES: this.SKIN_TYPES}));
            this.tapTile.find('.tile-flippy').addClass(this.resolvedRole.tileColor);

            var w = this.tapTile.width(), h = this.tapTile.height();

            var newW = w - (w * this.LEFT_PADDING + w * this.RIGHT_PADDING);
            var newH = h - (h * this.TOP_PADDING + h * this.BOTTOM_PADDING);
            var a = Math.min(newH, newW);

            if (this.skinType == this.SKIN_TYPES.titleGallery || this.skinType == this.SKIN_TYPES.titleIcon) {
                this._initSlideshow(a, w, h);
            }

            this.tapTile.on('click', function () {
                var flippy = $(this).find('.tile-flippy');
                var animationEnd = function () {
                    _this.remove();
                    _this.tapCallback();
                };
                flippy.one('transitionend', animationEnd);
                flippy.one('webkitTransitionEnd', animationEnd);
                flippy.one('MSTransitionEnd', animationEnd);
                flippy.toggleClass('flip');
            });
            setTimeout(function () {
                var title = _this.tapTile.find('.tap-title');
                title.fitText(/*1, {minFontSize: 8, maxFontSize: 26}*/);
                adjustHeights(_this.tapTile.find('.tap-lead'), _this.tapTile.height() - title.outerHeight());
            }, 200);
        },

        _initSlideshow: function (a, w, h) {
            var _this = this;
            this.tapTile.find('.tile-slideshow').css({
                left: (w - a) / 2,
                top: (h - a) / 2,
                width: a,
                height: a
            });
            function resetPos(a) {
                var i = 0;
                _this.tapTile.find('.tile-slideshow-slide').each(function () {
                    $(this).data('idx', i);
                    $(this).css({
                        top: 0,
                        left: (i++) * a,
                        width: a,
                        height: a
                    });
                });
            }

            resetPos(a);

            if (this.slideshow && this.slideshow.length > 1) {
                this.anim && this.anim.stop();
                this.anim = {
                    max: this.slideshow.length,
                    current: 0,
                    start: function () {
                        var self = this;
                        this._start = setInterval(function () {
                            var ss = _this.tapTile.find('.scroll-slideshow');
                            if (self.current == self.max) {
                                ss.animate({left: 0}, 800);
                                self.current = 0;
                            } else {

                                ss.animate({left: -self.current * a}, 800);
                                self.current++;
                            }
                        }, _this.DELAY)
                    },
                    stop: function () {
                        clearInterval(this._start);
                    }
                };
                this.anim.start();
            }
        },

        remove: function () {
            this.tapTile && this.tapTile.remove();
            this.anim && this.anim.stop();
        }
    });

    function newTiles(_this, opts) {
        var containerHeightPercent = 1;//0.8;
        var blocked = false;
        var debounceTimeout = 250;
        var setBackground = false;
        var setOverflow = false;
        var pixelsBetweenTiles = opts.pixelsBetweenTiles;
        var __this = _this;

        var topbarHeight = 42, bottombarHeight = 42;

        //var mainDivSelector = $('#module-content').find('[data-grid-width]');
        //var womi = loader.getModule('reader.womi');
        //just global variables
        var gridWidth;
        var gridHeight;
        var debounceHandler;
        var windowHeight = 0;

        var viewWidth = 160, viewHeight = 90;
        var maxxx = 10000;

        var space2d = false;

        var start = true;

        var calculateTiles = (function () {
            if (debounceHandler) {
                __this.off('resize', debounceHandler);
            }
            var main = $('#module-content').find('[data-grid-width]');
            if (main.length == 0 || main.attr('data-template') != 'tiled') {

                return;
            }

            gridWidth = main.attr('data-grid-width');
            gridHeight = main.attr('data-grid-height');
            blocked = main.attr('data-fixed-tile-layout') == 'true';

            //check if both values are set and integers
            if (!(gridWidth % 1 === 0 && gridHeight % 1 === 0)) {
                console.log('values not set or incorrect');
                return;
            }
            //console.log('tiled');
            //position absolute and color
            $(main).find(" > [data-tile=\"tile\"]").each(function () {
                if (setBackground) {
                    var color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
                    $(this).css('background-color', color);
                }
                if (setOverflow) {
                    $(this).css({'overflow': 'auto'});
                } else {
                    $(this).css({'overflow': 'hidden'});
                }
                validateCell($(this));
                $(this).addClass('tile');
                //$(this).append('<div class="gradient"></div>');
                //$(this).find('.gradient').css({'position': 'absolute', 'height': '15px', 'width': '100%', bottom: '0'});
            });

            main.append('<div id="tiles-main"></div>');
            main.children('div').appendTo('#tiles-main');

            positionElements();
            debounceHandler = _.debounce(function(){
                positionElements();
                womi.resizeAll();
            }, debounceTimeout);
            __this.on('resize', debounceHandler);


        });

        //type: top, left, width, height
        function recalculateMargin(val, cellSize, data, type){
            var t = $(data).data('margin-top') || 0;
            var l = $(data).data('margin-left') || 0;
            var r = $(data).data('margin-right') || 0;
            var b = $(data).data('margin-bottom') || 0;
            switch(type){
                case 'top':
                    return val + (t / 100) * cellSize;
                case 'left':
                    return val + (l / 100) * cellSize;
                case 'width':
                    return val - (l / 100 + r / 100) * cellSize;
                case 'height':
                    return val - (t / 100 + b / 100) * cellSize;
                default:
                    return val;
            }
        }

        function positionElements(callb) {
            if (layout.fullScreenMode()) {
                topbarHeight = 0;
                bottombarHeight = 0;
            } else {
                topbarHeight = 42;
                bottombarHeight = 42;
            }

            var main = $('#module-content').find('[data-grid-width]').find('#tiles-main');


            var spacesSumH = pixelsBetweenTiles * (gridHeight - 1);
            var spacesSumW = pixelsBetweenTiles * (gridWidth - 1);

            var height = $(window).height() * containerHeightPercent;


            var cellSize = (height - spacesSumH) / gridHeight;
            //do we need to break layout to linear
            var willFit = layout.fullScreenMode();//($(window).width() > (cellSize * gridWidth + spacesSumW) || blocked);//
            //console.log('height ' + $(window).height() + ' ' + $(window).width() + ' '  + (cellSize * gridWidth));
            if (space2d) {
                var aspect = 1.0 / Math.max((viewHeight / (window.innerHeight - topbarHeight)),
                    (viewWidth / window.innerWidth));
                var width = viewWidth * aspect;
                height = viewHeight * aspect;
                cellSize = (height - spacesSumH) / gridHeight;
                windowHeight = height;//$(window).height();
                var spaceLeftPlus = 0, spaceTopPlus = 0;
                if (Math.round(width) != Math.round(window.innerWidth)) {
                    spaceLeftPlus = (window.innerWidth - width) / 2;
                } else {
                    spaceTopPlus = ((window.innerHeight - topbarHeight) - height) / 2;
                }

                var spaceLeft = (width - (cellSize * gridWidth + spacesSumW)) / 2;
                //console.log(spaceLeft, spaceLeftPlus);
                spaceLeft += spaceLeftPlus;

                var spaceTop = ((windowHeight /*- topbarHeight*/) - (cellSize * gridHeight + spacesSumH)) / 2;
                //console.log(spaceTop, spaceTopPlus);
                spaceTop += spaceTopPlus;
                main.css({'position': 'absolute', 'height': height + 'px', 'width': (cellSize * gridWidth + spacesSumW) + 'px', 'top': spaceTop + topbarHeight + 'px', 'left': spaceLeft + 'px'});
                main.children().each(function (index, data) {

                    var xToSet = ((Number($(data).attr('data-left')) - 1) * cellSize) + ((Number($(data).attr('data-left')) - 1) * pixelsBetweenTiles);// + 'px';
                    var yToSet = ((Number($(data).attr('data-top')) - 1) * cellSize) + ((Number($(data).attr('data-top')) - 1) * pixelsBetweenTiles);// + 'px';
                    var widthToSet = (Number($(data).attr('data-width')) * cellSize) + (Number($(data).attr('data-width') - 1) * pixelsBetweenTiles);// + 'px';
                    var heightToSet = (Number($(data).attr('data-height')) * cellSize) + (Number($(data).attr('data-height') - 1) * pixelsBetweenTiles );// + 'px';
                    //$(data).css({'position': 'absolute', 'left': xToSet, 'top': yToSet, 'width': widthToSet, 'height': heightToSet});
                    $(data).css({
                        'position': 'absolute',
                        'left': recalculateMargin(xToSet, cellSize, data, 'left') + 'px',
                        'top': recalculateMargin(yToSet, cellSize, data, 'top') + 'px',
                        'width': recalculateMargin(widthToSet, cellSize, data, 'width') + 'px',
                        'height': recalculateMargin(heightToSet, cellSize, data, 'height') + 'px'
                    });
                });
            } else if (willFit) {
                if (_.isFunction(callb)) {
                    callb();
                }
                if (start) {
                    __this.trigger('hideTOC');
                    start = false;
                }
                var aspect = gridHeight / gridWidth;
                var scale = Math.min($(window).width() / maxxx,  $(window).height() / (maxxx * aspect));
                height = (maxxx * aspect) * scale;
                if (!layout.fullScreenMode()) {
                    height = height - bottombarHeight;
                }
                cellSize = (height - topbarHeight - spacesSumH) / gridHeight;
                main.css({'position': 'absolute', 'height': (height - topbarHeight) + 'px',
                    'width': (cellSize * gridWidth + spacesSumW) + 'px',
                    'padding': '0px', top: topbarHeight + 'px',
                    'left': ((window.innerWidth - (cellSize * gridWidth + spacesSumW)) / 2) + 'px'});

                main.children().each(function (index) {
                    var xToSet = ((Number($(this).attr('data-left')) - 1) * cellSize) + ((Number($(this).attr('data-left')) - 1) * pixelsBetweenTiles) + 'px';
                    var yToSet = ((Number($(this).attr('data-top')) - 1) * cellSize) + ((Number($(this).attr('data-top')) - 1) * pixelsBetweenTiles) + 'px';
                    var widthToSet = (Number($(this).attr('data-width')) * cellSize) + (Number($(this).attr('data-width') - 1) * pixelsBetweenTiles) + 'px';
                    var heightToSet = (Number($(this).attr('data-height')) * cellSize) + (Number($(this).attr('data-height') - 1) * pixelsBetweenTiles ) + 'px';
                    $(this).css({'position': 'absolute', 'left': xToSet, 'top': yToSet, 'width': widthToSet, 'height': heightToSet, 'word-wrap': 'break-word'});
                    if ($(this).data('taptile')) {
                        $(this).data('taptile').remove();
                    }
                    var tt = new TileTap({el: this, callback: function () {
                        expandClicked(index);
                        $('body').css('overflow', '');
                    }});
                    $(this).data('taptile', tt);
                    tt.render();

                });
                $('body').css('overflow', 'hidden');
                $(document).scrollTop(0);
                //$(main).find('.gradient').css('display', '');
            } else if (main.css('position') != 'static') { //do not change the styles with each resize
                main.css({'position': 'static', 'width': '', 'height': '', 'word-wrap': ''});
                main.children().each(function () {
                    $(this).css({'position': 'static', 'left': '', 'top': '', 'width': '', 'height': ''});
                    $(this).data('taptile').remove();
                });
                $(main).find(".expand").remove();
                //$(main).find('.gradient').css('display', 'none');
            }
            //TODO checking if expand is necessary
            if (willFit && !space2d) {
                main.children().each(function (index) {
                    if ($(this).data('taptile').isActive()) {
                        return;
                    }
                    var requestedHeight = parseInt($(this).css('height'));
                    var sum = 0;
                    var hasButton = $(this).find(".expand").size() == 1;
                    $(this).children().each(function () {
                        sum += $(this).outerHeight(true);
                    });
                    if (sum > requestedHeight) {
                        if (!hasButton) {
                            $(this).append('<button class="expand"></button>');
                            $(this).find('.expand').click(function (event) {
                                expandClicked(index);
                            });
                        }
                    } else if (hasButton) {
                        $(this).find(".expand").remove();
                    }
                });
                if (window.location.hash != '#') {
                    main.children().each(function (index) {
                        if ($(this).data('taptile')) {
                            var hash = window.location.hash;
                            if ($(this).find(hash).length > 0 || $(this).attr('id') == hash.replace('#', '')) {
                                console.log($(this).data('taptile'));
                                $(this).data('taptile').click();
//                                setTimeout(function(){
//                                    var scroll = $(window).scrollTop();
//                                    console.log(scroll);
//                                    window.location.hash = '';
//                                    window.scrollTo(0, scroll  - 50);
//                                }, 300);

                                return false;
                            }
                        }
                    });
                }
            }
        }

        function validateCell(cell) {
            var x = Number(cell.attr('data-left'));
            var y = Number(cell.attr('data-top'));
            var width = Number(cell.attr('data-width'));
            var height = Number(cell.attr('data-height'));
            //check if values are set and integers
            if (!(x % 1 === 0 && y % 1 === 0 && width % 1 === 0 && height % 1 === 0)) {
                console.log('values not set or not integers');
                return;
            }
            if (x < 1 && x > gridWidth && y < 1 && y > gridHeight) {
                console.log('left or top not correct');
                return;
            }
            //check if each rectangle fits in container
            if (((width + x - 1) > gridWidth) || ((height + y - 1) > gridHeight)) {
                console.log('cell width or height not correct');
                return;
            }
        }

        function expandClicked(index) {
            var main = $('#module-content').find('[data-grid-width]').find('#tiles-main');
            main.css({'position': 'static', 'width': '', 'height': ''});
            main.children().each(function (i) {
                if (i != index) {
                    $(this).css('display', 'none');
                } else {
                    $(this).css({'position': 'static', 'left': '', 'top': '', 'width': '', 'height': ''});
                }
            });
            /*var expandedDiv = main.children()[index];
            $(expandedDiv).find('.expand').remove();
            $(expandedDiv).append('<button class="collapse"></button>');
            $(expandedDiv).find('.collapse').click(function (event) {
                collapseClicked(index);
            });*/

            var topbarToolsUL = $('.topbar-tools');
            topbarToolsUL.eq(0).prepend('<button class="collapse collapse-tiles"></button>');
            topbarToolsUL.find('.collapse').click(function (event) {
                collapseClicked(index);
            });


            __this.off('resize', debounceHandler);
            //$(main).find('.gradient').css('display', 'none');
            //$(document).keydown(function (e) {
            //    if (e.keyCode === 8) {
            //        collapseClicked(index);
            //        return false;
            //    }
            //    return true;
            //});b

            var nextBtn = $('.navigation-right').find('button');
            var prevBtn = $('.navigation-left').find('button');

            if (layout.fullScreenMode()) {

                this.modules = $('#index-menu').find('.module-a');
                var _this = this;
                this.modules.each(function (index, element) {
                    if ($(element).hasClass(activeClass)) {
                        var current = index;
                        var size = _this.modules.length;
                        if (index + 1 >= size || size <= 1) {
                            nextBtn.hide();
                        } else {
                            nextBtn.show();
                        }
                        if (current - 1 < 0 || size <= 1) {
                            prevBtn.hide();
                        } else {
                            prevBtn.show();
                        }
                    }
                });
            } else {
                nextBtn.find('button').hide();
                prevBtn.find('button').hide();
            }

            womi.resizeAll();
        }

        function collapseClicked(index) {
            var main = $('#module-content').find('[data-grid-width]').find('#tiles-main');
            var topbarToolsUL = $('.topbar-tools');
            topbarToolsUL.find('.collapse-tiles').remove();
            //var expandedDiv = main.children()[index];
            main.css({'position': 'relative'});
            //$(expandedDiv).find('.collapse').remove();
            main.children().each(function () {
                $(this).css('display', '');
            });
            if (window.location.hash != '') {
                window.location.hash = '';
            }
            positionElements();
            __this.on('resize', debounceHandler);
            //turn off backspace event
            $(window).off('keydown');
            womi.resizeAll();
        }
        function getWindowHeight() {
            return windowHeight;
        }

        function setSpace2d(value) {
            space2d = value;
        }

        function setParams(params) {
            viewWidth = params.viewWidth;
            viewHeight = params.viewHeight;
        }

        return {
            calculateTiles: calculateTiles,
            pixelsBetweenTiles: pixelsBetweenTiles,
            containerHeightPercent: containerHeightPercent,
            topbarHeight: topbarHeight,
            getWindowHeight: getWindowHeight,
            setSpace2d: setSpace2d,
            positionElements: positionElements,
            setParams: setParams
        };

    }

    $(document).ready(function(){
        $('#module-content div[data-template="tiled"] .bibliography').hide(); // this is called also in non-tiled environments

        if($('.collapse-tiles').length > 0){
            $('.collapse-tiles').remove();
        }
    });


    return Component.extend({
        name: 'Tiles',
        elementSelector: '[data-grid-width]',
        opts: { pixelsBetweenTiles: 8 },
        postInitialize: function (options) {
            this.newTiles = newTiles(this, this.opts);
            var _this = this;
            this.listenTo(this._layout, 'moduleWomiLoaded', function () {
//                _this.newTiles.positionElements(function () {
//                    womi.resizeAll();
//                });
            });
            this.listenTo(this._layout, 'windowResize', function () {
                _this.trigger('resize');
            });

            this.listenTo(this._layout, 'moduleSpawned', function () {
                _this.newTiles.calculateTiles();
            });
            this.listenTo(this._layout, 'tilesSetSpace2d', function (val) {
                _this.newTiles.setSpace2d(val);
            });
            this.listenTo(this._layout, 'tilesPositionElements', function () {
                _this.newTiles.positionElements();
            });

            this.listenTo(this._layout, 'backgroundParams', function (params) {
                _this.newTiles.setParams(params);
                _this.newTiles.positionElements();
            });

        },
        compat: function () {
            return this.newTiles;
        }
    });
});
