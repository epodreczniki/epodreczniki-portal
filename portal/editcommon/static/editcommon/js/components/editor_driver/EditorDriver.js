define([
    'jquery',
    'underscore',
    'declare'
], function ($, _, declare) {

    function getMetadataNode() {
        return $("#editor-common-metadata");
    }


    return declare({
        static: {
            category: function() {
                return getMetadataNode().data('object-category')
            },
            identifier: function() {
                return getMetadataNode().data('object-identifier')
            },
            version: function() {
                return getMetadataNode().data('object-version')
            },
            spaceId: function() {
                return getMetadataNode().data('object-spaceid')
            },
            toJSON: function(){
                var json = {};
                var metaNode = getMetadataNode();
                _.each(['category', 'identifier', 'version', 'spaceid'], function(entry){
                    json[entry] = metaNode.data('object-' + entry);
                });
                return json;
            }
        }
    });
});

