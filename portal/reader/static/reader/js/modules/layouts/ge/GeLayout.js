define(['jquery',
    'backbone',
    'underscore',
    '../Layout',
    'modules/core/HookManager',
    'modules/core/Registry',
    'modules/core/ReaderKernel',
    '../ge/components/Topbar',
    '../default/components/TopPanel',
    '../default/components/Grid',
    './components/LoadingIndicator',
    '../ge/components/TableOfContent',
    './components/Bottombar',
    './components/Tiles',
    './components/Space2dNewAndTasty',
    '../default/components/TooltipLoader',
    '../ge/components/DotPagination',
    '../ge/components/Tooltips',
    '../ge/components/WomiToggler',
    '../default/components/Womi',
    './components/Accessibility',

    'modules/core/engines/GEAnimation',
    'modules/core/WomiManager',
    'text!modules/layouts/ge/templates/res_limit.html'], function ($, Backbone, _, Layout, HookManager, Registry, Kernel, Topbar, TopPanel, Grid, LoadingIndicator, TableOfContent, Bottombar, Tiles, Space2d, TooltipLoader, DotPagination, Tooltips, WomiToggler, Womi, Accessibility, GEAnimation, WomiManager, res_limit_template) {
    return Layout.extend({

        name: 'GELayout',
        constructor: function (options) {

            Layout.prototype.constructor.call(this, options);

            this.addComponent('topbar', Topbar);
            this.addComponent('womiDef', Womi);
            this.addComponent('grid', Grid);
            this.addComponent('loadingIndicator', LoadingIndicator);
            this.addComponent('toc', TableOfContent);
            this.addComponent('bottombar-navigation', Bottombar);
            this.addComponent('tiles', Tiles);
            this.addComponent('space2d', Space2d);
            this.addComponent('tooltipLoader', TooltipLoader);
            this.addComponent('dotPagination', DotPagination);
            this.addComponent('tooltips', Tooltips);
            this.addComponent('womiToggler', WomiToggler);
            this.addComponent('Accessibility', Accessibility);

            var commonBase = require('common_base');


            //Registry.set('womiContainerGallery', WOMIContainerGallery);
            //Registry.set('galleryContainer', WOMIGalleryContainer);
            //TODO: DEBUG PARAM

            if (commonBase.getParameter('contextMenu') == 'off') {
                Registry.set('contextMenu', false);
            }

            Registry.get('engines')['ge_animation'] = GEAnimation;

            // TODO: Change It to one method & trigger instead of func execution.

            this.listenTo(this, 'space2dMoveStart gridClicked', function () {

                this.trigger('hideNavigation');

            });

            this.once('moduleLoaded', function(){
                $('#ge-preloading-screen').remove();
            });

            this.listenTo(this, 'hideNavigation', function() {
            
                this.components.topbar.changeElemState('Hide');

                this.components.toc.hideSidebar();

            }); 

            HookManager.addHook('licenseItemAddingHook', function (womiContainer, item) {

                if(!item){
                    return false;
                }
                var lic = $('<div>', {
                    'class': 'license',
                    style: 'z-index: 110'
                });

                lic.append('<p class="copyright"><a href="#"><span class="icon"></span></a></p>');
                lic.find('a').click(function () {
                    item.callback();
                    return false;
                });

                require('modules/core/WomiManager').womiEventBus.on('toggleWOMILicense', function () {
                    lic.toggle();
                });

                womiContainer.append(lic);

                if (item.name == 'license' && (localStorage.epoLicenseOn == 'false' || !localStorage.epoLicenseOn)) {
                    lic.hide();
                }

                return false;


            });

            this.listenTo(this._kernel, 'kernelStart', function () {

                this.resolutionLimit();

            });

            this.listenTo(this, 'windowResize', function () {
                
                this.resolutionLimit();

            });

        },

        resolutionLimit: function() {

            if ($(window).width() < 1024 && !this.tooLowResWarnAppended) {
            
                var tooLowResDiv = $('<div>', {
                    class: 'too-low-resolution-warning',
                    html: res_limit_template
                });

                $('body').append(tooLowResDiv);

                this.tooLowResWarnAppended = true;

            }

        },

        _addUserTypeSelectCallback: function(){
            //resizing if user type select
            var layout = this;
            $('#user-type-student, #user-type-teacher').click(function(){
                setTimeout(function(){
                    layout.trigger('userTypeSelect');
                }, 200);
            });
        }

    });
});
