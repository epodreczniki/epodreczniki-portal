define(['jquery', 'backbone', 'underscore'], function ($, Backbone, _) {

    return Backbone.View.extend({
        reload: function(placeholder, options){

        },

        runOnTriggers: [],

        runOn: function(placeholder, options){
            if(_.indexOf(this.runOnTriggers, options.runOn) >= 0){
                this.reload(placeholder, options);
            }
        }
    });
});