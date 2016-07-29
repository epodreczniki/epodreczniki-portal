define(['jquery', 'backbone', 'underscore', 'modules/core/Registry', './WOMIContainerBase', './WOMIInteractiveObjectContainer'], function ($, Backbone, _, Registry, Base, WOMIInteractiveObjectContainer) {
    var deviceDetection = require('device_detection');
    //var handleSvg = require('svg_fallback');
    var isTouch = true;

    var readerDefinition = $('#reader-definition');

    readerDefinition = {
        stylesheet: readerDefinition.data('stylesheet'),
        env: readerDefinition.data('environment-type')
    };


    var WOMIImageContainer = Base.extend({
        containerClass: 'image-container',
        SVG_LOADER: '/global/libraries/epo/svg/loader.html',
        MEDIA_MAPPINGS: {
            '480': '(max-width: 480px)',
            '980': '(max-width: 480px) and (-webkit-min-device-pixel-ratio: 1.5),(min-resolution: 144dpi)',
            '1440': ['(max-width: 979px) and (-webkit-min-device-pixel-ratio: 2.0),(min-resolution: 192dpi)', '(min-width: 980px) and (-webkit-min-device-pixel-ratio: 1.5),(min-resolution: 144dpi)'],
            '1920': '(min-width: 980px) and (-webkit-min-device-pixel-ratio: 2.0),(min-resolution: 192dpi)'
        },
        DEFAULT_MEDIA: 980,
        maxHeight: 0.7,
        lensSize: 150,
        _lookForBlocks: function () {
            //this._mainContainerElement = $(this._mainContainerElement[0]);
            var _this = this;
            this._availableResolutions = [];
            this._anyImage = $(this._mainContainerElement.clone());
            $(this._mainContainerElement.find('div[data-resolution]')).each(function (index, element) {
                _this._availableResolutions.push($(element).data('resolution'));
            });
            this._renderDoneRegister();
        },
        _renderDoneRegister: function () {
            this.on('renderDone', function () {
                this._resize()();
                if (!this.hasFullscreenItem()) {
                    this._createOverlayFullscreenField();
                }
            });
        },
        _discoverContent: function () {
            this._altText = this._mainContainerElement.data('alt');
            this._width = this._mainContainerElement.data('width') || '100%';
            this._src = this._mainContainerElement.data('src');
            if (this._src.substring(this._src.lastIndexOf('.')) == '.svg') {
                this._isEmbed = true;
            } else {
                this._isEmbed = false;
            }

        },
        _match: function (media) {
            return (window.matchMedia && window.matchMedia(media).matches);
        },
        _buildMediaUrl: function (root, entry) {
            var pattern = /=$/;
            var base = root;
            if (root.search(pattern) == -1) {
                pattern = /\/$/;
                base = base.replace(pattern, "");
                var dotPos = base.lastIndexOf('.');
                if (entry != "" && base.substring(dotPos) != '.svg') {
                    return base.substring(0, dotPos) + '-' + entry + base.substring(dotPos).toLowerCase();
                } else {
                    return base.substring(0, dotPos) + base.substring(dotPos).toLowerCase();
                }
            }
            return base + entry;
        },
        _selectMedia: function () {
            var _this = this;
            var selectedMedia = this.DEFAULT_MEDIA;
            if ($('.womi-container[data-womi-id="' + _this.options.womiId + '"]').closest('div.full-width').length) {
                selectedMedia = 1920;
            }
            if (_this.options.roles && _this.options.roles.magnifier) {
                selectedMedia = 1920;
            }
            var matched = false;
            this._availableResolutions.forEach(function (entry) {
                var mp = _this.MEDIA_MAPPINGS[entry];
                if(!_.isArray(mp)){
                    mp = [mp];
                }
                _.each(mp, function(media){
                    if (_this._match(media)) {
                        selectedMedia = entry;
                        matched = true;
                    }
                });

            });
            if (this._availableResolutions.length == 0) {
                selectedMedia = "";
            } else if (this._availableResolutions.length == 1 && !matched) {
                selectedMedia = this._availableResolutions[0];
            }
            return selectedMedia;
        },
        _selectBestWidthSizedMedia: function(){
            var max = Math.max(screen.availHeight, screen.availWidth);
            var closest = {
                entry: this.DEFAULT_MEDIA,
                diff: 1000000000
            };
            this._availableResolutions.forEach(function (entry) {
                var diff = Math.abs(entry - max);
                 if(diff < closest.diff) {//} && entry <= max){
                     closest.diff = diff;
                     closest.entry = entry;
                 }
            });
            return closest.entry;
        },
        onrelated: function (relatedObj) {

        },

        fullyLoaded: function(){
            //pass
        },

        maxAvailableMedia: function () {
            var max = _.max(this._availableResolutions);
            return _.isFinite(max) ? max : '';
        },

        minAvailableMedia: function () {
            var min = _.min(this._availableResolutions);
            return _.isFinite(min) ? min : '';
        },

        getWomiManageButtons: function () {
            var _this = this;
            if ((this.roles && this.roles.magnifier)) {
                return [
                    {
                        name: 'zoomin',
                        callback: function () {
                        }
                    },
                    {
                        name: 'zoomout',
                        callback: function () {
                        }
                    },
                    {
                        name: 'reset',
                        callback: function () {
                        }
                    }
                ];
            }else{
                return null;
            }
        },

        postProcessMenu: function (menu) {

            if ((this.roles && this.roles.magnifier)) {
                $(this._imgElement).panzoom({
                    $zoomIn: menu.find('.zoomin'),
                    $zoomOut: menu.find('.zoomout'),
                    $reset: menu.find('.reset'),
                    minScale: 0.4,
                    maxScale: 5
                });
            }
        },

        elementAttributes: function(){
            return {
                'class': 'generated-image',
                alt: this.options.alt,
                title: this.options.title,
                'aria-label': this.options.alt
            }
        },

        load: function () {
            var selectedMedia = this._selectMedia();
            var _this = this;
            var tag = (this._isEmbed ? 'div' : 'img');
            if (this._mainContainerElement.find(tag).length > 0 && !this._imgElement) {
                this._mainContainerElement.find(tag).remove();
            }
            if (!this._imgElement || true) {
                this._imgElement = $('<' + tag + '>', this.elementAttributes());
                var url = this._buildMediaUrl(this._src, selectedMedia);
                //this._mainContainerElement.append(this._imgElement);
                if (this._isEmbed) {
                    var u = $('base').data('base');
                    if (u.lastIndexOf('/') == u.length - 1) {
                        u = u.substring(0, u.length - 1);
                    }
                    u = u + url;
                    u = this.SVG_LOADER + '?url=' + u;
                    var div = $('<iframe>', {src: u, style: 'width: 100%; height: 100%;border: none; margin: auto; padding: 0'});//'width: 100%; height: 100%;
                    this._message = function (e) {
                        if (div[0].contentWindow == e.originalEvent.source && e.originalEvent.data.msg == 'svgSize') {
                            _this.svgWidth = e.originalEvent.data.width;
                            _this.svgHeight = e.originalEvent.data.height;
                            //_this.svgX = e.originalEvent.data.x;
                            //_this.svgY = e.originalEvent.data.y;

                            if (e.originalEvent.data.viewBox) {
                                _this.svgViewBox = e.originalEvent.data.viewBox;
                                var coordArray = _this.svgViewBox.split(" ");
                                if (coordArray.length == 4) {
                                    _this.svgViewBoxWidth = coordArray[2];
                                    _this.svgViewBoxHeight = coordArray[3];
                                }

                            }

                            _this._loaderWindow = e.originalEvent.source;
                            _this._resize()();
                        }
                    };

                    $(window).on('message', this._message);
                    this._imgElement.append(div);
                    this._imgElement.css('margin', '0 auto');
                } else {
                    this._imgElement.load(function(){
                        _this.trigger('fullyLoaded');
                    });
                    this._imgElement.attr('src', url);
                }

                this._mainContainerElement.append(this._imgElement);
                if (this.options.related) {
                    var related = this.options.related;
                    if (related.selected.object._audioId) {
//                        require(['reader.api'], function (ReaderApi) {
//                            var readerApi = new ReaderApi(require, true);
//                            _this._relatedAudio = readerApi.bindAudio(_this._imgElement, related.selected.object._audioId);
//                            _this.onrelated(_this._relatedAudio);
//                        });

                    }
                }


                //this._resize()();
                //$(window).on('resize', this._resize());
            }

        },
        getAnyImage: function () {
            return this._anyImage;
        },
        _createOverlayFullscreenField: function () {
            if (this._isFS || this._isSplash) {
                return;
            }
            try {
                var _this = this;
                var imageContainer = this._mainContainerElement;
                imageContainer.css({
                    position: 'relative'
                });
                imageContainer.each(function (index, element) {
                    if ($(element).find('.generated-image')) {
                        if ($(element).find('.generated-image').length > 0) {
                            //var parentClass = $(element).parent().attr('class');
                            //console.log("Parent class: "+ parentClass);
                            var fullScreenImgContainer = $('<div>', {'class': 'fullscreen-image-container'});

                            var fullScreenImage = $('<button>', {'class': 'fullscreen-image', 'title': 'Widok pełnoekranowy'});
                            //$(element).append(fullScreenImgContainer);
                            //$($(element).find('.generated-image')).wrap(fullScreenImgContainer);
                            $(element).find('.generated-image').after(fullScreenImgContainer);
                            fullScreenImgContainer.append($(element).find('.generated-image'));
                            //_this._mainContainerElement.append(fullScreenImgContainer);
                            //fullScreenImgContainer.append(element);
                            fullScreenImgContainer.hover(
                                function () {
                                    //fullScreenImgContainer.css('opacity', '1');
                                    fullScreenImage.css('opacity', '1');
                                },
                                function () {
                                    //fullScreenImgContainer.css('opacity', '0.8');
                                    fullScreenImage.css('opacity', '0');
                                }
                            );
                            fullScreenImgContainer.append(fullScreenImage);
                            fullScreenImgContainer.click(function () {
                                _this._fullScreenMode();
                            });
                        }
                    }
                });
            } catch (err) {
                console.log(err);
            }
        },
        _fullScreenMode: function () {
            var _this = this;
            var fsElement = _this.getFSElement();
            if (fsElement != null) {
                $.fancybox.open(fsElement.element, $.extend({
                    loop: false,
                    margin: 1,
                    padding: 1,
                    scrolling: 'no',
                    scrollOutside: false,
                    beforeLoad: function () {
                    },
                    afterShow: function () {
                        if (fsElement.afterLoad && !fsElement.loaded) {
                            fsElement.afterLoad();
                        }
                        //$('.fancybox-inner, .fancybox-wrap').css('overflow', 'hidden');
                        $('body').css('overflow', 'hidden');
                    },
                    onUpdate: function () {
                        if (fsElement.loaded) {
                            fsElement.loaded = false;
                            $(".fancybox-overlay").on("remove", function () {
                                setTimeout(function () {
                                    _this._fullScreenMode();
                                }, 300);
                            });
                            $.fancybox.close(true);
                        } else {
                            fsElement.loaded = true;
                        }
                    },
                    afterClose: function () {
                        $('div.tooltipsy').remove();
                        $('body').css('overflow', '');
                    },
                    helpers: {
                        overlay: {
                            locked: isTouch
                        }
                    }
                }, fsElement.options));
            }
            return false;
        },
        hasFullscreenItem: function () {
            if (this._isEmbed || (this.roles && this.roles.zoomable) || (this.roles && this.roles.magnifier)) {
                return true;
            }
            return false;
        },
        hasFunctionality: function () {
            return (this._isEmbed || (this.roles && this.roles.zoomable) || (this.roles && this.roles.magnifier));
        },

        hasButtons: function () {
            return ((this.roles && this.roles.magnifier));
        },
        contextCallback: function () {
            this._fullScreenMode();
        },

        getUrl: function () {
            return this._buildMediaUrl(this._src, this._selectMedia());
        },
        getThumbUrl: function () {
            return this._buildMediaUrl(this._src, this.minAvailableMedia());
        },
        getBannerProps: function() {
            var w = this._selectBestWidthSizedMedia();
            return {
                width: w,
                url: this._buildMediaUrl(this._src, w)
            }
        },
        dispose: function () {
            if (this._imgElement != null) {
                this._imgElement.remove();
                this._imgElement = null;
                //$(window).off('resize', this._resize());
                if (this._message) {
                    $(window).off('message', this._message);
                }
            }
        },
        getFSElement: function () {
            var _this = this;
            var selectedMedia = this._selectMedia();
            var element = this._buildMediaUrl(this._src, (deviceDetection.isMobile ? selectedMedia : this.maxAvailableMedia()));
            var options = {
                fitToView: true,
                aspectRatio: true,
                type: 'image',
                scrolling: 'no'
            };
            var roles = this.roles;
            var lens = this.lensSize;
            var after = function () {
                if ((roles && roles.zoomable)) {
                    $('.fancybox-image').imageLens({lensSize: lens, lensCss: 'over-fancybox'});
                }
                _this.closeButtonConfigure();
            };
            if (this._isEmbed) {
                element = $('<div>', {'class': 'klassjan'});//this._mainContainerElement.clone();
                //element.html('');
                var cln = WOMIImageContainer.extend({ _lookForBlocks: function () {
                }, _discoverContent: function () {
                }});
                var img = new cln({el: $('<div>'), options: this.options});
                img = _.extend({_availableResolutions: this._availableResolutions,
                    _altText: this._altText,
                    _src: this._src,
                    _width: this._width,
                    _isEmbed: this._isEmbed}, img);
                img.svgWidth = null;
                img.svgHeight = null;
                img._loaderWindow = null;
                //img.setRoles(this.roles);
                img._scaleElement = WOMIInteractiveObjectContainer.prototype._scaleElement;
                var dimensions = img._scaleElement($(window).width(), $(window).height());
                element.width(dimensions.width);
                element.height(dimensions.height);
                img._isFS = true;
                options = {};
                after = function () {
                    element.append(img.render());
                    img.trigger('renderDone');
                    _this.closeButtonConfigure();
                }
            }
            return {
                element: element,
                options: options,
                afterLoad: function () {
                    after();
                }
            };
        },
        _calcSvgDimensions: function (d) {
            var desiredWidth = this.svgWidth || d.maxWidth;
            var desiredHeight = this.svgHeight || d.maxHeight;
            var ratio = desiredHeight / desiredWidth;
            var dimensions = {
                width: d.containerWidth,
                height: d.containerWidth * ratio
            };

            var maxHeight = d.maxHeight;
            if (this._isFS) {
                maxHeight = $(window).height();
            }

            if (dimensions.height > maxHeight) {
                var scale = maxHeight / dimensions.height;
                dimensions.width *= scale;
                dimensions.height *= scale;
            }
            return dimensions;
        },
        _setFullScreenImageWidth: function (imgElement) {
            if (imgElement.parents('.fullscreen-image-container')) {
                if (imgElement.parents('.fullscreen-image-container').length > 0) {
                    //imgElement.parents('.fullscreen-image-container').width(imgElement.width());
                }
            }
        },
        _calcDimensions: function () {
            var _this = this;
            var percentW = parseFloat(_this._width);
            var tile = _this._mainContainerElement.closest('.tile');
            var height = _this.maxHeight * $(window).height();
            if ($('.science-module').length>0) {

                // console.log("science-module detected");
                if (_this._isFirstInScienceModule == undefined) {
                    if ($('.pagination-page').length>0) {
                        if (_this._mainContainerElement.parents('.pagination-page:first-of-type').length>0) {
                            height = 'none';   // image on first module page has full height regardless the window size
                            _this._isFirstInScienceModule = true;
                        } else {
                            _this._isFirstInScienceModule = false;
                        }
                    } else {
                        if (_this._mainContainerElement.parents('.section.level_1:first-of-type').length>0) {
                            height = 'none';   // the same as above without pages (first load or plain module)
                            _this._isFirstInScienceModule = true;
                        } else {
                            _this._isFirstInScienceModule = false;
                        }
                    }
                } else {
                    if (_this._isFirstInScienceModule) {
                        height = 'none';
                    }
                }

            }

            if (_this._isFS || _this.forceContainerHeight) {

                height = _this._mainContainerElement.height()
            } else if (tile.length > 0) {
                if (!tile.hasClass('anchor-padding')) {
                    height = tile.height() * _this.maxHeight;
                }
                //_this._mainContainerElement.closest('.womi-container').find('.title').hide();
            } else if (tile.length == 0) {
                //_this._mainContainerElement.closest('.womi-container').find('.title').show();
            }

            var dimensions = {maxHeight: height,
                maxWidth: (_this._mainContainerElement.width() * (percentW / 100.0)) || '100%' };
            return dimensions;
        },

        _resize: function () {
            var _this = this;
            if (!this._resizeHandler) {
                this._resizeHandler = function () {
                    var dimensions = _this._calcDimensions();
                    //$(_this._imgElement).
                    if (_this._isEmbed) {

                        if (_this.svgWidth) {
                            dimensions.containerWidth = _this._mainContainerElement.width() || dimensions.maxWidth || '100%';

                            var d = _this._calcSvgDimensions(dimensions);

                            $(_this._imgElement).css({width: d.width, height: d.height});
                            try {
                                $(_this._imgElement).find('iframe')[0].contentWindow.postMessage({msg: 'svgIframeSize', width: d.width, height: d.height, haveSize: true, alt: _this._altText}, '*');
                            } catch (err) {
                                console.log($(_this._imgElement).find('iframe')[0]);
                            }
                        } else {
                            $(_this._imgElement).find('iframe')[0].contentWindow.postMessage({msg: 'svgIframeSize', haveSize: false, alt: _this._altText}, '*');
                            $(_this._imgElement).css({width: dimensions.maxWidth, height: dimensions.maxHeight});
                        }
                    } else {

                        if ((_this.roles && _this.roles.zoomable)) {
                            $(_this._imgElement).css(dimensions);
                            $(_this._imgElement).imageLens('delete');
                            $(_this._imgElement).imageLens({lensSize: _this.lensSize, lensCss: 'lens-style',
                                imageSrc: _this._buildMediaUrl(_this._src, _this.maxAvailableMedia())});
                        } else {
                            $(_this._imgElement).css(dimensions);
                        }
                    }
                    _this._setFullScreenImageWidth($(_this._imgElement));
                }
            }
            return this._resizeHandler;
        }
    });

    return WOMIImageContainer;

});