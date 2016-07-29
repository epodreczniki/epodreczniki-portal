define(['jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.View.extend({
        initialize: function (options) {

            this.render();

            $('.details123-nav-element a').click(function (ev) {
                var sender = $(ev.target);
                var tab = '#' + sender.attr('data-tab');
                $('.details123-nav-element a').removeClass('active');
                sender.addClass('active');
                $('.details123-tab-content').css('display', 'none');
                $(tab).css('display', 'flex');

                //for Safari only:
                var userAgent = window.navigator.userAgent;
                if ((userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match('Safari')) && !userAgent.match('Chrome')) {
                    $(tab).css('display', '-webkit-flex');
                }

                return false;
            });

            $('.details123-toc-nav-element a').click(function () {
                var el = $('.details123-toc-nav[data-toc-path="' + $(this).data('toc-path') + '"]');
                el.show();
                el.siblings().find('a').each(function () {
                    $('.details123-toc-nav[data-toc-path="' + $(this).data('toc-path') + '"]').hide();
                });
                el.siblings().hide();
                return $(this).attr('href') != '#';
            });
        }
    });
});

