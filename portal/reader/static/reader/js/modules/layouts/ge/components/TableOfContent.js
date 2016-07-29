define(['jquery',
    '../../Component',
    'underscore',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    '../GeUtils',
    'modules/layouts/default/components/Tiles',
    'layout'], function ($, Component, _, Logger, Utils, GeUtils, Tiles, layout) {

    return Component.extend({
        name: 'TOC',
        elementSelector: '[data-component="table-of-contents"]',

        tableOfContentsLevel2: '#table_of_contents_2',

        postInitialize: function (options) {
            var _this = this;
            this.sidebarVisible = false;

            if((navigator.userAgent.match(/iPad/))||(navigator.userAgent.match(/iPhone/))){
                $('.table-of-contents-ge').css('padding-top', '17px');
                $('home-btn').css('top', '-6px');
            }

            if((navigator.userAgent.match(/iPad/))||(navigator.userAgent.match(/iPhone/))){
                $('.table-of-contents-ge').css('padding-top', '17px');
                $('home-btn').css('top', '-6px');
            }

            if(navigator.userAgent.match(/Trident/)){
                $('.table-of-contents-ge').css('background', 'none');

                $('.table-of-contents-ge').wrap("<div class='toc-ge-ie-wrapper'></div>");
                //$('.toc-ge-ie-wrapper').width( 0 );

                $('.table-of-contents-ge').find('.home-btn').addClass('home-btn-ie');

                $('#index-menu').addClass('index-menu-ie');

                this._setHeight(this.tableOfContentsLevel2);

                this.listenTo(this._layout, 'windowResize', function () {
                    _this._setHeight(_this.tableOfContentsLevel2);
                });

                $('.table-of-contents-ge').height(0);
            }
        },

        events: {
            "click .table-of-content-ge-toggle": "toggleSidebar"
        },

        _setHeight: function (tocId) {
            var maxCount = _.max([$('#table_of_contents_1 > li').length, $(tocId+' > li').length]);
            var w = $(window).width();
            var minHeight;
            if ( w < 1279 ) {
                 minHeight = 120 + (maxCount * 60);
            } else if ( w > 1279 && w < 1440 ) {
                 minHeight = 130 + (maxCount * 70);
            } else {
                 minHeight = 150 + (maxCount * 85);
            }
            $(tocId).css('min-height', minHeight);
        },

        load: function () {
            var _this = this;

            var base = $('#module-base');
            var moduleIdx;

            this.listenTo(this._layout, 'moduleLoadingStart', function (state) {
                var module = state.moduleElement;
            });

            this.listenTo(this._layout, 'navHideDisplay', function () {
                _this.$el.hide();
            });
            this.listenTo(this._layout, 'navShowDisplay', function () {
                _this.$el.show();
            });

            var modules = $('.module-a');

            modules.click(function () {
                return $(this).loadModule(true);
            });

            modules.each(function (index, element) {
                if ($(element).data('module-id') == base.data('module-id')) {
                    $(element).addClass(Utils.activeClass);
                    moduleIdx = index;
                    return false;
                }
                return true;
            });

            var activeElement = $('.' + Utils.activeClass);

            this.specificTOC(activeElement);

            var parent = $('#table-of-contents').find('[data-toc-path=' + activeElement.attr('data-toc-parent-path') + ']');


            if (parent.length != 0 && parent[0].hasAttribute('data-attribute-panorama-womi-id')) {
                this.trigger('initSpace', [activeElement.attr('data-toc-parent-path'),
                    Number(activeElement.attr('data-attribute-panorama-order') - 1),
                    parent.attr('data-attribute-panorama-womi-id'),
                    Utils.collectTilesDummies(parent)]);
            }

            this._layout.components.topbar.setBreadcrumbs(parent);

            var deps = $(modules[moduleIdx]).data('dependencies-url');
            $(document).ready(function () {
                var params = {
                    moduleElement: modules[moduleIdx],
                    href: Utils.fullHrefToCurrentModule(),
                    dependencies: deps
                };
                _this._layout.getKernel().trigger('moduleLoadingStart', params);
                _this._layout.getKernel().trigger('moduleLoaded', params);
                _this._layout.getKernel().trigger('moduleLoadingEnd', params);
            });

        },

        specificTOC: function (active) {
            var collapsibleElements = $('.toc-book-index-content a');//$('[data-toggle=collapse-x]');

            var allLessonBlocks = [];

            var _this = this;

            collapsibleElements.each(function () {
                var t = $(this);
                // TODO set >= 3

                if (t.text().length > 0) {
                    //t//.attr('title', t.text())
                    // .addClass('hastip');
                    //
                }

                if ((t.data('toc-path') + '').split('_').length == 3) {
                    var target = t.data('target');

                    t.parent().append(_this.addGETip(t, 'Two'));

                    $(target).hide();
                    t.data('target', '');
                    t.off('click');
                    var first = $(target).find('.module-a').first();
                    var parent = GeUtils.getParentOfElement($(t));
                    if (first.length == 0) {
                        $(t).addClass('disabled-subcoll');
                        $(parent).addClass('half-disabled-subcoll');
                    } else {
                        $(parent).addClass('enabled-subcoll');
                        //collapsibleElements.removeClass('selected-anchor');

                        t.click(function () {
                            $($(target).find('.module-a').first()).loadModule(true);

                            //$('#table-of-contents').find('[data-toc-path=' + $(t).data('toc-parent-path') + ']').addClass('selected-anchor');
                            collapsibleElements.removeClass('selected-anchor');
                            $(t).addClass('selected-anchor');
                            $("#table-of-contents").find('[data-target=#' + $(t).attr('data-parent') + ']').addClass('selected-anchor');

                            $("[data-anchor='" + $(t).data('toc-path') + "']").fadeOut();

                            _this._layout.components.topbar.setBreadcrumbs(t);
                        });
                    }
                }

                var activeLesson = $('#table-of-contents').find('[data-toc-path=' + active.attr('data-toc-parent-path') + ']').addClass('selected-anchor');
                $('#table-of-contents').find('[data-toc-path=' + activeLesson.attr('data-toc-parent-path') + ']').addClass('selected-anchor');

                if ((t.data('toc-path') + '').split('_').length == 2) {

                    var target = t.data('target');

                    t.parent().append(_this.addGETip(t, 'One'));

                    var trg = $(target);
                    allLessonBlocks.push(trg);
                    t.data('target', '');
                    t.off('click');
                    trg.hide();
                    if (trg.has(active).length) {
                        trg.show();
                    }
                    t.click(function () {
                        t.parent("li").siblings().children("a").removeClass('selected-anchor');
                        t.addClass('selected-anchor');
                        _.each(allLessonBlocks, function (block) {
                            if (block != trg) {
                                block.hide();
                            } else {
                                block.show();
                            }
                        });
                        if(navigator.userAgent.match(/Trident/)) {
                            setTimeout(function(){
                                _this.tableOfContentsLevel2 = target;
                                _this._setHeight(target);
                            }, 2000);
                        }
                    });
                }
                if (t.data('attribute-icon-womi-id')) {
                    t.css('background-image', 'url(/content/womi/' + t.data('attribute-icon-womi-id') + '/icon.svg)')
                }

            });
            
            // Just to prevent the flash of unstyled table of content.

            $('.table-of-contents-ge').show();
            if ( active.data('toc-path') ) {
                var validPath = active.data('toc-path').split('_')[0];
                $('ul a[data-toc-parent-path]').each(function (index, element) {
                    var p = $(element).data('toc-parent-path');
                    if (('' + p).split('_').length == 1 && p != validPath) {
                        $(element).hide();
                    }
                });
            }

        },

        addGETip: function(t, type) {

            var tip = $('<div>', {
                class: 'GE-Tip GE-Tip-' + type,
                html: t.attr('title'),
                style: 'display: none',
                'data-anchor': t.attr('data-toc-path')
            });

            return tip

        },

        hideSidebar: function (ev) {

            if (this.sidebarVisible) {
                $('.table-of-contents-ge').removeClass('ge-toc-scrollable').addClass('hidden-ge-toc',
                    {duration: 600, complete: function() {$('.toc-scrollable-area').hide();}});
                if(navigator.userAgent.match(/Trident/)) {
                    $('.table-of-contents-ge').height(0);
                    $('.toc-ge-ie-wrapper').removeClass('toc-ge-ie-wrapper-expanded', {duration: 600});
                }
                this.sidebarVisible = false;
                $('.arrow-navigation-left').show();
                $('.womi-avatar').css('z-index', '0');
            }

        },

        toggleSidebar: function (ev) {
            var toc = $('.table-of-contents-ge');
            if (this.sidebarVisible) {
                if(navigator.userAgent.match(/Trident/)) {
                    toc.height(0);
                    $('.toc-ge-ie-wrapper').removeClass('toc-ge-ie-wrapper-expanded', {duration: 600});
                }
                toc.removeClass('ge-toc-scrollable').addClass('hidden-ge-toc',
                    {duration: 600, complete: function() {$('.toc-scrollable-area').hide();}});
                $('.arrow-navigation-left').show();
                $('.womi-avatar').css('z-index', '0');
            }
            else {
                $('.toc-scrollable-area').show();
                if(navigator.userAgent.match(/Trident/)) {
                    toc.height('100%');
                    toc.addClass('toc-ie-expanded');
                    $('.toc-ge-ie-wrapper').addClass('toc-ge-ie-wrapper-expanded', {duration: 600});
                }
                toc.removeClass('hidden-ge-toc',
                    {duration: 600, complete: function() {toc.addClass('ge-toc-scrollable')}});
                this._layout.components.topbar.changeElemState('Hide');
                $('.arrow-navigation-left').hide();
                $('.womi-avatar').css('z-index', '-1');
            }

            this.sidebarVisible = !this.sidebarVisible;
        }
    })
});
