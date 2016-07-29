define([
    'jquery', 
    'underscore',
    'backbone',
    './Filter',
    'helpers/likedResults'
], function(
    $,
    _,
    backbone,
    Filter,
    liked
) {

    return Filter.extend({

        // Determinate summary string on this.
        type: 'favorites',

        defaults: {
            'name': 'Ulubione',
            'ephemeral': true
        },

        setup: function(opts) {
            Filter.prototype.setup.call(this, opts);

            var likedList = liked.get();

            this.operands.addOperand(
                {
                    'field': '_id',
                    'value': likedList,
                    'mode': 'in',
                    'hidden': true,
                }
            );

        }
    
    });

});
