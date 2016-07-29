define(['modules/core/Registry',
    'modules/core/ReaderKernel',
    //'modules/layouts/ge/geConfigLoader',
    'modules/layouts/ge/GeLayout',
    'jquery'
], function (Registry, ReaderKernel, DefaultLayout, jquery) {

    if (!Registry.get('kernel')) {
        var kernel = new ReaderKernel();
        Registry.set('kernel', kernel);
    }

    if (!Registry.get('layout')) {
        var defaultLayout = new DefaultLayout({kernel: kernel});
        Registry.set('layout', defaultLayout);
    }

    if ('{{ EPO_GE_GETJSON_OVERRIDE }}' === 'True') {
        jquery.getJSON = function (url, data, success) {
            var returnObj = {
                error: function (errCallback) {
                    this.errCallback = errCallback
                },
                complete: function (compCallback) {
                    this.compCallback = compCallback
                }
            };
            returnObj.fail = returnObj.error;
            returnObj.done = returnObj.complete;
            require(['json!' + url], function (json) {
                data(json);
                returnObj.compCallback && returnObj.compCallback();
            }, function (err) {
                console.log('err', err);
                returnObj.errCallback && returnObj.errCallback({e: err, type: 'error'});
            });

            return returnObj;

        };
    }
});
