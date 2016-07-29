require([
    'underscore',
    'jquery',
    'backbone',
    'domReady',
    'localStorage',
    'text',
    'json',
    'ResLister',
    'jquery-ui-1.10.3.custom',
    'editres/itemcontextfolding',
    'editres/nav-menu',
    'CascadeForms',
    'universal_logout'
], function () {

    'use strict';

    var domReady = arguments[3],
        ResLister = arguments[7],
        universal_logout = arguments[12];

    universal_logout.initListening();
    universal_logout.initializeDefaultAction();

});
