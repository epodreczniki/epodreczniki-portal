define('reader.communication.api', ['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    var comm = function () {
    };
    _.extend(comm.prototype, {
        dispatcher: _.clone(Backbone.Events),
        registered: false,
        listen: function (eventName, callback) {
            this.dispatcher.on(eventName, callback);
        },
        trigger: function (eventName, value) {
            this.dispatcher.trigger(eventName, value);
        }
    });
    return new comm();
});
