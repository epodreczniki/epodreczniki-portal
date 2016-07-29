define(['jquery',
    'underscore',
    'backbone',
    './MetaView',
    'text!../templates/MetadataViewTemplate.html'
], function ($, _, Backbone, MetaView, MetadataViewTemplate) {
    return MetaView.extend({
        template: MetadataViewTemplate,

        initialize: function (options) {
            this.collection = options.collection;
            this.listenTo(this.collection, 'change:metadata', this.metadataChanged);
            this.render();
        }

    });
});
