define([
    'jquery',
    '../../Component',
    'tocUtils',
    'text!../templates/contentbar.html'
], function(
    $, 
    Component,
    tocUtils,
    Template
) {

    return Component.extend({

        name: 'Contentbar',

        template: _.template(Template), 

        events: {
            'click .toc-toggle': 'toggleTableOfContent'
        },

        postInitialize: function(options) {
            this.setElement($('#contentbar'));
            this.render();

            this.listenTo(this._layout, 'moduleLoaded', function() {
                this.setModuleTitle(tocUtils.activeModule());
            });

            this.handleWindowScroll();
        },

        render: function() {
            //this.$el.html(this.template());
        },

        setModuleTitle: function(title) {
            this.$('.title').html(title);
        },

        handleSearchClick: function() {},

        handleWindowScroll: function() {
            $(window).scroll(function() {
            }.bind(this));
        },

        toggleTableOfContent: function() {
            $('.toc-dropdown').toggleClass('shown').attr('aria-hidden', 'false');
            $('.toc-dropdown button, .toc-dropdown a').removeAttr('tabindex');
            $('.toc-dropdown a.accordion-toggle').attr('tabindex','0');
        }

    });

});
