define(['jquery', '../../default/components/LoadingIndicator', 'underscore', 'modules/core/Logger', 'modules/core/WomiManager'], function ($, Component, _, Logger, WomiManager) {
    return Component.extend({

        load: function () {
            var _this = this;
            this.listenTo(this._layout, 'moduleLoadingStart', function () {
                _this.addLoadingIndicator();
            });

            this.listenTo(WomiManager.womiEventBus, 'allWomiLoaded', function () {
                _this.removeLoadingIndicator();
            });

            this.$el.click(function(){
                Logger.log('pass loading clicking', this);
            })
        },

        addLoadingIndicator: function () {
            Logger.log('loading indicator start', this);

            this.$el.width($(window).width())
                .height($(window).height())
                .activity({segments: 12, length: 20, space: 40, width: 20, color: '#3CA06E'});
        }
    })
});