define(['require', 'jquery', 'bowser', 'backbone', './EngineInterface'], function (require, $, bowser, Backbone, EngineInterface) {
    return EngineInterface.extend({
        LIMIT_WIDTH: 948,
        load: function () {
            var _this = this;
            require(['modules/womi_exercise'], function (engine) {
                var obj = new engine({source: _this.source, destination: _this.destination});
                _this.obj = obj;
                obj.start();
            });
        },
        hasFullscreen: function () {
            return false;
        },
        _reprocess: function () {
            this.obj && this.obj.resize();
        },
        getSize: function () {
            return {
                width: ($(window).width() < this.LIMIT_WIDTH ? $(window).width() : this.LIMIT_WIDTH),
                height: $(window).height()
            }
        }
    });
});