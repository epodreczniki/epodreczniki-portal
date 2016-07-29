require(['jquery'], function ($) {
    'use strict';

       // $('#user-type-bar').css('display', 'none');
       // $('#user-type-bar').hide();

     $(document).ready(function () {
         $('#cookies-alert').each(function (index, element) {
            var cookieName = '_cookies';
            if ($.cookie(cookieName) == null) {
                $(element).show();
                $(element).find('.close').click(function () {
                    $.cookie(cookieName, '1', {expires: 3650, path: ''});
                });
            }
        });

        $('#user-type-bar').css('display', 'none');
        $('#user-type-bar').hide();

    });

});
