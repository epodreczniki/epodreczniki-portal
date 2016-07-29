define([
  'underscore',
  'backbone'
], function(_, Backbone){
    var TeacherModel = Backbone.Model.extend({
        defaults: {}
    });

    return TeacherModel;
});