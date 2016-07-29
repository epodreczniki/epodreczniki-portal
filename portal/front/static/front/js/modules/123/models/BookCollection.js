define(['backbone','./Book'],function(Backbone,Book){
    return Backbone.Collection.extend({
        model:Book
    });
});
