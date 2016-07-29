define(['jquery',
    'backbone',
    'underscore',
    'modules/layouts/Layout',
    'modules/layouts/default/components/Womi',
    'modules/layouts/uwr/womi/WOMIImageContainer',
    'modules/layouts/kzd_render/womi/WOMIMovieContainer',
    'modules/layouts/default/components/Accessibility',
    'modules/core/Registry'], function ($, Backbone, _, Layout, Womi, WOMIImageContainer, WOMIMovieContainer, Accessibility, Registry) {
    return Layout.extend({

        name: 'DefaultLayout',
        constructor: function (options) {
            Layout.prototype.constructor.call(this, options);

            this.addComponent('womiDef', Womi);
            this.addComponent('accessibility', Accessibility);

            var womi = Registry.get('womi');

            womi.WOMIMovieContainer = WOMIMovieContainer;
            womi.WOMIImageContainer = WOMIImageContainer;//.prototype.forceContainerHeight = true;

            var engines = Registry.get('engines');

            for(var engine in engines) {
                engines[engine].prototype._calcDimensions = function () {

                    var dimensions = {
                        width: $(this.destination).width(),
                        height: $(this.destination).width() * this._opts.heightRatio
                    };

                    dimensions.desiredWidth = dimensions.width;
                    dimensions.desiredHeight = dimensions.height;
                    dimensions.width = this.savedWidth || dimensions.desiredWidth;
                    dimensions.height = this.savedHeight || dimensions.desiredHeight;
                    dimensions.scale = Math.min(dimensions.desiredWidth / dimensions.width, dimensions.desiredHeight / dimensions.height);

                    return dimensions;
                }
            }

        }

    });
});