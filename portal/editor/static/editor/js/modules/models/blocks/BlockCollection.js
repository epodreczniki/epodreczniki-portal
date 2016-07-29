define(['backbone', 'underscore', './Block'], function (Backbone, _, Block) {
    return Backbone.Collection.extend({
        model: Block,
        localStorage: new Backbone.LocalStorage("editor-blocks-collection"),
        toExportedJSON: function (options) {
            return this.map(function (model) {
                return model.toExportedJSON(options);
            });
        },
        fullJSON: function (options) {
            return this.map(function (model) {
                return model.fullJSON(options);
            });
        }
    });
});
