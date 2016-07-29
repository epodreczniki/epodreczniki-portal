define('reader.avatar.api', ['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    var avatar = function () {
    };
    _.extend(avatar.prototype, {
        dispatcher: _.clone(Backbone.Events),
        registered: false,
        listen: function (eventName, callback) {
            this.dispatcher.on(eventName, callback);
        },
        trigger: function (eventName, value) {
            console.warn('Registered Avatar not found');
            this.dispatcher.trigger(eventName, value);
        },
        registerAvatar: function (properties) {
            this.registered = properties.registered || false;

        }
    });
    return new avatar();
});
