define(['jquery', 'backbone', 'modules/core/Registry', './WOMIContainerBase'], function ($, Backbone, Registry, Base) {
    var isTouch = true;
    var InteractiveObjectModel = Backbone.Model.extend({});

    var InteractiveObjectContainer = Base.extend({
        containerClass: 'interactive-object-container',
        ENGINES: function (name) {
            return Registry.get('engines')[name];
        },

        render: function () {
            this._mainContainerElement.remove();
            this._mainContainerElement = $('<div>', {'class': 'interactive-object-container'});
            this._mainContainerElement.append(this._engineContainer);
            this.fullyLoaded();
            return this._mainContainerElement;
        },

        _lookForBlocks: function () {
            this._interactiveObject = this._mainContainerElement.children()[0];
            if (this._mainContainerElement.children().length > 1) {
                this._replacementScreen = this._mainContainerElement.children()[1];
            }
            var _this = this;
            this.on('renderDone', function () {
                _this._engineHandler.setRoles(_this.options.roles);
                _this.options.roles.autoplay && _this._engineHandler.trigger('autoplay');
                _this._engineHandler.load();
            });
        },
        getAnyImage: function(){
            return this._replacementScreen;
        },
        _discoverContent: function () {
            if (!this.model) {
                this.model = new InteractiveObjectModel();
                var className = this._interactiveObject.className;
                this.model.set('className', className);
                this.model.set('altText', this._mainContainerElement.data('alt'));
                this.model.set('width', this._mainContainerElement.data('width') || "100%");
                this.model.set('heightRatio', this._mainContainerElement.data('height-ratio'));
                this.model.set('source', "");
                this.model.set('engine', $(this._interactiveObject).data('object-engine'));
                this.model.set('engineVersion', $(this._interactiveObject).data('object-engine-version'));

                if (className == 'standard-interactive-object') {
                    this.model.set('source', $(this._interactiveObject).data('object-src'));
                    this._src = this.model.get('source');
                } else if (className == 'resource-included-interactive-object') {
                    this.model.set('source', $(this._interactiveObject).children()[0]);
                }
            }
            if (this._mainContainerElement.find('.generated-engine').length > 0) {
                this._mainContainerElement.find('.generated-engine').remove();
            }
            this._engineContainerTemplate = $('<div />', {
                'class': "generated-engine",
                style: 'width: ' + this.model.get('width') + ";" + 'margin: 0 auto;',
                'aria-describedby': this.model.get('altText'),
                'aria-label': this.model.get('altText')
            });
            this._engineContainer = this._engineContainerTemplate.clone();
            if (this.model.get('heightRatio')) {
                this._engineContainer.attr('data-height-ratio', this.model.get('heightRatio'));
            }
            if (this.model.get('width')) {
                this._engineContainer.attr('data-width', this.model.get('width'));
            }
            if (this.model.get('engineVersion')) {
                this._engineContainer.attr('data-version', this.model.get('engineVersion'));
            }

            if (this._replacementScreen) {
                this._engineContainer.append($(this._replacementScreen).clone());
            }
            //this._mainContainerElement.append(this._engineContainer);
            try {
                this._currentClazz = this.ENGINES(this.model.get('engine'));
                this._engineHandler = new this._currentClazz({source: this.model.get('source'), destination: this._engineContainer, params: this.model.toJSON(), parentOptions: this.options});
                if(this._engineHandler.hasOwnLoadedRule()){
                    this.fullyLoaded = function(){};
                    this.listenTo(this._engineHandler, 'fullyLoaded', function(){
                        this.trigger('fullyLoaded');
                    });
                }
            } catch (err) {
                console.error(err);
            }

        },
        setRoles: function (roles) {
            this.roles = roles;
        },
        avatarConfig: function(){
            return this._engineHandler.avatarConfig();
        },
        _licenseUrl: function () {
            if (this._src) {
                return Base.prototype._licenseUrl.apply(this);
            } else {
                if (this._engineHandler && this._engineHandler.license) {
                    return this._engineHandler.license();
                }
            }
            return { type: 'object', src: { license: 'brak' }}
        },

        load: function () {
            var children = this._engineContainer.children();
            console.log(" WOMIInteractiveObjectContainer load children: ", children);
            if (children.length == 0 || (children.length == 1 && this._replacementScreen)) {
                this._engineHandler.setRoles(this.options.roles);
                this.options.roles.autoplay && this._engineHandler.trigger('autoplay');
                this._engineHandler.load();

            }
        },
        dispose: function () {
            this._engineHandler.dispose();
        },
        enterFS: function() {
            this._engineHandler.enterFS();
        },
        _resize: function () {
            var _this = this;
            if (this._engineHandler._reprocess) {
                return function () {
                    _this._engineHandler._reprocess();
                }
            }
            return function () {
            };
        },
        _recalculate: function(){
           if (this._engineHandler.recalculate) {
               this._engineHandler.recalculate();
           }
        },
        getWomiManageButtons: function () {
            return this._engineHandler.getButtons();
        },
        hasFullscreenItem: function () {
            return this._engineHandler.hasFullscreen();

        },
        contextCallback: function () {
            this.hasFullscreenItem = function () {
                return true;
            };
            this.parent.trigger('openContext');
        },
        _scaleElement: function (srcwidth, srcheight) {
            var props = $.fancybox.defaults;
            props.margin = 1;
            props.padding = 1;
            var offset = 2 * props.margin + 2 * props.padding;
            var result = { width: 0, height: 0, fScaleToTargetWidth: true };
            var targetWidth = $(window).width() - offset;
            var targetHeight = $(window).height() - offset;
            var fLetterBox = true;
            if ((srcwidth <= 0) || (srcheight <= 0) || (targetWidth <= 0) || (targetHeight <= 0)) {
                return result;
            }

            // scale to the target width
            var scaleX1 = targetWidth;
            var scaleY1 = (srcheight * targetWidth) / srcwidth;

            // scale to the target height
            var scaleX2 = (srcwidth * targetHeight) / srcheight;
            var scaleY2 = targetHeight;

            // now figure out which one we should use
            var fScaleOnWidth = (scaleX2 > targetWidth);
            if (fScaleOnWidth) {
                fScaleOnWidth = fLetterBox;
            }
            else {
                fScaleOnWidth = !fLetterBox;
            }

            if (fScaleOnWidth) {
                result.width = Math.floor(scaleX1);
                result.height = Math.floor(scaleY1);
                result.fScaleToTargetWidth = true;
            }
            else {
                result.width = Math.floor(scaleX2);
                result.height = Math.floor(scaleY2);
                result.fScaleToTargetWidth = false;
            }
            if (targetWidth < result.width) {
                result.width = targetWidth;
            }
            if (targetHeight < result.height) {
                result.height = targetHeight;
            }

            return result;
        },
        closeButtonConfigure: function () {
            $('div.fancybox-overlay').addClass('fullscreen-background');
            // $('div.fancybox-skin').css('background', 'none');
            var fancyBoxClose = $('a.fancybox-close');
            fancyBoxClose.addClass('fullscreen-close-image');
            fancyBoxClose.addClass('hastip');
            fancyBoxClose.attr('title', 'Zamknij');
            fancyBoxClose.tooltipsy({
                alignTo: 'element',
                offset: [-1, 1]
            });
            fancyBoxClose.click(function () {
                $('div.tooltipsy').remove();
            });
        },
        getFSElement: function () {
            var parentDiv = this._mainContainerElement.clone();
            var cloned = parentDiv.find('.generated-engine');
            cloned.css('visibility', 'visible');
            cloned.children().remove();
            if (this._replacementScreen) {
                cloned.append($(this._replacementScreen).clone());
            }
            //set dimensions with ratio
            var elementWithSize = this._engineContainer.find('.proper-element');
            if (elementWithSize.length == 0) {
                elementWithSize = this._engineContainer;
            }

            var src = this.model.get('source');
            if (typeof this.model.get('source') !== 'string') {
                src = $(this.model.get('source')).clone()[0];
            }
            var _this = this;

            function adjustSize(width, height) {
                var dimensions = _this._scaleElement(width, height);
                cloned.width(dimensions.width);
                cloned.height(dimensions.height);
            }

            return {element: parentDiv,
                options: {
                    scrolling: 'hidden',
                    helpers: {
                        overlay: {
                            locked: isTouch
                        }
                    }
                },
                afterLoad: function () {
                    //$('.fancybox-overlay').css('height', $(window).height());
                    var toLoad = new _this._currentClazz({source: src, destination: cloned, params: _this.model.toJSON()});

                    this.toLoad = toLoad;
                    toLoad.setFullScreenMode();
                    var size = toLoad.getSize();
                    adjustSize(size.width, size.height);
                    _this._engineHandler.enterFS();
                    toLoad.load();
                    if (!_this.roles.context) {
                        //according to new requirements, do not disable in-page womi when FS run
                        //_this.dispose();
                        //_this.load();
                        //_this.enterFS();
                    }

                    _this.closeButtonConfigure();

                },
                reload: function () {
                    this.toLoad.dispose();
                    this.afterLoad();
                },
                afterClose: function () {
                    _this._engineHandler.closeFS();
                }
            };
        }
    });

    return InteractiveObjectContainer;
});