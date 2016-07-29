define(['backbone', 'underscore', './GridElement'], function(Backbone, _, GridElement){
   return Backbone.Collection.extend({
       model: GridElement
   });
});
