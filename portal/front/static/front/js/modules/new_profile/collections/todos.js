define([
  'underscore',
  'backbone',
  '../models/todo'
], function(_, Backbone, ToDoModel){
  var ToDoCollection = Backbone.Collection.extend({
    model: ToDoModel
  });
  return ToDoCollection;
});