define(['jquery', './ContentEngineInterface'], function ($, ContentEngineInterface) {

    return ContentEngineInterface.extend({
        reload: function(placeholder, options){
            console.log('testengine', placeholder);
        }
    })
});