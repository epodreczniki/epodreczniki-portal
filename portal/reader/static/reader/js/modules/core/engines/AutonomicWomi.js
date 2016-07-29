define(['require', 'jquery', 'bowser', 'backbone', './EngineInterface'], function (require, $, bowser, Backbone, EngineInterface) {

    return EngineInterface.extend({
        load: function () {
            if (this._loaded) {
                return
            }
            this.destination.height(40);
            this._loaded = true;
            var a = $('<a class="play-n-learn-btn">');
            var _this = this;
            require(['reader.api'], function (ReaderApi) {
                var ra = new ReaderApi(null, false, _this.source);

                var mainUrl = window.location.origin;
                //TODO better preview resolving
                if ($('.watermark').length > 0 || window.location.pathname.indexOf('preview') > -1) {
                    mainUrl += '/preview'
                }
                mainUrl += '/reader/c/' + ra.collectionId + '/v/' + ra.collectionVersion + '/t/' + ra.collectionVariant;
                mainUrl += '/m/' + ra.moduleId + '/auto/w/' + ra.womiId + '/wv/1';


                a.attr('href', mainUrl);
                a.text('BAW SIĘ I UCZ');
            });

            this.destination.append(a);
        },
        hasFullscreen: function () {
            return false;
        }
    });
});