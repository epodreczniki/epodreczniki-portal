define([
    'underscore',
    'backbone',
    '../models/teacher'
], function(_, Backbone, TeacherModel){
    var TeacherCollection = Backbone.Collection.extend({
        model: TeacherModel
});
return TeacherCollection;
});