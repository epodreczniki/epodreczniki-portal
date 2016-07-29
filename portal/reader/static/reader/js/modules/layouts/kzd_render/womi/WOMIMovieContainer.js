define(['modules/core/womi/WOMIMovieContainer'], function (WOMIMovieContainer) {
    return WOMIMovieContainer.extend({
        _calcWidth: function () {
            var w = this._avElement.width();
            return w;
        }
    });
});