define(['jquery', '../../Component', 'underscore'], function ($, Component, _) {

    return Component.extend({
        name: 'Accessibility',
        load: function () {
            var _this = this;

            this.listenTo(this._layout, 'moduleWomiLoaded', _this.preparePages);
            this.listenTo(this._layout, 'allWomiLoaded', _this.preparePages);
            this.listenTo(this._layout, 'moduleLoaded', _this.preparePages);
            this.listenTo(this._layout, 'moduleLoadingStart', function () {
                $.fancybox.close();
            });
            $(document).on('keyup', function (event) {
                var fullscreenEl = $('.fancybox-wrap, .vjs-fullscreen');

                if (event.keyCode == 27) {  // ESC
                    if ($('.fancybox-close').length) {
                        $.fancybox.close();
                    }
                } else if (event.keyCode == 9 && fullscreenEl.length) {
                    var focused = $(':focus');
                    if (focused.closest('.fancybox-wrap, .vjs-fullscreen').length == 0) {
                        var elems = fullscreenEl.find('a[href], input, button, div[tabindex="0"]').filter(':visible');
                        if (event.shiftKey) {
                            elems.last().focus();
                        } else {
                            elems.first().focus();
                        }
                    }
                }
            });

            // EPP-6473 BEGIN
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length && $(mutation.addedNodes[0]).hasClass('fancybox-overlay')) {
                        $('#content-wrap').attr('aria-hidden', 'true');
                        $(window).on("hashchange", function() {
                            $.fancybox.close(true);
                        });

                    } else if (mutation.removedNodes.length && $(mutation.removedNodes[0]).hasClass('fancybox-overlay')) {
                        $('#content-wrap').removeAttr('aria-hidden');
                    }
                });
            });
            observer.observe(document.querySelector('body'), {childList: true});
            // EPP-6473 END

            $('.reader-content .exercise.on-paper .exercise-header .label').append('<span class="wcag-hidden"> Zadanie do wykonania w zeszycie. </span>')
        },

        preparePages: function() {
            $('.toc-dropdown').attr('aria-hidden', $('.toc-dropdown').hasClass('shown') ? 'false' : 'true');

            var moduleContent = $('#module-content');

            moduleContent.find('div[role=button], li[role=button]').attr('tabindex', '0');
            moduleContent.find('iframe').attr('tabindex', '-1');  // EPP-6770
            moduleContent.find('.interactive-object-container iframe').removeAttr('tabindex'); // EPP-7371

            // EPP-6524 BEGIN
            moduleContent.find('.vjs-subtitles-button, .vjs-captions-button, .vjs-chapters-button').removeAttr('aria-label');
            moduleContent.find('.vjs-big-play-button').attr('aria-label', 'Odtwórz wideo');
            moduleContent.find('.vjs-progress-holder').attr('aria-label', 'Pasek postępu');
            moduleContent.find('.vjs-volume-bar').attr('aria-label', 'Poziom głośności');
            moduleContent.find('.vjs-res-button').attr('aria-label', 'Jakość');
            // EPP-6524 END

            // EPP-4075 BEGIN
            moduleContent.find('video').attr('tabindex', '-1').attr('aria-hidden', 'true');
            moduleContent.find('.vjs-poster, .generated-image').attr('aria-hidden', 'true');
            moduleContent.find('.image-container img').removeAttr('aria-hidden');
            moduleContent.find('.image-container img').parents('.image-container').prevAll('.alt-text-container').attr('aria-hidden', 'true');

            moduleContent.find('a, iframe, :input, [role=button], video, .show-scroll').each(function() {
                var el = $(this);
                el.focus(function() {
                    el.closest('.pagination-page').find('.vjs-has-started').attr('tabindex', '0');
                    el.closest('.vjs-has-started').attr('tabindex', '-1');
                })
            });
            // EPP-4075 END

            $('.video-js video').each(function() {
                var _this = $(this);
                var vid = videojs(_this.attr('id'));
                vid.on('firstplay', function() {
                    _this.nextAll('.vjs-control-bar').find('.vjs-play-control').focus();
                });
                // ET-1146 BEGIN
                vid.on('play', function() {
                    $('.video-js video').not(_this).each(function() {
                        videojs($(this).attr('id')).pause();
                    });
                });
                // ET-1146 END
            });

            if($('.pagination-page').length > 0) {
                var active_page_id = $('.pagination-page').not('.pagination-page-blurred').first().find('.section.level_1').first().attr('id');
                $('#skip-nav').remove();
                $('body').prepend('<a id="skip-nav" href="' + location.href.replace(location.hash, "") + '#' + active_page_id + '">Przejdź do treści</a>');
            } else {
                var anchor = $('.section.level_1').first();
                var anchor_id = '';
                if (anchor != undefined) {
                    anchor_id = anchor.attr('id');
                }
                $('#skip-nav').remove();
                $('body').prepend('<a id="skip-nav" href="' + location.href.replace(location.hash, "") + '#' + anchor_id + '">Przejdź do treści</a>');
            }

        },
    });
});
