require(['jquery',
    'jqueryui',
    'declare',
    'underscore',
    'backbone',
    'domReady',
    'localStorage',
    'text',
    'json',
    'components/womi_dialog/WOMISelectDialog'], function () {
    'use strict';
    var WOMISelectDialog = arguments[9];
    this.womiSelectDialog = new WOMISelectDialog({saveCallback: function () {
    }});

    this.womiSelectDialog.show();
});