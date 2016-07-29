define(['modules/core/womi/WOMIAudioContainer'], function (WOMIAudioContainer) {
    return WOMIAudioContainer.extend({
        load: function() {
            WOMIAudioContainer.prototype.load.apply(this);
            this.on('renderDone', function () {
                var womi = this._mainContainerElement.closest('.womi-container');
                womi.find('.title').insertBefore(womi.find('.caption'));
            });
        }
    });
});