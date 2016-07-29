define(['jquery',
    'backbone',
    '../../default/components/Tiles',
    'modules/core/HookManager',
    'modules/core/WomiManager'], function ($, Backbone, Tiles, HookManager, WomiManager){

    'use strict';

    return Tiles.extend({
        opts: {
            pixelsBetweenTiles: 0
        },
        postInitialize: function (options) {
            Tiles.prototype.postInitialize.call(this, options);
            HookManager.addHook('avatarCreatedHook', function(container, config){
                $(container).closest('.tile').css({
                    overflow: 'visible'
                });
                $(container).css({
                    overflow: 'visible'
                });
            });

            var _this = this;
            this.listenTo(this._layout, 'userTypeSelect', function() {
                _this.newTiles.positionElements();
                WomiManager.recalculateAll();
            });
        }
    })
});