define(['jquery', '../../Component'], function ($, Component) {

    return Component.extend({
        name: 'PlayAndLearn',
        postInitialize: function (options) {

            this.listenTo(this._layout, 'moduleLoaded', function (params) {
                this.playAndLearn($(params.moduleElement).data('womi-reference-play-and-learn-unbound-kind'));
            });

        },
        playAndLearn: function (womiId) {
            var btn = $('.play-and-learn');
            if (womiId) {
                var idVer = womiId.trim().split(':');
                require(['reader.api'], function (ReaderApi) {
                    var ra = new ReaderApi(null, false, '/womi/' + idVer[0] + '/' + idVer[1]);

                    var mainUrl = window.location.origin;
                    //TODO better preview resolving
                    if ($('.watermark').length > 0 || window.location.pathname.indexOf('preview') > -1) {
                        mainUrl += '/preview'
                    }
                    mainUrl += '/reader/c/' + ra.collectionId + '/v/' + ra.collectionVersion + '/t/' + ra.collectionVariant;
                    mainUrl += '/m/' + ra.moduleId + '/auto';


                    btn.click(function () {
                        window.location.href = mainUrl;
                    });
                    btn.show();
                });
            } else {
                btn.click(function () {
                    return false;
                });
                btn.hide();
            }
        }

    })

});
