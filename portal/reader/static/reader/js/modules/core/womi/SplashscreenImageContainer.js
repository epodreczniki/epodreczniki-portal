define(['modules/core/womi/WOMIImageContainer'
], function (WOMIImageContainer) {

    return WOMIImageContainer.extend({

        _discoverContent: function () {
            WOMIImageContainer.prototype._discoverContent.apply(this);
            this._isEmbed = false;

        },

        initSplash: function(){
            if (this._src.substring(this._src.lastIndexOf('.')) == '.svg') {
                $(this._imgElement).css("width", "100%");
            }
            $(this._imgElement).attr('role', 'presentation');
        }
    });
});