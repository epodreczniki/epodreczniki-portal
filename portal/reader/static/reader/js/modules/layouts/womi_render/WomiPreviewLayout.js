define(['jquery',
    'backbone',
    'underscore',
    'modules/layouts/Layout',
    'modules/layouts/default/components/Womi',
    'modules/core/womi/embed/WOMIMovieContainer',
    'modules/layouts/default/components/Accessibility',
    'modules/core/Registry'], function ($, Backbone, _, Layout, Womi, WOMIMovieContainer, Accessibility, Registry) {
    return Layout.extend({

        name: 'DefaultLayout',
        constructor: function (options) {
            Layout.prototype.constructor.call(this, options);

            this.addComponent('womiDef', Womi);
            this.addComponent('accessibility', Accessibility);

            Registry.get('womi')['WOMIMovieContainer'] = WOMIMovieContainer;
        }
    });
});