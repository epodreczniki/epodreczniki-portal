define(['jquery',
    'modules/core/womi/WOMIContainerBase',
    'modules/core/Registry',
    'layout',
    'underscore',
    'modules/core/HookManager'
], function ($, WOMIContainerBase, Registry, layout, _, HookManager) {

    "use strict";
    function isIn(val, setArr) {
        return _.indexOf(setArr, val) > -1;
    }

    function wcagLabel(label) {
        return '<span class="wcag-hidden-inside">' + label + '</span>';
    }

    var commonBase = require('common_base');
    var deviceDetection = require('device_detection');
    //var handleSvg = require('svg_fallback');

    var classForName = commonBase.stringToFunction;

    var isTouch = true;//document.createTouch !== undefined;

    var readerDefinition = $('#reader-definition');

    readerDefinition = {
        stylesheet: readerDefinition.data('stylesheet'),
        env: readerDefinition.data('environment-type')
    };

    var womi = Registry.get('womi');
    return WOMIContainerBase.extend({

        THUMBNAIL_WIDTH: 350,
        maxHeight: 0.7,
        maxHeightStage: 0.85,
        maxHeightThumbs: 0.15,
        maxHeightOnlyThumbs: 0.6,
        thumbsReturn: false,
        useThumbsRescaling: true,
        initialize: function (options) {
            this.init(this.$el);
        },
        wcagLabel: function (label) {
            return wcagLabel(label);
        },

        setNavigationHover: function (pikaStage) {
            pikaStage.find('a.next').hover(
                function () {
                    pikaStage.find('a.next').css('opacity', '0.8');
                    pikaStage.find('a.next').find('button').css('opacity', '0.8');
                    pikaStage.find('a.previous').css('opacity', '0');
                    pikaStage.find('a.previous').find('button').css('opacity', '0');
                },
                function () {
                    pikaStage.find('a.next').css('opacity', '0');
                    pikaStage.find('a.next').find('button').css('opacity', '0');
                }
            );
            pikaStage.find('a.previous').hover(
                function () {
                    pikaStage.find('a.previous').css('opacity', '0.8');
                    pikaStage.find('a.previous').find('button').css('opacity', '0.8');
                    pikaStage.find('a.next').find('button').css('opacity', '0');
                    pikaStage.find('a.next').css('opacity', '0');
                },
                function () {
                    pikaStage.find('a.previous').find('button').css('opacity', '0');
                    pikaStage.find('a.previous').css('opacity', '0');
                }
            );
        },
        setNavigationFocus: function (pikaStage) {
            pikaStage.find('button.pika-stage-next').focus(function () {
                    pikaStage.find('a.next').css('opacity', '0.8');
                    pikaStage.find('a.next').find('button').css('opacity', '0.8');
                }
            );
            pikaStage.find('button.pika-stage-next').blur(function() {
                pikaStage.find('a.next').css('opacity', '0');
                pikaStage.find('a.next').find('button').css('opacity', '0');
            });

            pikaStage.find('button.pika-stage-prev').focus(function () {
                    pikaStage.find('a.previous').css('opacity', '0.8');
                    pikaStage.find('a.previous').find('button').css('opacity', '0.8');
                }
            );
            pikaStage.find('button.pika-stage-prev').blur(function() {
                pikaStage.find('a.previous').css('opacity', '0');
                pikaStage.find('a.previous').find('button').css('opacity', '0');
            });
        },
        showNavigation: function (pikaStage) {
            pikaStage.css({
                position: 'relative'
            });
            pikaStage.find('a.next').css({'right': 0});
            pikaStage.find('a.previous').css({'left': 0});
            pikaStage.find('a.next').append('<button>' + wcagLabel('następny slajd galerii') + '</button>');
            pikaStage.find('a.previous').append('<button>' + wcagLabel('poprzedni slajd galerii') + '</button>');
            pikaStage.find('a.next').find('button').addClass('pika-stage-next').css('right', 0);
            pikaStage.find('a.previous').find('button').addClass('pika-stage-prev');
            var fullScreenElement = pikaStage.find('.fullscreen-icon-container').css({
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }).hover(
                function () {
                    fullScreenElement.css('opacity', '0.8');
                },
                function () {
                    fullScreenElement.css('opacity', '0');
                }
            );
            fullScreenElement.find('button').focus(function() {
                fullScreenElement.css('opacity', '0.8');
            }).blur(function() {
                fullScreenElement.css('opacity', '0');
            });
            this.setNavigationHover(pikaStage);
            this.setNavigationFocus(pikaStage);
        },
        updateNavigationHeight: function (pikaStage, height) {
            this.setNavigationHover(pikaStage);
        },
        init: function (element) {
            this.roles = {};
            this._mainContainerElement = $(element);
            this.menuItems = [];
            var _this = this;
            this._mainContainerElement[0].addEventListener('fullscreen', function () {
                _this._fullscreenMenuItem().callback();
            });

            this._mainContainerElement.data('womiObject', this);

            this.selected = {
                object: _this
            };

            this.on('openContext', function () {
                _this._fullscreenMenuItem().callback();
            });

            this._discoverContent();
            this._load();
            this._hideNavOnBorders();
        },
        _womiContainer: function () {
            return Registry.get('womiContainerGallery');
        },
        _discoverContent: function () {
            var _this = this;
            this._title = this._mainContainerElement.find('> .womi-gallery-header');
            this._womi = [];


            this._startOn = 0;

            this.galleryTypeB = false;

            if (this._mainContainerElement.data('view-width') || this._mainContainerElement.data('view-height')) {
                this.galleryTypeB = true;
                this.viewWidth = this._mainContainerElement.data('view-width');
                this.viewHeight = this._mainContainerElement.data('view-height');
            }

            this._miniaturesOnly = false;
            if (this._mainContainerElement.data('miniatures-only')) {
                this._miniaturesOnly = this._mainContainerElement.data('miniatures-only');
                this._formatContents = 'hide';
            }

            this._transparent = false;
            if (this._mainContainerElement.data('transparent')) {
                this._transparent = this._mainContainerElement.data('transparent');
            }

            this._titles = 'all';
            if (this._mainContainerElement.data('titles')) {
                this._titles = this._mainContainerElement.data('titles');
            }

            this._formatContents = this._formatContents || 'all';
            if (this._mainContainerElement.data('format-contents')) {
                this._formatContents = this._mainContainerElement.data('format-contents');
            }


            this._thumbnails = 'all';
            if (this._mainContainerElement.data('thumbnails')) {
                this._thumbnails = this._mainContainerElement.data('thumbnails');
            }

            this._playlist = 'none';
            if (this._mainContainerElement.data('playlist')) {
                this._playlist = this._mainContainerElement.data('playlist');
            }

            this.galleryParams = {
                titles: this._titles,
                contents: this._formatContents,
                miniaturesOnly: this._miniaturesOnly,
                thumbnails: this._thumbnails,
                transparent: this._transparent
            };


            this._mainContainerElement.find('.womi-container').each(function (i, element) {
                if (!$(element).parent().hasClass('related')) {
                    var o;
                    var WOMIContainer = _this._womiContainer();
                    if ($(element).data('womiObject')) {
                        o = $(element).data('womiObject');
                        _.extend(o, WOMIContainer.prototype);
                    } else {
                        o = new WOMIContainer({el: element});

                    }
                    o.galleryParams = _this.galleryParams;
                    o.render();
                    _this._womi.push(o);
                    o.hide();
                }
            });

            if (this._womi.length == 1) {
                this.single = true;
            }

            if (this._mainContainerElement.data('start-on')) {
                // atrybut jest indeksowany od 1
                var newStartOn = this._mainContainerElement.data('start-on') - 1;
                if ((newStartOn > 0) && (newStartOn < this._womi.length)) {
                    this._startOn = newStartOn;
                }
            }

            this._createMenu();
        },

        _load: function () {
            var gallery = $('<div>', {'class': 'gallery-container'});
            this.gallery = gallery;

            this.womiGalleryContents = this._mainContainerElement.find('.womi-gallery-contents');

            if (this._womi.length === 0) {
                return;
            }

            this._mainContainerElement.append(this.gallery);
            if (this.galleryTypeB) {
                this.renderA();
                gallery.hide();
                gallery = $('<div>', {'class': 'gallery-container-b'});
                this.gallery.after(gallery);
                this.galleryB = gallery;
                this._typeB();
            } else if (this._miniaturesOnly) {
                this.renderA();
                gallery.hide();
                gallery = $('<div>', {'class': 'gallery-container-c'});
                this.gallery.after(gallery);
                this.galleryC = gallery;
                this._displayMiniatures();
            } else {
                //this._displayFullGallery();
                this.renderA();
                this._showMenu(this.gallery);
                if (this.galleryParams.transparent) {
                    this.makeTransparent();
                }

            }

            if (this._playlist == 'autoplay') {
                this.loadPlaylist();
            }

            //this._hideWomi();
        },
        hideWomis: function () {

        },

        loadPlaylist: function () {
            _.each(this._womi, _.bind(function (w) {
                this.listenTo(w.selected.object, 'ended', function () {
                    this.trigger('playEnded');
                });
            }, this));

            this.on('womiChanged', function (womi) {
                setTimeout(_.bind(function () {
                    womi.selected.object.trigger('play');
                }, this), 300);
            });

            this.on('playEnded', function () {
                this.trigger('goTo', this.idx + 1);
            });
        },

        makeTransparent: function () {
            this._mainContainerElement.css('visibility', 'hidden');
            var pack = $('<div class="gallery-invisible">');
            this._mainContainerElement.before(pack);
            pack.append(this._mainContainerElement);
            pack.click(_.bind(function () {
                this.fullscr();
            }, this));
        },

        miniatureTemplate: '<li><div class="clip"><img src="<%= imgSrc %>" title="<%= title %>" alt="<%= alt %>"></div></li>',

        _determineOverlay: function () {
            if (this._womi[this.idx].selected.object.hasFunctionality()) {
                this.stage.find('[data-role="gallery-nav"]').hide();
                if (this.maximized) {
                    this.alternativeNav.hide();
                } else {
                    this.alternativeNav.show();
                }
            } else {
                this.stage.find('[data-role="gallery-nav"]').show();
                this.alternativeNav.hide();
            }
            if (this.maximized) {
                this.stage.find('.fullscreen-icon-container').hide();
            }
        },
        prevOrNextRecalc: function (stage, idx, i) {
            stage.height(500);//temporary handle some height
            this._womi[idx].hide();
            this.idx += i;
            var h = this._stageHeight();
            this.trigger('scrollToMiniature', {curIdx: this.idx, prevIdx: idx});
            this._womi[this.idx].show();
            this._determineOverlay();
            this._womi[this.idx].trigger('changeSize', {height: h});
            stage.css('height', '');//remove temporary height
            this.setTitleAndContent(this._womi[this.idx]);
        },
        renderA: function () {
            var currWomi = this._womi[this._startOn];
            currWomi.show();

            this._handleFormatContents();
            var next = $('<a>', {'class': 'next', 'data-role': 'gallery-nav'});
            var prev = $('<a>', {'class': 'previous', 'data-role': 'gallery-nav'});
            var fullScreenElement = $('<a>', {'class': 'fullscreen-icon-container', 'data-role': 'gallery-nav'});
            var fullScreenImg = $('<button>', {'class': 'pika-stage-fullscreen'});
            fullScreenImg.append(wcagLabel('włącz galerię na pełny ekran'));
            fullScreenElement.append(fullScreenImg);
            var stage = $('<div>', {'class': 'pika-stage'});
            this.titlePlaceholder = $('<span>', {'class': 'title womi-title'});

            this.gallery.append(stage);
            this.gallery.append(this.titlePlaceholder);
            this.stage = stage;
            stage.append(this.womiGalleryContents.find('ol'));
            stage.find('ol').css({margin: 'auto'});
            stage.append(prev);
            stage.append(next);
            stage.append(fullScreenElement);

            var galleryContents = this._mainContainerElement.find('> .womi-gallery-contents');
            if (galleryContents.length && galleryContents.children().length) {
                if (this._title.length) {
                    galleryContents.addClass('has-gallery-header');
                    this._title.addClass('has-gallery-contents');
                }
            }

            var alternativeNav = $('<div>', {'class': 'alternative-nav'});
            this.alternativeNav = alternativeNav;
            stage.append(alternativeNav);
            alternativeNav.append(this._altNavMenu());
            this.showNavigation(stage);

            this.updateNavigationHeight(stage, currWomi.$el.height());
            this.setNavigationHover(stage);

            this.idx = this._startOn;
            var _this = this;

            function prevOrNext(i) {
                var idx = _this.idx;
                if (_this.thumbsReturn && (idx + i < 0 || idx + i >= _this._womi.length)) {
                    i = (-i * (_this._womi.length - 1));
                }
                if ((i > 0 && _this._womi.length > (idx + i)) || (i < 0 && (idx + i) >= 0)) {
                    _this.prevOrNextRecalc(stage, idx, i);
                    _this.trigger('womiChanged', _this._womi[_this.idx]);
                }
                var top = $('.fullscreen-gallery-top');
                if (top.length > 0) {
                    var topToggle = top.find('.top-toggle');
                    var tc = _this._womi[_this.idx].getTitleAndContent();
                    if (tc.content === undefined) {
                        topToggle.hide();
                        if ((i > 0 && _this._womi.length > (idx + i)) || (i < 0 && (idx + i) >= 0)) {
                            topToggle.toggleClass('more-selected');
                            top.toggleClass('clear-top-height');
                        }
                    } else {
                        topToggle.show();
                    }
                }
               _this._hideNavOnBorders();
            }

            next.click(function () {
                prevOrNext(1);
            });
            prev.click(function () {
                prevOrNext(-1);
            });
            this.on('goTo', function (idx) {
                prevOrNext(idx - _this.idx);
            });

            this.createThumbs(prevOrNext);

            //set title under all
//            this.gallery.append(this.titlePlaceholder);
//            this.gallery.append(this._title);

            _this.setTitleAndContent(_this._womi[_this.idx]);
            var h = this._stageHeight();
            this._womi[this.idx].trigger('changeSize', {height: h });
            this.trigger('scrollToMiniature', {curIdx: this.idx, prevIdx: this.idx});
            this._determineOverlay();

            fullScreenElement.click(function () {
                _this.fullscr();
            });

            this._rsHandlerA = this._rsHandlerA || _.debounce(_.bind(function () {
                var h = _this._stageHeight();
                this._womi[this.idx].trigger('changeSize', {height: h});
                this.trigger('rescaleThumbs');
            }, this), 100);
            this._rsHandler = this._rsHandlerA;
        },

        _stageHeight: function () {
            var handle = this._handleThumbs();
            if (this.useThumbsRescaling) {
                return handle ? this.containerHeight() * this.maxHeightStage : this.containerHeight();
            } else {
                return handle ? this.containerHeight() - 120 : this.containerHeight();
            }
        },

        setTitleAndContent: function (womi, titlePlaceholder, where, onlyContent) {

            var tc = womi.getTitleAndContent();
            //tc.content = "Lorem Ipsum jest tekstem stosowanym jako przykładowy wypełniacz w&nbsp;przemyśle&nbsp;poligraficznym. <br>Został po raz pierwszy użyty w XV w. przez nieznanego drukarza do wypełnienia tekstem próbnej książki. Pięć wieków później zaczął być używany przemyśle elektronicznym, pozostając praktycznie niezmienionym.";
            titlePlaceholder = titlePlaceholder || this.titlePlaceholder;
            titlePlaceholder.html('');
            where = where || ['all', 'hide-fullscreen'];
            if (isIn(this.galleryParams.titles, where) && tc.partTitle && !onlyContent) {
                titlePlaceholder.text(tc.partTitle);
            }
            if (isIn(this.galleryParams.contents, where) && tc.content) {
                if (titlePlaceholder.text() != '') {
                    titlePlaceholder.append('<br>');
                }
                titlePlaceholder.append(_.unescape(tc.content));
            }
        },

        _createFullscreenTop: function () {
            var top;
            var header;
            if (deviceDetection.isMobile) {
                var tpl = '<div class="fullscreen-gallery-top"><div class="top-toggle">' + wcagLabel('pokaż szczegóły') + '</div><button class="close-gallery">' + wcagLabel('zamknij tryb pełnoekranowy') + '</button><h2 class="womi-gallery-header" style="display: block;"><span class="label"></span><span class="title"></span></h2><span class="title womi-title"></span></div>';
                top = $(tpl);
                header = this._mainContainerElement.find('.womi-gallery-header');
            } else {
                var tpl = '<div class="fullscreen-gallery-top"><div class="hastip top-toggle" title="Więcej">' + wcagLabel('pokaż szczegóły') + '</div><button class="hastip close-gallery" title="Zamknij">' + wcagLabel('zamknij tryb pełnoekranowy') + '</button><h2 class="womi-gallery-header" style="display: block;"><span class="label"></span><span class="title"></span></h2><span class="title womi-title"></span></div>';
                top = $(tpl);
                header = this._mainContainerElement.find('.womi-gallery-header');
                top.find('.womi-gallery-header > .title').replaceWith(header.find('.title').clone());
            }
            top.find('.womi-gallery-header > .label').replaceWith(header.find('.label').clone());
            top.find('.numbering-prefix').remove();
            var topToggle = top.find('.top-toggle');
            var close = top.find('.close-gallery');

            if (deviceDetection.isMobile) {
                close.click(function () {
                    $.fancybox.close();
                });
            } else {
                $([topToggle, close]).tooltipsy({
                    alignTo: 'element',
                    offset: [-1, 1],
                    delay: 0
                });
                close.click(function () {
                    $.fancybox.close();
                    close.data('tooltipsy').destroy();
                });
            }
            this._fullscreenMiniatureHandler = _.bind(function () {
                this.setTitleAndContent(this._womi[this.idx], top.find('.womi-title'), ['all', 'hide-normal']);
                var tc = this._womi[this.idx].getTitleAndContent();
                if (tc.content === undefined) {
                    topToggle.hide();
                    topToggle.toggleClass('more-selected');
                    top.toggleClass('clear-top-height');
                }
            }, this);
            this._fullscreenMiniatureHandler();
            this.on('scrollToMiniature', this._fullscreenMiniatureHandler);
            function changeTopToogleTooltipsy(element, value) {
                element.data('tooltipsy').destroy();
                element.removeAttr('title');
                element.attr('title', value);
                element.tooltipsy({
                    alignTo: 'element',
                    offset: [1, 1],
                    delay: 0
                });
            }

            if (deviceDetection.isMobile) {
                topToggle.click(function () {
                    topToggle.toggleClass('more-selected');
                    top.toggleClass('clear-top-height');
                });
            } else {
                var topToggleClicked = false;
                topToggle.click(function () {
                    topToggle.toggleClass('more-selected');
                    top.toggleClass('clear-top-height');

                    topToggle.data('tooltipsy').hide();

                    if (!topToggleClicked) {
                        changeTopToogleTooltipsy(topToggle, 'Mniej');
                    } else {
                        changeTopToogleTooltipsy(topToggle, 'Więcej');
                    }
                    topToggleClicked = !topToggleClicked;
                });

            }

            return top;
        },

        fullscr: function () {

            var scroll = $(window).scrollTop();

            var fs = $('<div>', {'class': 'fullscreen-gallery'});
            var fsTop = this._createFullscreenTop();//$('<div>', {'class': 'fullscreen-gallery-top clear-top-height'});
            fs.append(fsTop);
            var stagePlace = $('<div>');
            this.stage.after(stagePlace);
            var thumbPlace = $('<div>');
            this.thumbsContainer.after(thumbPlace);
            this.thumbsContainer.css('width', '');
            fs.append(this.stage);

            this._fsMenu();
            fs.append(this.fsMenu);
            fs.append(this.thumbsContainer);
            var _this = this;
            _this.maximized = true;

            var bodyOverflow = $('body').css('overflow');

            var fsControl = this._fullscreenControl();
            this._determineOverlay();

            $.fancybox(fs, _.extend({
                autoSize: false,
                beforeLoad: function () {
                    this.height = '100%';
                    this.width = '100%';
                    $('.fancybox-skin').css('background', 'none');
                },
                beforeClose: function () {
                    _this.off('scrollToMiniature', _this._fullscreenMiniatureHandler);
                    _this.maximized = false;
                    _this._handleThumbs();
                    stagePlace.after(_this.stage);
                    stagePlace.remove();
                    thumbPlace.after(_this.thumbsContainer);
                    thumbPlace.remove();
                    fsControl();
                    _this._determineOverlay();
                    //$('body').css('overflow', bodyOverflow);
                    _this._rsHandler();
                },
                beforeShow: function () {
                    $('.fancybox-skin').css('background', 'none');
                    //$('body').css('overflow', 'hidden');
                },
                afterShow: function () {
                    $('.fancybox-skin').css('background', 'none');
                    _this._handleThumbs();
                    _this._rsHandlerA();
                    _this._hideNavOnBorders();
                },
                afterClose: function () {
                    window.setTimeout(function () {
                        $(window).scrollTop(scroll);
                    }, 500);
                    $('.thumbs-scroll-left').css('visibility', 'visible');
                    $('.thumbs-scroll-right').css('visibility', 'visible');

                    _this._hideNavOnBorders();

                }
            }, this.fancyBoxDefaults));
        },

        containerHeight: function () {

            if (this.maximized) {
                return ($(window).height() - 115 - (this._womi[this.idx].hasButtons() ? 35 : 0));// * this.maxHeightStage;
            }

            var percentW = parseFloat('100%');
            var tile = this._mainContainerElement.closest('.tile');
            var _maxHeight = this.maxHeight;
            if (this._mainContainerElement.width() < 410) {
                _maxHeight = 0.3;
            } else if (this._mainContainerElement.width() < 600) {
                _maxHeight = 0.4;
            } else if (this._mainContainerElement.width() < 850) {
                _maxHeight = 0.5;
            } else if (this._mainContainerElement.width() < 1150) {
                _maxHeight = 0.6;
            }

            var height = _maxHeight * $(window).height();

            if (readerDefinition.env == 'early-education' || readerDefinition.env == 'ee') {
                height = tile.height();
            }
            return height;
        },

        thumbsJump: 200,

        thumbsTitle: function(object){
            return object.options.title;
        },

        thumbsAlt: function(object){
            return object.options.alt || object.options.title;
        },

        _hideThumbsNav: function(thumbsContainer, pikaThumbs, scrollLeft, scrollRight){
            if(thumbsContainer.scrollLeft() == 0) {
                scrollLeft.css('visibility', 'hidden');
            }
            else {
                scrollLeft.css('visibility', 'visible');
            }
            if(thumbsContainer.scrollLeft() == pikaThumbs.width()-pikaThumbs.parent().width()) {
                scrollRight.css('visibility', 'hidden');
            }
            else {
                scrollRight.css('visibility', 'visible');
            }
        },

        createThumbs: function (prevOrNext) {
            var _this = this;
            var pikaThumbs = $('<ul>', {'class': 'jcarousel-skin-pika pika-thumbs'});
            var thumbsScrollWrap = $('<div>', {'class': 'thumbs-scroll-wrap'});
            var scrollLeft = $('<div>', {'class': 'thumbs-scroll-left'});
            var scrollRight = $('<div>', {'class': 'thumbs-scroll-right'});
            var thumbsContainer = $('<div>', {'class': 'thumbs-container'});
            this.thumbsScrollWrap = thumbsScrollWrap;
            thumbsScrollWrap.append(scrollLeft);
            thumbsScrollWrap.append(thumbsContainer);
            thumbsScrollWrap.append(scrollRight);
            function animate(plusMinus) {
                return function() {
                    thumbsContainer.animate({'scrollLeft': (plusMinus > 0 ? '+' : '-') + '=' + _this.thumbsJump}, 250,
                        'swing', function() {
                            if(thumbsContainer.scrollLeft() == 0) {
                                scrollLeft.css('visibility', 'hidden');
                            }
                            else {
                                scrollLeft.css('visibility', 'visible');
                            }
                            if(thumbsContainer.scrollLeft() == pikaThumbs.width()-pikaThumbs.parent().width()) {
                                scrollRight.css('visibility', 'hidden');
                            }
                            else {
                                scrollRight.css('visibility', 'visible');
                            }
                        });
                };
            }
            scrollLeft.click(animate(-1));
            scrollRight.click(animate(1));

            this.thumbsContainer = thumbsContainer;
            this.gallery.prepend(thumbsScrollWrap);
            thumbsScrollWrap.after($('<div>', {'class': 'thumbs-divider'}));
            thumbsContainer.append(pikaThumbs);
            var ul = pikaThumbs;
            if (this.useThumbsRescaling) {
                this.on('rescaleThumbs', function () {
                    var rightlyHeight = (_this.containerHeight() * _this.maxHeightThumbs) + 5;
                    scrollLeft.css('margin-top', (rightlyHeight - 50) / 2);
                    scrollRight.css('margin-top', (rightlyHeight - 50) / 2);
                    thumbsScrollWrap.height(rightlyHeight);
                    if(_this.maximized){
                        thumbsContainer.css('width', '');
                    }else {
                        thumbsContainer.width(thumbsScrollWrap.width() - scrollLeft.width() - scrollRight.width() - 2);
                    }
                    if(this._mainContainerElement.find('.pika-stage img').first().css('max-height') != '100%') {
                        ul.find('img').css({ 'max-width': '350px', 'max-height': (_this.containerHeight() * _this.maxHeightThumbs) + 'px' });
                    }
                    else {
                        ul.find('img').css({ 'max-width': '350px' });
                    }
                    scrollLeft.css('visivility', 'hidden');
                    scrollRight.css('visibility', 'hidden');
                    this.listenTo(Registry.get("layout"), "allWomiLoaded", function() {
                        var curWidth = pikaThumbs.width();
                        var i=0;
                        var thumbsLoading = setInterval(function() {

                            if(i != 0){
                                var tempWidth = pikaThumbs.width();
                                if(tempWidth == curWidth) {
                                    if (pikaThumbs.width() < thumbsContainer.width()) {
                                        scrollLeft.css('visibility', 'hidden');
                                        scrollRight.css('visibility', 'hidden');
                                    }
                                    else {
                                        scrollLeft.css('visibility', 'visible');
                                        scrollRight.css('visibility', 'visible');
                                    }
                                    _this._hideThumbsNav(thumbsContainer, pikaThumbs, scrollLeft, scrollRight);
                                    clearInterval(thumbsLoading);

                                }
                                else {
                                    curWidth = tempWidth;
                                }

                            }
                            i++;
                        }, 2000);
                    } );




                });
            }

            _.each(this._womi, function (w, index) {
                var alt = w.selected.object.altText();
                var item = $(_.template(_this.miniatureTemplate, {imgSrc: w.getMiniature(), title: _this.thumbsTitle(w.selected), alt: _this.thumbsAlt(w.selected)}));
                ul.append(item);
                item.click(function () {
                    prevOrNext(index - _this.idx);
                });
            });
            this.trigger('rescaleThumbs');

            this.on('scrollToMiniature', function (data) {
                var diff = data.curIdx - data.prevIdx;
                var curMiniature = $(ul.find('li')[data.prevIdx]);
                var nextMiniature = $(ul.find('li')[data.curIdx]);
                ul.find('li').removeClass('active');
                curMiniature.find('.clip').css('-webkit-clip-path', '').css('clip-path', '');
                if (data.curIdx != 0) {
                    thumbsContainer.animate({ scrollLeft: thumbsContainer.scrollLeft() + (curMiniature.width() * diff)});
                } else {
                    thumbsContainer.animate({ scrollLeft: 0});
                }
                nextMiniature.addClass('active');
                var clipHeightPercent = 100*(parseInt(nextMiniature.css('height'), 10)-2)/parseInt(nextMiniature.css('height'), 10);
                var clipWidthPercent = 100*(parseInt(nextMiniature.css('width'), 10)-2)/parseInt(nextMiniature.css('width'), 10);
                if(clipWidthPercent<80) {
                    clipWidthPercent = 98.0;
                    clipHeightPercent = 98.0
                }
                nextMiniature.find('.clip').css('-webkit-clip-path', 'polygon('+(100-clipWidthPercent)+'% '+clipHeightPercent+'%, '+clipWidthPercent+'% '+clipHeightPercent+'%, '+clipWidthPercent+'% '+(100-clipHeightPercent)+'%, '+(100-clipWidthPercent)+'% '+(100-clipHeightPercent)+'%)').css('clip-path', 'polygon('+(100-clipWidthPercent)+'% '+clipHeightPercent+'%, '+clipWidthPercent+'% '+clipHeightPercent+'%, '+clipWidthPercent+'% '+(100-clipHeightPercent)+'%, '+(100-clipWidthPercent)+'% '+(100-clipHeightPercent)+'%)');


            });

            this._handleThumbs();
        },

        _handleThumbs: function () {
            if (isIn(this.galleryParams.thumbnails, ['hide', 'hide-fullscreen']) && this.maximized) {
                this.thumbsContainer.hide();
                this.thumbsScrollWrap.hide();
                return false;
            }

            if (isIn(this.galleryParams.thumbnails, ['all', 'hide-normal']) && this.maximized) {
                this.thumbsContainer.show();
                this.thumbsScrollWrap.show();
                return true;
            }

            if (isIn(this.galleryParams.thumbnails, ['hide', 'hide-normal']) && !this.maximized) {
                this.thumbsContainer.hide();
                this.thumbsScrollWrap.hide();
                return false;
            }

            if (isIn(this.galleryParams.thumbnails, ['all', 'hide-fullscreen']) && !this.maximized) {
                this.thumbsContainer.show();
                this.thumbsScrollWrap.show();
                return true;
            }
        },

        _fsMenu: function () {
            var _this = this;
            if (!this.fsMenu) {
                var fsMenu = new layout.WOMIMenuLayout();
                fsMenu.addMenuItem({
                    name: 'prev',
                    callback: function () {
                        _this.trigger('goTo', _this.idx - 1);
                    }
                });
                (this._playlist !== 'autoplay') && fsMenu.addMenuItem({
                    name: 'play',
                    playing: false,
                    playHandler: null,
                    item: null,
                    playGenerator: function () {
                        var that = this;
                        fsMenu.getMenu().find("button").each(function (idx, element){
                            $(element).data('tooltipsy').hide();
                        });
                        return setInterval(function () {
                            if (!_this.maximized) {
                                that.playHandler && clearInterval(that.playHandler);
                                that.playing = false;
                                that.item && $(that.item).removeClass('play-paused');
                                return;
                            }
                            if (_this.idx + 1 >= _this._womi.length) {
                                _this.trigger('goTo', 0);
                            } else {
                                _this.trigger('goTo', _this.idx + 1);
                            }
                        }, 3000);
                    },
                    callback: function (item) {
                        if (this.playing) {
                            this.playHandler && clearInterval(this.playHandler);
                            this.playing = false;
                        } else {
                            this.playHandler = this.playGenerator();
                            this.playing = true;
                        }
                        this.item = item;
                        $(item).toggleClass('play-paused');
                    }
                });
                fsMenu.addMenuItem({
                    name: 'next',
                    callback: function () {
                        _this.trigger('goTo', _this.idx + 1);
                    }
                });

                this.fsMenu = fsMenu.getMenu();
            }
        },


        _typeB: function () {
            var images = this._womiListToImages();
            var _this = this;

            var opened = false;
            var gal = this.galleryB.parent();
            //this.gallery = $('<div>', {'class': 'thumbB'});


            function resizeF() {
                var tile = _this._mainContainerElement.closest('.tile');
                var _maxHeight = _this.maxHeight;
                var backgroundSize = '100%, auto';
                if (_this.viewHeight == 1) {
                    backgroundSize = 'contain';
                }
                if (_this._mainContainerElement.width() < 410) {
                    _maxHeight = 0.1;
                } else if (_this._mainContainerElement.width() < 700) {
                    if (_this.viewHeight < _this.viewWidth) {
                        _maxHeight = 0.2;
                    } else {
                        _maxHeight = 0.7;
                    }
                } else if (_this._mainContainerElement.width() < 1100) {
                    if (_this.viewHeight < _this.viewWidth) {
                        _maxHeight = 0.3;
                    } else {
                        _maxHeight = 0.7;
                    }
                } else {
                    if (_this.viewHeight < _this.viewWidth) {
                        _maxHeight = 0.4;
                    } else {
                        _maxHeight = 0.7;
                    }
                }
                var height = _maxHeight * $(window).height();
                if (_this._isFS) {
                    height = _this._mainContainerElement.height();
                } else if (tile.length > 0) {
                    if (!tile.hasClass('anchor-padding')) {
                        height = tile.height() * _maxHeight;
                    }
                }
                var margin = 5;
                var vh = (opened ? Math.ceil(images.length / _this.viewWidth) : _this.viewHeight);
                var imgH = (height - margin * _this.viewHeight) / _this.viewHeight;
                var imgW = (_this._mainContainerElement.width() - margin * (_this.viewWidth + 1)) / _this.viewWidth;
                height = (opened ? vh * (imgH + margin) : height);
                _this.galleryB.html('');
                _this.galleryB.css({width: _this._mainContainerElement.width(), height: height, position: 'relative'});
                var imgCnt = 0;
                for (var h = 0; h < vh; h++) {
                    for (var w = 0; w < _this.viewWidth; w++) {
                        if (imgCnt < images.length) {
                            var d = $('<div>', { 'class': 'gallery-b-grid-image'});
                            d.attr('title', images[imgCnt].title);
                            d.attr('alt', images[imgCnt].alt);
                            d.attr('aria-label', images[imgCnt].alt);
                            d.css({
                                width: imgW,
                                height: imgH,
                                top: h * (imgH + margin),
                                left: w * (imgW + margin) + margin,
                                'background-repeat': 'no-repeat',
                                'background-size': backgroundSize,
                                'background-image': 'url(' + images[imgCnt].image + ')'
                            });
                            d.data('image-number', imgCnt);
                            d.click(_.bind(function () {
                                //_this.fullScreen(images, $(this).data('image-number'));
                                _this.trigger('goTo', this.i);
                                _this.fullscr();
                            }, {i: imgCnt}));
                            _this.galleryB.append(d);
                            imgCnt++;
                        }
                    }
                }
            }

            if ((this.viewWidth * this.viewHeight) < images.length) {
                var openClose = $('<button>', {'class': 'gallery-b-open-close'});
                openClose.append($('<i>', {'class': 'icon-angle-down icon-2x inline-icon'}));
                this.galleryB.after(openClose);
                openClose.click(function () {
                    opened = !opened;
                    openClose.find('i').toggleClass('icon-angle-down');
                    openClose.find('i').toggleClass('icon-angle-up');
                    resizeF();
                });
            }

            //$(window).resize(resizeF);
            this.resizeHandler = resizeF;
            this._rsHandler = resizeF;
//          resizeF();
            this._handleFormatContents();

            function delayF() {
                window.setTimeout(resizeF, 500);
            }

            delayF();

            this._showMenu(gal);
        },
        _resize: function () {
            if (this.maximized) {
                return this._rsHandlerA || function () {
                };
            }

            return this._rsHandler || function () {
            };
        },
        callResize: function () {
            this._resize()();
        },
        _fullscreenControl: function () {
            var keyModuleSwitchHandler;
            var that = this;
            $.each($._data(document, "events").keydown, function (idx, el) {
                if (el.namespace == 'bottombar') {
                    keyModuleSwitchHandler = el;
                }
            });
            $(document).off('keydown.bottombar');

            $(document).keydown(function (event) {
                if (event.target.nodeName.toUpperCase() !== "INPUT") {
                    if (event.keyCode == 37) {
                        that.trigger('goTo', that.idx - 1);
                        event.preventDefault();
                    } else if (event.keyCode == 39) {
                        that.trigger('goTo', that.idx + 1);
                        event.preventDefault();
                    }
                }
            });

            return function () {
                if (keyModuleSwitchHandler != null) {
                    $(document).on('keydown.bottombar', keyModuleSwitchHandler);
                }
            }
        },


        _displayMiniatures: function () {
            var _this = this;
            var thumbsContainer = $('<div>', {'class': 'thumbs-container show-scroll'});
            var thumbs = $('<ul>', {'class': 'pika-thumbs'});
            var drawContents = isIn(_this.galleryParams.contents, ['all', 'hide-fullscreen']);

            thumbsContainer.append(thumbs);
            this.galleryC.append(thumbsContainer);

            var rs = function () {
                var height = _this.maxHeight * $(window).height();
                var tile = _this._mainContainerElement.closest('.tile');
                if (tile.length > 0) {
                    if (!tile.hasClass('anchor-padding')) {
                        height = tile.height() * _this.maxHeight;
                    }
                }
                if (_this._womi.length == 2) {
                    //thumbs.height(height * _this.maxHeight);
                    var min = 10000000000;
                    thumbs.find('img').each(function (i, img) {
                        $(img).css({'max-height': height, 'max-width': thumbsContainer.width() * 0.47, 'height': '' });
                        var s = $(img).attr('src');
                        if (min > $(img).height() && s && s !== '') {
                            min = $(img).height();
                        }
                    });
                    thumbs.find('img').css('height', min);

                    //thumbs.height(min + 50);

                    if(min == 0){
                        thumbs.find('img').each(function (i, img) {
                            $(img).css({'max-height': height, 'max-width': thumbsContainer.width() * 0.47, 'height': '' });
                            var s = $(img).attr('src');
                            if (s && s !== '') {
//                                $(img).height(height);
                            }
                        });
                    }

                } else {
                    thumbs.height(height * _this.maxHeightOnlyThumbs);
                    thumbs.find('img').css({'max-height': (height * _this.maxHeightOnlyThumbs) + 'px', 'max-width': 'none'});
                }
            };
            var loadedIndicator = 0;
            $.each(this._womi, function (i, w) {
                var thumbsLi = $('<li>', {'class': 'thumb-gallery-c'});
                var thumbsClip = $('<div>', {'class': 'clip'});

                var alt = w.selected.object.altText();
                var fullScreenImg = $('<img>', {
                    'src': w.getMiniature(),
                    'title': _this.thumbsTitle(w.selected),
                    'alt': _this.thumbsAlt(w.selected),
                    load: function () {
                        loadedIndicator++;
                        if (loadedIndicator == _this._womi.length) {
                            rs();
                        }
                    }
                });
                thumbsClip.append(fullScreenImg);
                thumbsLi.click(function () {
                    _this.trigger('goTo', i);
                    _this.fullscr();
                });

                thumbsLi.append(thumbsClip);
                if (drawContents && w.selected.options.content) {
                    thumbsLi.append('<span>' + w.selected.options.content + '</span>');
                }
                thumbs.append(thumbsLi);
            });

            this.resizeHandler = rs;
            this._rsHandler = rs;

            this._showMenu(this.galleryC);

            this._handleFormatContents();
        },
        _handleFormatContents: function () {
            this._mainContainerElement.find('> .womi-gallery-contents .content').hide();
            switch (this._formatContents) {
                case 'hide':
                case 'hide-normal':
                    break;
                case 'all':
                case 'hide-fullscreen':
                    if (deviceDetection.isMobile) {
                        this._mainContainerElement.find('> .womi-gallery-contents .content.mobile').show();
                    } else {
                        this._mainContainerElement.find('> .womi-gallery-contents .content.classic').show();
                    }
                default:
                    break;
            }

            switch (this._titles) {
                case 'hide':
                case 'hide-normal':
                    this._title.hide();
                    break;
                case 'all':
                case 'hide-fullscreen':
                //
                default:
                    break;
            }
        },

        _licenseItem: function () {
            var _this = this;
            require('modules/core/WomiManager').womiEventBus.on('toggleWOMILicense', function () {
                _this._menuContainer && _this._menuContainer.find('li > .license').toggle();
            });
            var defaultObj = {
                license: 'brak'
            };

            function fancyCreate(objectList) {
                var element = $('<div>', {'class': 'gallery-license'});
                _.each(objectList, function (object, index) {
                    object = _.extend(defaultObj, object);
                    object.title && element.append('<h3>element ' + (index + 1) + ': <em>' + object.title + '</em></h3>');
                    object.author && element.append('<h3>autor: <em>' + object.author + '</em></h3>');
                    object.license = (object.license == 'PŁ' ? 'Politechnika Łódzka' : object.license);
                    element.append('<h3>licencja: <em>' + object.license + '</em></h3><hr>');
                });
                $.fancybox.open({
                    wrapCSS: 'fancybox-modal',
                    content: element,
                    loop: false,
                    margin: 1,
                    padding: 1,
                    width: '66%',
                    height: 'auto',
                    helpers: {
                        overlay: {
                            closeClick: true,
                            locked: true,
                            css: {
                                'background': 'rgba(255, 255, 255, 0.6)'

                            }
                        }
                    }
                });
            }

            return {
                name: 'license',
                callback: function () {
                    var licenseLinks = [];
                    _.each(_this._womi, function (w, index) {
                        if (w._licenseUrl) {
                            licenseLinks.push('json!' + w._licenseUrl().src);
                        }
                    });
                    require(licenseLinks, function () {
                        fancyCreate(arguments);
                    });

                    return false;
                }
            }
        },
        _altNavMenu: function () {
            var _this = this;
            var clazz = layout.WOMIMenuLayout;
            var galleryMenu = new clazz();
            [
                {name: 'next', callback: function () {
                    _this.trigger('goTo', _this.idx + 1);
                }},
                {name: 'prev', callback: function () {
                    _this.trigger('goTo', _this.idx - 1);
                }},
                {name: 'fullscreen', callback: function () {
                    _this.fullscr();
                }}
            ].forEach(function (entry) {
                    galleryMenu.addMenuItem(entry);
                });
            return galleryMenu.getMenu();
        },
        _createMenu: function () {
            var _this = this;

            var licItem = this._licenseItem();
            HookManager.executeHook('licenseItemAddingHook', [this._mainContainerElement, licItem], _.bind(function () {
                licItem && (this.menuItems = [licItem].concat(this.menuItems));
            }, this));
            //this.menuItems = [this._licenseItem()].concat(this.menuItems || []);
            var clazz = layout.WOMIMenuLayout;
            this.galleryMenu = new clazz();

            this.menuItems.forEach(function (entry) {
                _this.galleryMenu.addMenuItem(entry);
            });
        },
        _showMenu: function (target) {

            this._menuContainer = this.galleryMenu.getMenu();
            target.append(this._menuContainer);
            target.append($('<div>', {'class': 'clearfix'}));
        },
        _womiListToImages: function () {
            var _this = this;
            var images = $.map(this._womi, function (w) {
                if (w.selected.object) {
                    var alt = w.selected.object.altText();
                    return {
                        image: w.getMiniature(),
                        alt: _this.thumbsAlt(w.selected),
                        title: _this.thumbsTitle(w.selected)
                    };
                }
            });

            return images;
        },
        fancyBoxDefaults: {
            loop: false,
            closeBtn: false,
            margin: 1,
            padding: 1,
            scrolling: 'no',
            helpers: {
                overlay: {
                    css: {
                        'background-color': 'rgba(0,0,0,0.89)'
                    },
                    locked: isTouch
                }
            }
        },
        pikachooseDefaults: {
            autoPlay: false,
            thumbOpacity: 1.0,
            transition: [0],
            text: { previous: 'poprzednie', next: 'następne', loading: 'ładowanie...' }
        },

        _hideNavOnBorders: function() {
            if($('.fullscreen-gallery')[0] != undefined) {
                if ($('.fullscreen-gallery').find(".pika-thumbs:first > li:first").hasClass('active')) {
                    $('.fullscreen-gallery').find("a.previous:first").hide();
                    $('.fullscreen-gallery').find("div.womi-menu button.prev").css('visibility', 'hidden');
                    $('.fullscreen-gallery').find("div.womi-menu button.next").css('visibility', 'visible');
                }
                else if ($('.fullscreen-gallery').find(".pika-thumbs:first > li:last").hasClass('active')) {
                    $('.fullscreen-gallery').find("a.next:first").hide();
                    $('.fullscreen-gallery').find("div.womi-menu button.next").css('visibility', 'hidden');
                    $('.fullscreen-gallery').find("div.womi-menu button.prev").css('visibility', 'visible');
                }
                else
                {
                    $('.fullscreen-gallery').find("div.womi-menu button.prev").css('visibility', 'visible');
                    $('.fullscreen-gallery').find("div.womi-menu button.next").css('visibility', 'visible');
                }
            }
            else {
                if ($(this._mainContainerElement[0]).find(".pika-thumbs:first > li:first").hasClass('active')) {
                    $(this._mainContainerElement[0]).find("a.previous:first").hide();
                    $(this._mainContainerElement[0]).find("div.alternative-nav button.prev").css('visibility', 'hidden');
                }
                else if ($(this._mainContainerElement[0]).find(".pika-thumbs:first > li:last").hasClass('active')) {
                    $(this._mainContainerElement[0]).find("a.next:first").hide();
                    $(this._mainContainerElement[0]).find("div.alternative-nav button.next").css('visibility', 'hidden');
                }
                else
                {
                     $(this._mainContainerElement[0]).find("div.alternative-nav button.prev").css('visibility', 'visible');
                     $(this._mainContainerElement[0]).find("div.alternative-nav button.next").css('visibility', 'visible');
                }
            }


    }

    });
});