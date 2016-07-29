define(['backbone'], function(Backbone){
   return Backbone.Model.extend({
       defaults: {
           x: 0,
           y: 0,
           a: 1,
           xPos: 0,
           yPos: 0,
           realA: 200 //px
       },

       cssValues: function(){
           return {
               x: (this.get('x') - 1) * this.get('a'),
               y: (this.get('y') - 1) * this.get('a'),
               a: this.get('a')
           }
       }
   });
});