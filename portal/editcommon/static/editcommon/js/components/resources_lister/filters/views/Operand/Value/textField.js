define([
    'jquery',
    'underscore',
    'backbone',
    './Value'
], function(
    $,
    _,
    backbone,
    ValueView
) {

    return ValueView.extend({

        postInitialize: function(params) {
            this.$value = $('<input>').addClass('model-value');
        }
    
    });

});
