define(['jquery',
    'underscore',
    'backbone',
    './MetaView',
    'text!../templates/SubcollectionMetaViewTemplate.html'
], function ($, _, Backbone, MetaView, SubcollectionMetaViewTemplate) {
    return MetaView.extend({
        template: SubcollectionMetaViewTemplate,

        initialize: function (options) {
            this.collection = options.collection;
//            this.listenTo(this.collection, 'change:metadata', this.metadataChanged);
            this.render();
        }
    });
});
