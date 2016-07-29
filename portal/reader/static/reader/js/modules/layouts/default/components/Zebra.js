define(['jquery',
    '../../Component',
    'underscore',
    'backbone',
    'modules/core/Logger',
    'modules/utils/ReaderUtils',
    './includes/stripes'], function ($, Component, _, Backbone, Logger, Utils, Stripes) {

    var curPage = -1;
    var pages = undefined;

    return Component.extend({
        name: 'Zebra',
        load: function () {
            var _this = this;
            this.listenTo(this._layout, 'moduleLoaded', function () {
                _this.stripesForModule();
            });

            this.listenTo(this._layout, 'selectedPage', function (params) {
                if (_this.pages == undefined) {
                    _this.pages = $(".pagination-page");
                }
                // EPP-5327 (dynamic zebra in bottom-content-navigation ) BEGIN
                _this.stripeForModuleFooter();
                // EPP-5327 END

            });
        },


        stripeForModuleFooter: function () {

            // EPP-5327 (dynamic zebra in bottom-content-navigation ) BEGIN
            //console.log("Checking stripe for footer...")
            if ($('.zebra').length > 0) {
                var lastElement = $('.pagination-page:not(.pagination-page-blurred) .section.level_1 .section-contents *').last();
                var lastSection = $(lastElement.parents('.section.level_1')[0]);
                if ((lastSection.hasClass('zebra')) ||
                    ( (lastSection.find('.zebra').length > 0) && !(lastSection.find('.zebra').last().hasClass('strip-end')))) {
                    $('.bottom-content-navigation').addClass('zebra');
                    $('.authors-mailto-wrapper').addClass('zebra');

                    $('#content-wrap').addClass('zebra');
                    //console.log("Footer stripe set.")
                } else {
                    $('.bottom-content-navigation').removeClass('zebra');
                    $('.authors-mailto-wrapper').removeClass('zebra');

                    $('#content-wrap').removeClass('zebra');
                    //console.log("Footer stripe not set.")
                }

            } else {
                //console.log("No stripes in the module.")
            }

            // EPP-5327 (zebra) END
        },

        stripesForModule: function () {
            Stripes.addStripes();
        }
    });
});
