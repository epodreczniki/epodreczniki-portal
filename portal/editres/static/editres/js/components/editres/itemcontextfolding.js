define(['jquery', 'components/editres/Editres'], function ($, Editres) {

    $(document).ready(function () {
        $('.notifications-inner').hide();

        $('.folding-inner').click(function () {
            $('.item-context-workarea-description-header').hide();

            $.each($('.foldable'), function () {
                if ($(this).hasClass('folded')) {
                    $(this).show("drop", { direction: "up" }, 500, "easeOutSine");
                }
                else {
                    $(this).hide("drop", { direction: "up" }, 500, "easeOutSine");
                }

                $(this).toggleClass('folded');

                if ($(this).hasClass('folded')) {
                    $('.notifications-inner').show();
                }
                else {
                    $('.notifications-inner').hide();
                }
            });

            $('.item-context-workarea-description').toggleClass('full-width');
            $('.item-context-workarea-container').toggleClass('full-width');

            $(this).toggleClass('folded-icon');
            $('.item-context-workarea-description-header').show();
        });
    });
});
