define(['modules/core/womi/WOMIMovieContainer'], function (WOMIMovieContainer) {
    return WOMIMovieContainer.extend({
        load: function() {
            WOMIMovieContainer.prototype.load.apply(this);
            this.on('renderDone', function () {
                var womi = this._mainContainerElement.closest('.womi-container');
                womi.find('.title').insertBefore(womi.find('.caption'));
            });
        }
    });
});