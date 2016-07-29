define([
    'modules/layouts/default/components/Topbar'
], function (Topbar) {

    return Topbar.extend({
        hideTopbar: function () {
            this.$el.removeClass('is-visible').addClass('topbar-animate is-hidden');
            $('#contentbar').addClass('onTop').removeClass('underTopbar');
        },

        showTopbar: function () {
            var currentScroll = $(window).scrollTop();
            this.$el.removeClass('topbar-animate is-hidden')
                .addClass('is-visible ' + ((currentScroll <= 40) ? '' : 'topbar-animate'));
            $('#contentbar').removeClass('onTop').addClass('underTopbar');
        }
    });
});
