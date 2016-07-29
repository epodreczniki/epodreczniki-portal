define(['jquery',
    'underscore',
    'backbone',
    './MetaView',
    'text!../templates/ModuleMetaViewTemplate.html',
], function ($, _, Backbone, MetaView, ModuleMetaViewTemplate) {
    return MetaView.extend({
        template: ModuleMetaViewTemplate,

        initialize: function (options) {
            this.collection = options.collection;
//            this.listenTo(this.collection, 'change:metadata', this.metadataChanged);
            this.render();
        },

        formatOutput: function() {
            this.$el.find('input').attr('disabled', this._disabled);
            this.$el.find('select').attr('disabled', this._disabled);
            this.$el.find('button').attr('disabled', this._disabled);
            $('#editcoll-moduleViewButton').attr('disabled', false);
            $('#editcoll-moduleEditButton').attr('disabled', false);
            $('#editcoll-modulePageButton').attr('disabled', false);
        }

    });
});
