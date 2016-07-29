define([
    'jquery',
    'backbone',
    'underscore',
    '../Layout',
    'modules/core/Registry',
    'modules/core/ReaderKernel',
    '../default/components/Womi',
    './components/Topbar',
    '../default/components/Grid',
    '../default/components/TableOfContent',
    '../default/components/Space2d'
], function (
    $, 
    Backbone, 
    _, 
    Layout, 
    Registry, 
    Kernel, 
    Womi,
    Topbar,
    Grid,
    TableOfContent,
    Space2d
) {
    return Layout.extend({

        name: 'DefaultLayout',
        constructor: function (options) {
            Layout.prototype.constructor.call(this, options);
            this.addComponent('womiDef', Womi);

            this.addComponent('topbar', Topbar);

            this.addComponent('grid', Grid);
            this.addComponent('toc', TableOfContent);
            this.addComponent('space2d', Space2d);

            var commonBase = require('common_base');

            //TODO: DEBUG PARAM
            if(commonBase.getParameter('contextMenu') == 'off') {
                Registry.set('contextMenu', false);
            }
        }

    });
});
