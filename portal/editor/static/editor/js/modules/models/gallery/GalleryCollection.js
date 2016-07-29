define(['backbone', 'underscore', './Gallery'], function (Backbone, _, Gallery) {
    return Backbone.Collection.extend({
        model: Gallery,
        localStorage: new Backbone.LocalStorage("editor-gallery-collection"),
        toExportedJSON: function (options) {
            return this.map(function (model) {
                return model.toExportedJSON(options);
            });
        }
    });
});
