define(['jquery', 'underscore', 'backbone', '../BlockView'], function ($, _, Backbone, BlockView) {
    return {
        view: BlockView.extend({}),
        callbacks: {
            stateLoaded: function (grid) {
            },

            stateUnloaded: function (grid) {
            }
        }
    };

});