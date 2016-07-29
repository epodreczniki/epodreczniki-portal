define(['jquery',
    'backbone',
    'underscore',
    '../Layout',
    'modules/core/Registry',
    'modules/core/ReaderKernel',
    './components/Topbar',
    './components/Contentbar',
    './components/HeaderImage',
    './components/PlayAndLearn',
    './components/TopPanel',
    './components/Grid',
    './components/LoadingIndicator',
    './components/TableOfContent',
    './components/Bottombar',
    './components/Tiles',
    './components/Space2d',
    './components/Tooltips',
    './components/TooltipLoader',
    './components/Womi',
    './components/Notes',
    './components/Zebra',
    './components/Accessibility',
    './components/MathJax',
    './components/OpenQuestion'
], function ($, Backbone, _, Layout, Registry, Kernel, Topbar, Contentbar, HeaderImage, PlayAndLearn, TopPanel, Grid, LoadingIndicator, TableOfContent, Bottombar, Tiles, Space2d, Tooltips, TooltipLoader, Womi, Notes, Zebra, Accessibility, MathJax, OpenQuestion) {
    return Layout.extend({

        name: 'DefaultLayout',
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
            this.addComponent('Zebra', Zebra);
            this.addComponent('bottombar-navigation', Bottombar);
            this.addComponent('tiles', Tiles);
            this.addComponent('space2d', Space2d);
            this.addComponent('tooltips', Tooltips);
            this.addComponent('tooltipLoader', TooltipLoader);

            this.addComponent('Notes', Notes);
            this.addComponent('Accessibility', Accessibility);
            this.addComponent('EpoMathJax', MathJax);
            this.addComponent('openQuestion', OpenQuestion);
            var commonBase = require('common_base');
            //TODO: DEBUG PARAM
            if(commonBase.getParameter('contextMenu') == 'off'){
                Registry.set('contextMenu', false);
            }
        }


    });
});
