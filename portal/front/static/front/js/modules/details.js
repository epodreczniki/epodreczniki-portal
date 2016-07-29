require(['domReady', 'jquery', 'underscore', 'jquery_qrcode', 'bowser', 'modules/new_front/search_box', 'EpoAuth', 'play_and_learn',
    'jqueryui', 'declare', 'backbone'],
    function (domReady, $, _, jquery_qrcode, bowser, search_box, EpoAuth, play_and_learn) {
        'use strict';

        domReady(function () {

            EpoAuth.connectToPage($('#topbar').find('.right-navigation'));
            EpoAuth.ping();

            var div = $('<div/>', {
                'class': 'qr-code-modal'
            });
            div.qrcode(window.location.href);

            $('#qr_code_link').fancybox({
                closeClick: true,
                content: div,
                wrapCSS: 'fancybox-modal fancybox-modal-qr',
                helpers: {
                    overlay: {
                        locked: false,
                        css: {
                            'background': 'rgba(255, 255, 255, 0.6)'
                        },
                        closeClick: true
                    }
                }
            });

            $('.title_qr_code_link, #read_link').focus(function() {
                $(this).parent().addClass('focused');
            });

            $('.title_qr_code_link, #read_link').blur(function() {
                $(this).parent().removeClass('focused');
            });

            _.each($('.title_qr_code_link'), function (el) {
                var url = '';
                var attr = $(el).attr('data-target');
                $(el).attr('data-target', location.protocol + attr);

                if ((attr !== false) && (attr !== typeof undefined)) {
                    url = attr;
                } else if ($(el).prev().attr('href')) {
                    url = $(el).prev().attr('href').substring(2);
                } else {
                    url = $(el).next().attr('href').substring(2);
                }
                //console.log("Wariant url: " + url);
                var qrDiv = $('<div/>', {
                    'class': 'qr-code-modal'
                });
                qrDiv.qrcode(url);

                var fancyParent;
                $(el).fancybox({
                    closeClick: true,
                    content: qrDiv,
                    wrapCSS: 'fancybox-modal fancybox-modal-qr qr-code-modal',
                    helpers: {
                        overlay: {
                            locked: false,
                            css: {
                                'background': 'rgba(255, 255, 255, 0.6)'
                            },
                            closeClick: true
                        }
                    }
                });
            });

            var collapseAuthors = $('#collapse-authors');

            if (collapseAuthors.length > 0) {
                collapseAuthors.click(function () {
                    var authorsH3 = $('#panel-authors');
                    var _this = $(this);
                    if (this.collapsed) {
                        authorsH3.addClass('collapsed-authors');
                        _this.addClass('icon-angle-down');
                        _this.removeClass('icon-angle-up');
                        this.collapsed = false;
                    } else {
                        authorsH3.removeClass('collapsed-authors');
                        _this.removeClass('icon-angle-down');
                        _this.addClass('icon-angle-up');
                        this.collapsed = true;
                    }
                });
            }

            //search_box.init();

            play_and_learn.init();
        });
    });
