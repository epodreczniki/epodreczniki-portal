define([
    'jquery',
    'underscore',
    'backbone',
    './GenericOperand',
    'velocity',
    'velocityui',
    'text!../../templates/operand_standard_base.html', 
    'text!../../templates/operand_standard_specific.html'
], function(
    $,
    _,
    backbone,
    GenericOperand,
    velocity,
    velocityui,
    operand_base,
    operand_specific
){

    return GenericOperand.extend({

        tagName: 'li',

        operand_base: _.template(operand_base),
        operand_specific: _.template(operand_specific),

        postInitialize: function() {
            this.model.on('change:field', function() {
                this.model.set('value', this.model.defaults['value']);
                this.renderFilterType(this.model.get('field'));
            }, this);
        },

        events: function() {
            return _.extend({}, GenericOperand.prototype.events, {
                'change .filter-select': 'setFilterType',
                'click .remove': 'removeFilter'
            });
        },

        render: function() {
            this.$el.html(this.operand_base({
                availableFields: this.opts.availableFields
            }));
            this.renderFilterType(this.model.get('field'));
        },

        renderFilterType: function(field) {
            this.$(".filter-select option[value='" + field + "']")
                .attr('selected', 'selected');
            this.$('.filter-value').html('')
                  .append(this.operand_specific({field: field}));
            this.renderFilterValue();
        },

        setFilterType: function(ev) {
            var selectedField = $(ev.target).val();
            this.model.set('field', selectedField);
        },

        removeFilter: function(ev) {
            //var _this = this;
            this.model.destroy()
            this.remove();
            if (ev) ev.stopPropagation();
        },

    
    });

});
