define([
    'jquery',
    'underscore',
    'backbone',
    'EpoAuth'
], function(
    $,
    _,
    Backbone,
    EpoAuth
){
    return Backbone.View.extend({
        initialize: function() {

            this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function (data) {
                this.remove();
            }.bind(this));

            EpoAuth.ping();
        },

        render: function() {
            var $overlay = $('<div>', {
                id: 'profile-overlay',
                html: 'Witam serdecznie'
            });

            $('body').append($overlay);

            return this;
        },

        remove: function() {
            $('#profile-overlay').remove();
            Backbone.View.prototype.remove.apply(this, arguments);
        }

    })
})
