define([
  'jquery',
  'underscore',
  'backbone',
  '../collections/todos',
  'text!../templates/todos/list.html'
], function($, _, Backbone, ToDosCollection, todosListTemplate){
  var ToDoListView = Backbone.View.extend({
    el: $("#todos-list"),
    render: function(){
      var data = {
        todos: this.collection.models,
        _: _
      };

      var compiledTemplate = _.template( todosListTemplate, data );
      $("#todos-list").html( compiledTemplate );
    }
  });
  return ToDoListView;
});