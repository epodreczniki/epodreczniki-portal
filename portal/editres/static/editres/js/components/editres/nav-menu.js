define(['jquery', 'components/editres/Editres'], function ($, Editres) {

    $(document).ready(function () {
        $('.menu').menu();

        $('.nav-menu > div').click(function () {
            $('.menu').toggle();
        });
    });
});

