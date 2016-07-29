require([
    'jquery',
    'jqueryui',
    'declare',
    'underscore',
    'backbone',
    'domReady',
    'localStorage',
    'text',
    'json',
    'base_lister'
], function () {

    'use strict';

    var BaseLister = arguments[9];

    this.lister = new BaseLister({
        defaultFilter: {
            'field': 'category',
            'value': ['womi'],
            'hidden': true
        },
        selectedItemAction: function(model) {
           console.log(model); 
        },
        // By default is setted to true.
        killAfterSelect: true,
        tilesView: true,
        saveMode: false,
        styleMode: 'kzd',
        resultFields: ['identifier', 'category', 'author', 'attributes', 'keywords', 'extended_category', 'description'], 
        likesEnabled: false
    });
    this.lister.render();

    $('#lister-hook').append(this.lister.$el);

});
