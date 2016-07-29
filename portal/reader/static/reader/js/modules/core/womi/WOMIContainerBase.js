define(['jquery', 'backbone', 'underscore', 'modules/core/Registry'], function ($, Backbone, _, Registry) {
    return Backbone.View.extend({

        CLASS_MAPPINGS: function () {
            var registry = Registry.get('womi');
            return {
                'dummy': registry.DummyContainer,
                'image-container': registry.WOMIImageContainer,
                'movie-container': registry.WOMIMovieContainer,
                'audio-container': registry.WOMIAudioContainer,
                'icon-container': registry.WOMIIconContainer,
                'attachment-container': registry.WOMIAttachmentContainer,
                'interactive-object-container': registry.WOMIInteractiveObjectContainer,
                'multiple': registry.MultipleWOMIContainer
            }
        },
        avatarConfig: function(){
            return {}
        },
        initialize: function (options) {
            this.init(this.$el, options.options);
            this.parent = options.parent;
        },
        init: function (element, opts) {
            this.options = opts;
            this.roles = opts.roles || {};
            this._mainContainerElement = $(element);
            this.menuItems = [];
            this._lookForBlocks();
            this._discoverContent();
            this._load();
        },
        render: function () {
            this._mainContainerElement.remove();
            this._mainContainerElement = $('<div>', { 'class': this.containerClass });
            this.load();
            this.fullyLoaded();
            return this._mainContainerElement;
        },
        _lookForBlocks: function () {
        },
        _discoverContent: function () {
        },
        _load: function () {
        },
        load: function () {
        },
        dispose: function () {
        },
        getFSElement: function () {
            return null;
        },
        _dispatchEvent: function (message, object) {
            var ev = new CustomEvent(message, {
                detail: object,
                bubbles: true,
                cancelable: true
            });
            this._mainContainerElement[0].dispatchEvent(ev);
        },
        fullyLoaded: function(){
            this.trigger('fullyLoaded');
        },
        getMenuItems: function () {
            var _this = this;
            return [
                {
                    name: '',
                    callback: function () {
                        _this.load();
                    }
                }
            ]
        },
        postProcessMenu: function (menu) {
        },

        getWomiManageButtons: function () {
            return null;
        },
        callResize: function () {
            var slctd = this.selected;
            if (slctd && slctd.object && slctd.object._resize) {
                slctd.object._resize()();
                slctd.object.trigger('resized');
            }
        },
        callRecalculateSize: function(){
            var slctd = this.selected;
            if (slctd && slctd.object && slctd.object._recalculate) {
                slctd.object._recalculate();
                slctd.object.trigger('resized');
            }
        },
        womiCloneTo: function (node) {
            var clone = _.extend({}, this);
            clone.cid = null;
            clone._mainContainerElement = $(node);
            return clone;
        },
        getAnyImage: function() {
            return null
        },
        getMiniature: function () {
            var slctd = this.selected;
            if (slctd && slctd.object) {
                var img = slctd.object.getAnyImage();
                if (img) {
                    var cls = Registry.get('womi').WOMIImageContainer;
                    var im = new cls({el: $(img), options: slctd.object.options});
                    return im.getThumbUrl();
                }
            }
            return '';
        },
        closeButtonConfigure: function () {
            $('div.fancybox-overlay').addClass('fullscreen-background');
            $('div.fancybox-skin').css('background', 'none');
            var fancyBoxClose = $('a.fancybox-close');
            fancyBoxClose.addClass('fullscreen-close-image');
            fancyBoxClose.addClass('hastip');
            fancyBoxClose.attr('title', 'Zamknij');
            fancyBoxClose.attr('aria-label', 'Zamknij');
            fancyBoxClose.tooltipsy({
                alignTo: 'element',
                offset: [-1, 1]
            });
        },
        setRoles: function (roles) {
            this.roles = roles;
        },
        _licenseUrl: function () {
            if (this._src) {
                return { src: this._src + '/../metadata.json',
                    type: 'source' }
            }
            return ''
        },
        hasFunctionality: function () {
            return false;
        },

        hasButtons: function () {
            return false;
        },
        altText: function(){
            if(this._altText){
                return this._altText;
            }else{
                return null;
            }
        }
    });

});