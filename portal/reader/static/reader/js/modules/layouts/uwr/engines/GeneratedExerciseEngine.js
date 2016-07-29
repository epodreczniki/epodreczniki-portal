define(['require', 'jquery', 'bowser', 'backbone', 'modules/core/engines/GeneratedExerciseEngine'], function (require, $, bowser, Backbone, EngineInterface) {

    return EngineInterface.extend({
        _calcDimensions: function (isAvatar) {
            if (isAvatar) {
                return {
                    height: $(this._womiContainer()).height(),
                    width: $(this._womiContainer()).width()
                };
            }

            var hR = this._opts.heightRatio;
            var tile = this.destination.closest('.tile');
            var dimensions = {
                width: $(this.destination).width(),
                height: $(this.destination).width() * (hR ? hR : 1)
            };

            if (this.fsMode) {
                dimensions = {
                    width: $(window).width() - 25,
                    height: $(window).height() - 25
                }
            }

            return dimensions;
        }
    });
});