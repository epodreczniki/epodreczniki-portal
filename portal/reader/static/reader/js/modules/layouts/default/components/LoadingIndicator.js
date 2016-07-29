define(['jquery', '../../Component', 'underscore', 'modules/core/Logger'], function ($, Component, _, Logger) {
    return Component.extend({
        name: 'LoadingIndicator',
        elementSelector: '#loading-indicator',

        load: function () {
            var _this = this;
            this.listenTo(this._layout, 'moduleLoadingStart', function () {
                _this.addLoadingIndicator();
            });

            this.listenTo(this._layout, 'moduleLoadingEnd', function () {
                _this.removeLoadingIndicator();
            })
        },

        addLoadingIndicator: function () {
            var readerContent = this._layout.components.grid.contentPlaceholder();
            Logger.log('loading indicator start', this);

            this.$el.width(readerContent.outerWidth())
                .height($(window).height())
                .activity({segments: 12, height: 1});
        },

        removeLoadingIndicator: function () {
            this.$el.activity(false).width(1).height(1);
            Logger.log('loading indicator end', this);
        }
    })
});