define(['_jquery',
    'backbone',
    '../views/QAlist',
    '../views/GenericQAView'], function($, Backbone, QAList, GenericQAView) {

        'use strict';
            
        return GenericQAView.extend({
            
            addOne: function(model) {
                var newView = new QAList.SingleAnswer( {model:model} );
                this.$el.append(newView.render().el);
            }

        });
        
});