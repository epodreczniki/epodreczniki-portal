define(['jquery',
    'backbone',
    'underscore',
    '../Layout',
    'modules/core/Registry',
    'modules/core/ReaderKernel',
    './components/Topbar',
    '../default/components/Contentbar',
    './components/HeaderImage',
    '../default/components/PlayAndLearn',

    '../default/components/TopPanel',
    '../default/components/Grid',
    '../default/components/LoadingIndicator',
    '../default/components/TableOfContent',
    '../default/components/Bottombar',
    '../default/components/Tiles',
    '../default/components/Space2d',
    './components/TooltipLoader',
    './components/Womi',
    '../default/components/Notes',
    //'./components/Zebra', // no zebra for UWR
    '../default/components/Accessibility',
    '../default/components/OpenQuestion'
    ], function ($, Backbone, _, Layout, Registry, Kernel, Topbar, Contentbar, HeaderImage, PlayAndLearn, TopPanel, Grid, LoadingIndicator, TableOfContent, Bottombar, Tiles, Space2d, TooltipLoader, Womi, Notes, Accessibility, OpenQuestion) {
    return Layout.extend({

        name: 'UwrLayout',
        constructor: function (options) {
            Layout.prototype.constructor.call(this, options);
            this.addComponent('topbar', Topbar);
            this.addComponent('contentbar', Contentbar);
            this.addComponent('headerImage', HeaderImage);
            this.addComponent('playAndLearn', PlayAndLearn);

            this.addComponent('womiDef', Womi);
            this.addComponent('grid', Grid);
            this.addComponent('loadingIndicator', LoadingIndicator);
            this.addComponent('toc', TableOfContent);

            this.addComponent('bottombar-navigation', Bottombar);
            this.addComponent('tiles', Tiles);
            this.addComponent('space2d', Space2d);
            this.addComponent('tooltipLoader', TooltipLoader);

            this.addComponent('Notes', Notes);
            this.addComponent('Accessibility', Accessibility);
            this.addComponent('openQuestion', OpenQuestion);

            var commonBase = require('common_base');
            //TODO: DEBUG PARAM
            if(commonBase.getParameter('contextMenu') == 'off'){
                Registry.set('contextMenu', false);
            }

            $(document).on("keypress", function(e) {
                //console.log('e', e, e.keyCode);
                if (e.which === 32) {
                    console.log('hehe');
                }
                //return !(e.keyCode == 32 && (e.target.type != 'text' && e.target.type != 'textarea'));
            });
        }

    });
});
