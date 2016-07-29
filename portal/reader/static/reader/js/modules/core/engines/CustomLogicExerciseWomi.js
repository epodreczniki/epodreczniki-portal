define(['require', 'jquery', 'bowser', 'backbone', './EngineInterface'], function (require, $, bowser, Backbone, EngineInterface) {

    return EngineInterface.extend({
        load: function () {
            var _this = this;

            require([this.source], function (lib) {
                _this.obj = new lib();
                _this.obj.start(_this.destination);
            });
        },
        hasFullscreen: function () {
            return false;
        },
        _reprocess: function () {

        }
    });
});