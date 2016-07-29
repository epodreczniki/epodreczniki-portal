define(['backbone', 'underscore', './CollectionModel'], function (Backbone, _, CollectionModel) {
    return Backbone.Collection.extend({
        model: CollectionModel,
        localStorage: new Backbone.LocalStorage("editcoll-collectionmodel")
    });
});
