define([
    'jquery', 
    'underscore', 
    'backbone', 
], function(
    $, 
    _, 
    backbone
){

    return backbone.View.extend({

        className: 'filter-item',

        events: {
            'change .model-value': 'setFilterValue'
        },

        initialize: function(opts) {
           this.opts = opts || {};
           this.model = this.opts.operand;

           this.postInitialize(opts);
           this.render();
        },

        postInitialize: function(opts) {},

        render: function() {},

        renderFilterValue: function() {
            var value = this.model.get('value').join(" ");
            this.$(".model-value").val(value);
        },

        setFilterValue: function(ev) {
            var selectedValues = this.$('.model-value').val().split(" ");
            this.model.set('value', selectedValues);
        }

    });

});

