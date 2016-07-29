define(['jquery', 'device_detection'], function ($, dd) {
    'use strict';

    if (!Modernizr.touch) {
        $('.hastip').tooltipsy({
            alignTo: 'element',
            offset: [-1, 1]
        });


        $('.hastip').on('click', function () {
            $(this).data('tooltipsy').hide();
        });

    }

    $(document).ready(function () {
        if (dd.isMobile) {
            $('#welcome-mobile-info').show();
        }

        try { localStorage.test = 2; } catch (e) {
            alert('Twoja przeglądarka nie obsługuje localstorage, z którego korzystamy. Prawdopodobnie masz włączony prywatny tryb przeglądania, co może uniemożliwić Ci przejście dalej.');
        }

        $('button.settings').click(function() {
            handleSettingsClick();
        });
    });

    var $tocDropdown = $('.top-dropdown');

    var handleSettingsClick = function () {
        if ($('.top-dropdown').is(':visible')) {
            handleCloseDropdownClick();
        } else {
            $('button.settings').addClass('open');
            $tocDropdown.fadeIn();
        }
    };

    var handleCloseDropdownClick = function () {
        $tocDropdown.fadeOut();
        $('button.settings').removeClass('open');
    };

});
