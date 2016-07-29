define([
    'jquery',
    'underscore',
    'backbone'
], function(
    $,
    _,
    backbone
) {

    return backbone.View.extend({

        className: 'value',

        initialize: function(params) {
            this.operand = params.operand;

            this.postInitialize(params);

            this.listenTo(this.operand, 'destroy', this.remove);
        },

        events: {
            'change .model-value': 'setValue',
        },

        render: function() {
            if (this.operand.get('value').length) {
                this.$value.val(this.operand.get('value').join(" "));
            };

            this.$el.html(this.$value);

            this.postRender();

            return this;
        },

        postRender: function() {},

        setValue: function() {
            var value = this.$value.val();
            // TODO: Not so nice hack, need to repair It.
            value = value.trim().length ? value.split(' ') : [];
            this.operand.set('value', value);
        }

    });

});
