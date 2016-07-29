define([
    'jquery',
    'underscore',
    'backbone',
    './router'
], function ($, _, Backbone, Router) {
    var initialize = function () {

        return Router.initialize();


    };

    return {
        initialize: initialize
    };
});