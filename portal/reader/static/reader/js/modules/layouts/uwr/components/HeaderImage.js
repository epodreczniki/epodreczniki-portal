define(['jquery',
    'modules/layouts/default/components/HeaderImage'
], function ($, HeaderImage) {

    return HeaderImage.extend({
        handleWindowScroll: function () {},

        _onModuleLoaded: function(params) {
            var moduleHeaderWomi = $(params.moduleElement).data('womi-reference-module-header-unbound-kind');
            this.hasAnyHeaderWomi = moduleHeaderWomi;

            if (moduleHeaderWomi) {
                this._loadHeaderImage(moduleHeaderWomi, $(params.moduleElement), true);
            } else {
                this.headerImage.addClass('no-background').removeClass('above-header').css('background-image', 'none');
            }
            this.switchHeader({page: 1});
            this._setupTitle();
        },

        switchHeader: function(params) {
            HeaderImage.prototype.switchHeader.call(this, params);
            $('#contentbar').removeClass('onTop').addClass('underTopbar');
            $('#main-header').find('.module-header-caption').remove();
            $('.module-header-caption').clone().show().appendTo('#main-header');
        }
    });

});
