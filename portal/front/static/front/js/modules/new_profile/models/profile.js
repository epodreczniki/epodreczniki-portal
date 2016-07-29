define([
  'underscore',
  'backbone'
], function(_, Backbone){
    var ProfileModel = Backbone.Model.extend({
        defaults: {}
    });

    return ProfileModel;
});