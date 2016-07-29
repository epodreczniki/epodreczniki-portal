define(['jquery', '../../Component'], function ($, Component) {

    return Component.extend({
        name: 'Accessibility',

        prepare: function() {
            $('.gallery-invisible').mouseout(function() {
                $(this).blur();
            });
        },

        load: function () {
            this.listenTo(this._layout, 'moduleWomiLoaded', this.prepare);
            this.listenTo(this._layout, 'allWomiLoaded', this.prepare);
            this.listenTo(this._layout, 'moduleLoaded', this.prepare);
            //this.listenTo(this._layout, 'selectedPage', this.prepare);

            $(document).on('keyup', function (event) {
                if (event.keyCode == 27) {  // ESC
                    if ($('.fancybox-close').length || $('.close-gallery').length) {
                        $.fancybox.close();
                    }
                } else if (event.keyCode == 9 && $('.fancybox-overlay').length) {
                    var focused = $(':focus');
                    if (focused.closest('.fancybox-overlay').length == 0) {
                        if (event.shiftKey) {
                            $('.fancybox-overlay').find('a[href], input, button').last().focus();
                        } else {
                            $('.fancybox-overlay').find('a[href], input, button').first().focus();
                        }
                    }
                }
            });
        }
    });
});
