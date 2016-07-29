define([
    'jquery',
    'underscore',
    'backbone',
    './views/main_notes',
    './views/profile',
    /*'./views/readings'*/
    './views/main_readings',
    './views/main_progress',
    './views/main_stats',
    'EpoAuth',
    './views/main_welcome',
    './views/controller'
], function ($, _, Backbone, NotesView, ProfileView, MainReadingsView, MainProgressView, StatsView, EpoAuth, MainWelcome, ControllerView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            'start': 'defaultAction',
            'notes': 'showNotes',
            'progress': 'showProgress',
            'stats': 'showStats',
            'last': 'showLast',

            // Default
            '*actions': 'defaultAction'
        }
    });

    var initialize = function () {

        var app_router = new AppRouter;

        var controller = new ControllerView({
            router: app_router
        });

        controller.render();

        app_router.on('route:showStats', function() {
            controller.trigger('showView', 'statsView');
        });

        app_router.on('route:showNotes', function (o) {
            controller.trigger('showView', 'notesView');
        });

        app_router.on('route:showProgress', function () {
            controller.trigger('showView', 'progressView');
        });

        app_router.on('route:showLast', function () {
            controller.trigger('showView', 'readingsView');
        });

        app_router.on('route:defaultAction', function (actions) {
            controller.trigger('showView', 'notesView');
        });

        return app_router;
    };

    return {
        initialize: initialize
    };
});
