define([
    'underscore',
    'backbone',
    '../models/profile'
], function(_, Backbone, ProfileModel){
    var ProfileCollection = Backbone.Collection.extend({
        model: ProfileModel
});
return ProfileCollection;
});