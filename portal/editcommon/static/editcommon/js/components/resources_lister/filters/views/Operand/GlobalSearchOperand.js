define([
    'jquery', 
    'underscore', 
    'backbone',
    './GenericOperand',
    'text!../../templates/operand_search_all.html'
], function(
    $, 
    _, 
    backbone, 
    GenericOperand,
    template
){

    return GenericOperand.extend({
        
        render: function() {
            this.$el.html(_.template(template)());
            if (this.opts.operand) {
                this.renderFilterValue();
            }
            return this;
        }

    });

});
