define(['jquery',
    '../../Component',
    'underscore',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    'modules/layouts/default/components/Tiles',
    './includes/collapsex',
    'layout'], function ($, Component, _, Logger, Utils, Tiles, collapsex, layout) {
    return Component.extend({
        name: 'TOC',
        elementSelector: '[data-component="table-of-contents"]',

        postInitialize: function(options){
            this.listenTo(this._layout, 'hideTOC', function () {
            });

        },

        closeToc: function() {
            $('.toc-dropdown').removeClass('shown').attr('aria-hidden', 'true');
            $('.toc-dropdown button, .toc-dropdown a, .toc-scrollable-area').attr('tabindex','-1');
            // needed to hide invisible toc elements from focus
        },

        load: function () {
            var _this = this;

            collapsex.ready();

            var base = $('#module-base');

            this.listenTo(this._layout, 'moduleLoadingStart', function (state) {
                var module = state.moduleElement;

                _this.showIfCollapsed(module);

                if (!state.click) {
                    _this.scrollTableOfContentsTo(module);
                }
            });

            $('.toc-close').on('click', function() {
                this.closeToc();
            }.bind(this));

            this.listenTo(this._layout, 'gridClicked', function () {
                this.closeToc();
            });

            $.fn.scrollTo = function (target, options, callback) {
                if (typeof options == 'function' && arguments.length == 2) {
                    callback = options;
                    options = target;
                }

                var settings = $.extend({
                    scrollTarget: target,
                    offsetTop: 50,
                    duration: 10,
                    easing: 'swing'
                }, options);

                return this.each(function () {
                    var scrollPane = $(this);
                    var scrollTarget = (typeof settings.scrollTarget == "number") ? settings.scrollTarget : $(settings.scrollTarget);
                    var scrollY = (typeof scrollTarget == "number") ? scrollTarget : scrollTarget.offset().top + scrollPane.scrollTop() - settings.offsetTop;
                    scrollPane.animate({scrollTop: scrollY }, settings.duration, settings.easing, function () {
                        if (typeof callback == 'function') {
                            callback.call(this);
                        }
                    });
                });
            };

            var modules = $('.module-a');

            modules.click(function () {
                if($('.collapse-tiles').length > 0){
                    $('.collapse-tiles').remove();
                }
                if ($(this).hasClass('link-active')) { // EPP-7469
                    location.hash = $('.pagination-page:first > div').first().attr('id');
                }
                return $(this).loadModule(true);
            });

            var moduleIdx = 0;

            modules.each(function (index, element) {
                if ($(element).data('module-id') == base.data('module-id')) {
                    $(element).addClass(Utils.activeClass);
                    moduleIdx = index;
                    //makeBreadcrumbs(element);
                    return false;
                }
                return true;
            });

            var activeElement = $('.' + Utils.activeClass);
            var parent = $('#table-of-contents').find('[data-toc-path=' + activeElement.attr('data-toc-parent-path') + ']');
            if (parent.length != 0 && parent[0].hasAttribute('data-attribute-panorama-womi-id')) {
                this.trigger('initSpace', [activeElement.attr('data-toc-parent-path'),
                    Number(activeElement.attr('data-attribute-panorama-order') - 1),
                    parent.attr('data-attribute-panorama-womi-id'),
                    Utils.collectTilesDummies(parent)]);
            }

            var deps = $(modules[moduleIdx]).data('dependencies-url');
            $(document).ready(function () {
                _this._layout.getKernel().trigger('moduleLoaded', {
                    moduleElement: modules[moduleIdx],
                    href: Utils.fullHrefToCurrentModule(),
                    dependencies: deps});
            });

            this.listenTo(this._layout, 'moduleWomiLoaded', function () {
                if (!$('.toc-dropdown').hasClass('shown')) {
                    $('.toc-dropdown button, .toc-dropdown a, .toc-scrollable-area').attr('tabindex','-1');
                }
                // needed to hide invisible toc elements from focus
            });
            this.listenTo(this._layout, 'moduleLoaded', function () {
                if (!$('.toc-dropdown').hasClass('shown')) {
                    $('.toc-dropdown button, .toc-dropdown a, .toc-scrollable-area').attr('tabindex','-1');
                }
                // needed to hide invisible toc elements from focus
            });


        },

        scrollTableOfContentsTo: function (element) {
            if (element == null) {
                return;
            }

            //var area = $('.scrollable-area');
            var area = $('.toc-scrollable-area');

            if (area.data('jsp')) {
                var api = area.data('jsp');
                api.scrollToElement(element);
            } else {
                area.scrollTo(element, {offsetTop: area.offset().top + 10});
            }
        },

        showIfCollapsed: function (moduleElement) {
            $('.collapse-x').each(function (index, element) {
                var found = false;

                if ($(element).has(moduleElement).length) {
                    found = true;
                }

                if ($(element).attr('id') != 'index-menu') {
                    if (found && !$(element).hasClass('in-x')) {
                        $(element).collapsex('show');
                    }
                }
            });
        }
    })
});
