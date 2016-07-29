define(['backbone', 'underscore'], function (Backbone, underscore) {
    var counter = 0;
    var useLog = ('{{ EPO_READER_USE_LOGGING }}' == 'True');
    var logger = _.extend({
        initialize: function () {

        },
        addLogger: function (object, proxy) {
            this.listenTo(proxy || object, 'all', function (eventName) {
                useLog && console.log((counter++) + ' object ' + (object.name || object) + ' fires event ' + eventName);
            });
        },
        log: function (msg, object, msgIsObject) {
            var args = [];
            if (object) {
                args = [(counter++) + ' object ' + (object.name || object) + ': ' + (!msgIsObject ? msg : '')];
            } else {
                args = [(counter++) + ' ' + (!msgIsObject ? msg : '')];
            }
            msgIsObject && args.push(msg);
            useLog && console.log.apply(console, args);
        }
    }, Backbone.Events);
    return logger;
});