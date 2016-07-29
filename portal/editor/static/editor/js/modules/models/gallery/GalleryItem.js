define(['backbone', 'underscore'], function (Backbone, _) {
    return Backbone.Model.extend({
        defaults: {
            position: 1,
            attrWomi: null,
            attrTitle: '',
            attrAuthor: [],
            attrMediaType: '',
            attrImage: '',
            attrRelatedWomi: null,
            attrRelatedImage: null,
            attrZoomable: false,
            attrMagnifier: false,
            attrContent: ''
        }
    });
});