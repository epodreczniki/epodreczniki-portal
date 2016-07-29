define(['backbone', 'underscore', './CacheModel'], function(Backbone, _, CacheModel){
   return Backbone.Collection.extend({
       model: CacheModel
       //localStorage: new Backbone.LocalStorage("editor-cache")
   });
});
