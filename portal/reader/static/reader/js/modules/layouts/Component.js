define(['jquery', 'backbone', 'underscore', 'modules/core/Logger'], function ($, Backbone, _, Logger) {
    return Backbone.View.extend({
        name: 'Component',
        elementSelector: '#loading-indicator',
        initialize: function (options) {
            this._layout = options.layout;
            this.setElement($(this.elementSelector));
            Logger.addLogger(this);
            this.postInitialize(options);
        },

        load: function () {
        },
        postInitialize: function (options) {

        }

    })
});
