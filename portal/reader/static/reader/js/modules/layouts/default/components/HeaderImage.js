define([
    'jquery',
    '../../Component',
    'tocUtils',
    'modules/core/WomiManager',
    'modules/utils/ReaderUtils'
], function ($,
             Component,
             tocUtils,
             WomiManager,
             Utils) {

    return Component.extend({

        name: 'HeaderImage',

        postInitialize: function (options) {
            this.setElement($('#main-header'));
            this.headerTitle = this.$el.find('#header-title');
            this.headerImage = this.$el.find('#header-image');

            this.handleWindowScroll();
            this.listenTo(this._layout, 'moduleLoaded', this._onModuleLoaded);
            this.listenTo(this._layout, 'selectedPage', this.switchHeader);

            this.headerImage.on('click', function (ev) {
                this.trigger('gridClicked');
            }.bind(this));
        },

        _onModuleLoaded: function(params) {
            var collectionHeaderWomi = $('#module-base').data('womi-reference-collection-header-kind');

            var moduleHeaderWomi = $(params.moduleElement).data('womi-reference-module-header-unbound-kind');
            this.hasAnyHeaderWomi = collectionHeaderWomi || moduleHeaderWomi;
            this._loadHeaderImage(moduleHeaderWomi || collectionHeaderWomi, $(params.moduleElement), moduleHeaderWomi);
            this.switchHeader({page: 1});
            this._setupTitle();
        },

        _setBackground: function (link) {
            this.headerImage.css({
                'background-repeat': 'no-repeat',
                'background-size': 'cover',
                'background-image': 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.247059) 100%), ' +
                'url("' + link + '")'
            });
        },

        _loadHeaderImage: function (womiId, moduleEl, isModuleHeader) {
            var _this = this;
            if (womiId) {
                var idVer = womiId.trim().split(':');
                var tmpEl = $('<div class="interactive-banner">');
                WomiManager.loadSingleWOMI(idVer[0], tmpEl, function (o) {
                    // TODO: find better method for checking womi type
                    if (!tmpEl.find('.interactive-object-container').length) {
                        var props = o.selected.object.getBannerProps();
                        _this._setBackground(props.url);
                    } else {
                        tmpEl.find('.alt-text-container, .title, .womi-menu').remove();
                        tmpEl.find('.play-button').click();
                        $('#header-image').css('height', 'auto').find('.module-title').wrapInner('<span>');
                        _this.$el.children('.interactive-banner').remove(); //EPP-7360
                        _this.$el.prepend(tmpEl);
                    }
                });
            } else {
                //this.$el.css('background-image', '');
                this._setBackground("{{ STATIC_URL }}reader/img/new/header_dark.png");
            }
            _this.$el.removeClass();

            var selector = 'module';
            if(isModuleHeader){
                // display header from module, if not present in module display from collection,
                // for UWR make sure to have header in module or don't call this method
            } else {
                moduleEl = $('#module-base');
                selector = 'collection';
            }

            if(moduleEl && moduleEl.data('attribute-' + selector + '-header-title-presentation')){
                _this.$el.addClass(moduleEl.data('attribute-' + selector + '-header-title-presentation'));
            }
            if(moduleEl && moduleEl.data('attribute-' + selector + '-header-title-position')){
                _this.$el.addClass(moduleEl.data('attribute-' + selector + '-header-title-position'));
            }
        },

        _setupTitle: function(){
            this.headerTitle.html('');
            this.headerTitle.append(this.moduleTitle());
        },

        switchHeader: function (params) {

            var mainHeader = this.$el;

            if(params.page != 1){
                this.headerTitle.hide();
            }else{
                this.headerTitle.show();
            }

            if (params.page == 1 && this.hasAnyHeaderWomi) {
                mainHeader.removeClass('no-header-image');
                mainHeader.addClass('with-header-image');
                $('#contentbar').removeClass('onTop underTopbar');
            }
            else {
                mainHeader.removeClass('with-header-image');
                mainHeader.addClass('no-header-image');
                // TODO: too
                $('#contentbar').removeClass('onTop').addClass('underTopbar');
            }

            console.log('Header class now: ' + mainHeader.attr('class'));
        },

        moduleTitle: function () {
            var modulePresentationTitle = Utils.getMainContentPlaceholder().find('.module-presentation-title');
            var title = tocUtils.activeModule();
            if(modulePresentationTitle.length == 1){
                title = modulePresentationTitle.html();
            }

            var element = $('<h1>', {
                class: 'module-title',
                html: title
            });
            return element;
        },

        handleWindowScroll: function () {
            $(window).scroll(function () {
                var scrollValue = $(window).scrollTop() * 0.1;
                this.headerImage.css('opacity', (100 - scrollValue) / 100);
            }.bind(this));
        }


    });

});
