define(['backbone', 'underscore', './PropertiesModel'], function(Backbone, _, PropertiesModel){
   return Backbone.Collection.extend({
       model: PropertiesModel,
       localStorage: new Backbone.LocalStorage("editor-properties")
   });
});
