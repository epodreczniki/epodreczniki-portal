define(['jquery', 'underscore', 'modules/core/womi/WOMIGalleryContainer'//, './gallery/WOMIContainer'
], function ($, _, WOMIGalleryContainer) {
    var commonBase = require('common_base');
    var deviceDetection = require('device_detection');

    function calcTextHeight(htmlContainer, w) {
        htmlContainer.css({
            width: w
        });
        return htmlContainer.height();
    }

    function determineDescriptionContent(wrapDescription){
        var hasAudio = wrapDescription.find('.play-audio').length > 0 ? true : false;
        var hasText = wrapDescription.text() != '' > 0 ? true : false;
        return {
            audio: hasAudio,
            text: hasText
        }
    }

    var MIN_WIDTH = 200;

    var MIN_HEIGHT_RATIO = 1 / 4;

    function determineSize(width, height, wrapDescrContainer, womiContainer, miniaturesMargin) {
        var tmp = $('<div>', {'class': 'invisible-tmp-text'});
        $('body').append(tmp);
        var description = determineDescriptionContent(wrapDescrContainer);
        tmp.html(wrapDescrContainer.html());
        var size = womiContainer.getDefaultSize();
        var containerRatio = size.width / size.height;
        var maxWidth = containerRatio * height;
        var oldWidth = width;
        if (width > maxWidth) {
            width = maxWidth;
        }
//        height += (wrapDescrContainer.text() == '' ? 20 : 0) - (miniaturesMargin ? 20 : 0);
        height += ((!description.audio && !description.text) ? 20 : 0) - (miniaturesMargin ? 20 : 0);

        function lookForParamsWidth() {
            for (var i = 0; i < width; i += 10) {
                var newW = width - i;
                var txtH = calcTextHeight(tmp, newW);
                var newH = (newW / containerRatio);
                if ((Math.ceil(txtH + newH) <= height) && newW >= MIN_WIDTH) {
                    //tmp.remove();
                    return {
                        wrapWidth: newW,
                        textHeight:  description.audio ? txtH + 50: txtH,
//                        hasText: wrapDescrContainer.text() != ''
                        hasText: !(!description.audio && !description.text)
                    }
                }
            }
        }

        function lookForParamsHeight() {
            for (var i = MIN_WIDTH; i < width; i += 10) {
                var newW = i;
                var txtH = calcTextHeight(tmp, newW);
                if ((height - txtH) / height >= MIN_HEIGHT_RATIO) {
                    //tmp.remove();
                    return {
                        wrapWidth: newW,
                        textHeight: description.audio ? txtH + 50: txtH,
//                        hasText: wrapDescrContainer.text() != ''
                        hasText: !(!description.audio && !description.text)
                    }
                }
            }
        }

        var params = lookForParamsWidth();
        if (params) {
            console.log('paramsw', params, 'tmp', tmp.width());
            tmp.remove();
            return params;
        }

        params = lookForParamsHeight();
        if (params) {
            console.log('paramsh', params, 'tmp', tmp.width());
            tmp.remove();
            return params;
        }

        return {
            wrapWidth: oldWidth * 0.7,
            textHeight: 100,
//            hasText: wrapDescrContainer.text() != ''
            hasText: !(!description.audio && !description.text)
        }

    }

    return WOMIGalleryContainer.extend({

        maxHeightStage: 0.85,
        descriptionHeight: 0.20,
        thumbsReturn: true,
        useThumbsRescaling: false,

        prevOrNextRecalc: function (stage, idx, i) {
            var h = this._stageHeight();
            //stage.height(h);//temporary handle some height
            this._womi[idx].hide();
            this.idx += i;
            this._womi[this.idx].show();
            this.trigger('scrollToMiniature', {curIdx: this.idx, prevIdx: idx});

            this._determineOverlay();
        },

        renderA: function () {
            WOMIGalleryContainer.prototype.renderA.call(this);
            var _this = this;
            this.resizeFunc = function () {
                var h = this._stageHeight();
                var fsWrap = $('.fs-wrap');
                var descr = $('.wrap-descr');
                var descrH = 0;
                if (this.maximized) {
                    var s = determineSize(($(window).width() * 0.9), h, descr, this._womi[this.idx], !this.single && !this.galleryPlaying);

                    descrH = s.textHeight;
                    descr.toggle(s.hasText);
                    fsWrap.css('width', s.wrapWidth + 2 * 20);
                }
                this._womi[this.idx].trigger('changeSize', { height: h - descrH });
                this.trigger('resized');

            };
            this._rsHandlerA = _.debounce(_.bind(this.resizeFunc, this), 300);
            this._rsHandler = this._rsHandlerA;
        },

        _createFullscreenTop: function (descriptionPlaceholder) {
            var top;
            if (deviceDetection.isMobile) {
                var tpl = '<div class="fullscreen-gallery-top"><button class="top-toggle"></button><button class="close-gallery">' + this.wcagLabel('zamknij tryb pełnoekranowy') + '</button></div>';
                top = $(tpl);
            } else {
                var tpl = '<div class="fullscreen-gallery-top"><button class="top-toggle"></button><button class="hastip close-gallery" title="Zamknij">' + this.wcagLabel('zamknij tryb pełnoekranowy') + '</button></div>';
                top = $(tpl);
            }

            var close = top.find('.close-gallery');
            var _this = this;
            close.click(function () {
                $.fancybox.close();
                _this.trigger('goTo', _this._startOn);
            });

            this._fullscreenMiniatureHandler = _.bind(function () {
                var womi = this._womi[this.idx];

                var wrp = $('<div>', {'class': 'descr-wrap'});
                descriptionPlaceholder.html('');
                descriptionPlaceholder.append(wrp);
                this.setTitleAndContent(womi, wrp, ['all', 'hide-normal'], true);
                //descriptionPlaceholder.height(this.containerHeight() * this.descriptionHeight);
                var related = womi.selected.options.related;
                if (related) {
                    var play = $('<button>', {'class': 'play-audio'});
                    descriptionPlaceholder.prepend(play);
                    play.attr('id', related.selected.object._id);
                    require(['reader.api'], function (ReaderApi) {
                        var readerApi = new ReaderApi(require, true);
                        readerApi.bindAudio(play, related.selected.object._audioId + '');
                    });
                }
                this.resizeFunc();

            }, this);
            this._fullscreenMiniatureHandler();
            this.on('scrollToMiniature', this._fullscreenMiniatureHandler);


            return top;
        },

        _handleThumbs: function () {
            if (this.single) {
                this.thumbsContainer.hide();
                return false;
            }
            if (this.maximized) {
                this.thumbsContainer.toggle(!this.galleryPlaying);

                return !this.galleryPlaying;
            } else {
                return WOMIGalleryContainer.prototype._handleThumbs.call(this);
            }
        },

        thumbsTitle: function(object){
            return object.options.alt;
        },

        fullscr: function () {
            this._registerHidingThumbs();
            var _this = this;
            var wrap = $('<div class="fs-wrap"><div class="wrap-stage"></div><div class="wrap-descr"></div></div>');
            var fs = $('<div>', {'class': 'fullscreen-gallery'});
            var fsTop = this._createFullscreenTop(wrap.find('.wrap-descr'));
            fs.append(fsTop);
            var stagePlace = $('<div>');
            this.stage.after(stagePlace);
            var thumbPlace = $('<div>');
            this.thumbsContainer.after(thumbPlace);

            wrap.find('.wrap-stage').append(this.stage);
            fs.append($('<div>', {'class': 'stage-prev-wrap'}).append($('<button>', {
                    'class': 'stage-prev',
                    click: function () {
                        fs.find('.alternative-nav').find('button.prev').click();
                    }
                }
            )));
            fs.append($('<div>', {'class': 'stage-next-wrap'}).append($('<button>', {
                    'class': 'stage-next',
                    click: function () {
                        fs.find('.alternative-nav').find('button.next').click();
                    }
                }
            )));
            fs.append(wrap);
            fs.append(this.thumbsContainer);

            _this.galleryPlaying = false;
            var toggler = fsTop.find('.top-toggle');
            this._fsMenu();
            var fsMenu = this.fsMenu;
            toggler.click(function () {
                $(this).toggleClass('paused');
                _this.trigger('galleryPlaying', $(this).hasClass('paused'));
                fsMenu.find('.play').click();
            });
            if (this.single) {
                fs.find('.stage-prev-wrap').hide();
                fs.find('.stage-next-wrap').hide();
                toggler.hide();
            }


            _this.maximized = true;

            var bodyOverflow = $('body').css('overflow');

            var fsControl = this._fullscreenControl();
            this._determineOverlay();

            $.fancybox(fs, _.extend({
                autoSize: false,
                beforeLoad: function () {

                    this.height = '100%';
                    this.width = '100%';
                    //$('.fancybox-skin').css('background', 'none');
                },
                beforeClose: function () {
                    if (toggler.hasClass('paused')) {
                        toggler.click();
                    }
                    _this.off('scrollToMiniature', _this._fullscreenMiniatureHandler);
                    _this.maximized = false;
                    _this._handleThumbs();
                    stagePlace.after(_this.stage);
                    stagePlace.remove();
                    thumbPlace.after(_this.thumbsContainer);
                    thumbPlace.remove();
                    fsControl();
                    _this._determineOverlay();
                    $('body').css('overflow', bodyOverflow);
                    _this._rsHandler();
                },
                beforeShow: function () {
                    //$('.fancybox-skin').css('background', 'none');
                    $('body').css('overflow', 'hidden');
                },
                afterShow: function () {
                    //$('.fancybox-skin').css('background', 'none');
                    _this._handleThumbs();
                    _this._rsHandlerA();
                    _this._fullscreenMiniatureHandler();
                }

            }, this.fancyBoxDefaults));

        },

        _registerHidingThumbs: function () {
            this.off('galleryPlaying');
            var _this = this;
            this.on('galleryPlaying', function (isTrue) {
                _this.galleryPlaying = isTrue;
                _this._rsHandler();
            });
        },

        _determineOverlay: function () {
            if (this.maximized) {
                this.stage.find('[data-role="gallery-nav"]').hide();

            } else {
                WOMIGalleryContainer.prototype._determineOverlay.call(this);
            }
        },
        containerHeight: function () {

            if (this.maximized) {
                return ($(window).height() - 60 - (!this.single && !this.galleryPlaying ? 20 : 0) - (this._womi[this.idx].hasButtons() ? 35 : 0));// * this.maxHeightStage;
            }

            var tile = this._mainContainerElement.closest('.tile');

            return tile.height();
        },

        makeTransparent: function () {
//            this._mainContainerElement.css('visibility', 'hidden');
            this._mainContainerElement.find('.gallery-container').css('visibility', 'hidden');
            var tile = this._mainContainerElement.closest('.tile');
            var pack = $('<div class="gallery-invisible" tabindex="0">');

            function resizeInvisible() {
                pack.css({'width': tile.width(), 'height': tile.height()});
            }

            resizeInvisible();
            this.on('resized', resizeInvisible);

            this._mainContainerElement.before(pack);
            pack.append(this._mainContainerElement);
            pack.click(_.bind(function () {
                this.fullscr();
            }, this));
            pack.keyup(_.bind(function (event) {  // EPGE-335
                if (event.keyCode == 13) {
                    this.fullscr();
                }
            }, this));
            pack.attr('aria-label', 'Grafika: ' + this._mainContainerElement.find('img:visible').attr('alt'));
        }


    });
});
