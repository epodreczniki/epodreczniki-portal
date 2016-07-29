define(['backbone', 'underscore', './GalleryItem'], function (Backbone, _, GalleryItem) {
    return Backbone.Collection.extend({
        model: GalleryItem,

        initialize: function(models, options){
            this.localStorage = new Backbone.LocalStorage("editor-gallery-items-collection-" + options.id);
        },
        toExportedJSON: function (options) {
            return this.map(function (model) {
                return model.toExportedJSON(options);
            });
        }
    });
});
