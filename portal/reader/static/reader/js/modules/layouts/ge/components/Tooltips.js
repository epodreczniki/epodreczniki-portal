define(['jquery', 'backbone', '../../Component'], function ($, Backbone, Component) {

    'use strict';

    return Component.extend({

        postInitialize: function(options) {

            var deviceDetection = require('device_detection');

            this.timer;
            this.delay = 50;

            var _this = this;

            if (deviceDetection.isDesktop) {
                $('.accordion-toggle').hover(
                    function() { _this.showTip(this); },
                    function() { _this.hideTip(this); }
                ).css('z-index', '9').css('position', 'relative').focus(function() {_this.showTip(this);})
                 .blur (function() {_this.hideTip(this);});
            }

        },

        showTip: function(context) {
            $(context).attr('title', '');
            var tooltip = $("[data-anchor='" + $(context).data('toc-path') + "']");
            if (navigator.userAgent.match(/Trident/)) {
                tooltip.css('transform', 'none');
            }else if (tooltip.hasClass('GE-Tip-One')) {
                tooltip.css('transform', 'translateY(-' + $('.table-of-contents-ge').scrollTop() + 'px)');
            }

            if (navigator.userAgent.match(/Trident/)) {
                var tootlipW = tooltip.width();
                var w = $(window).width();
                var tocW;
                if ( w < 1279 ) {
                    tocW = 170 + tootlipW;
                } else if ( w > 1279 && w < 1440 ) {
                    tocW = 214 + tootlipW;
                } else {
                    tocW = 314 + tootlipW;
                }
                $('.table-of-contents-ge').attr('style', 'display: block; background: none; width: '+tocW+'px !important');
            }

            this.timer = setTimeout(function() {
                tooltip.fadeIn();
            }, this.delay);
        },

        hideTip: function(context) {
            $("[data-anchor='" + $(context).data('toc-path') + "']").fadeOut();
            clearTimeout(this.timer);
            if (navigator.userAgent.match(/Trident/)) {
                var tooltip = $("[data-anchor='" + $(context).data('toc-path') + "']");
                var w = $(window).width();
                var tocW;
                if ( w < 1279 ) {
                    tocW = 170;
                } else if ( w > 1279 && w < 1440 ) {
                    tocW = 214;
                } else {
                    tocW = 314;
                }
                $('.table-of-contents-ge').attr('style', 'display: block; background: none; width: '+tocW+'px !important');
            }
        }

    });

});
