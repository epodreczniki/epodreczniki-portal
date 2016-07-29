define(['require', 'jquery', 'layout'], function (require, $, layout) {
    'use strict';

    var commonBase = require('common_base');

    $(document).ready(function () {
        $('.toggle-sidebar').click(function () {
            layout.toggleSidebar();
        });

        var epoReferrer = commonBase.getEpoReferrer();
        $('#home_link').click(function () {
            if (epoReferrer != null) {
                    location.href = epoReferrer;
            }
            else{
                var pathArray = document.URL.split('/');
                location.href = document.URL.replace(/(.+)/, pathArray[0] + '//' + pathArray[2] + '/front/');
            }
        });
    });
});
