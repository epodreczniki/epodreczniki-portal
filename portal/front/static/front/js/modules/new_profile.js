require(['jquery',
    'modules/new_profile/app',
    'jqueryui',
    'declare',
    'underscore',
    'backbone',
    'domReady',
    'bowser'
], function ($, app) {
    'use strict';

    $(document).ready(function () {
        var router = app.initialize();

        //router.navigate("notes", {trigger: true});

        //$('#profile-notes-tab').addClass('active'); //afterwards remove this, set default on init and react on tab change
        //$(".notes-content-wrap").addClass('visible');
        //$.datepicker.regional[ "pl" ];
        $("#profile-notes-date-start").datepicker({
            showAnim: "slideDown",
            dateFormat: "dd-mm-yy",
            showOn: "both",
            buttonImage: "{{ STATIC_URL }}front/img/profile/calendar.svg",
            buttonImageOnly: true,
            buttonText: "Wybierz początkową datę"
        });
        $("#profile-notes-date-end").datepicker({
            showAnim: "slideDown",
            dateFormat: "dd-mm-yy",
            showOn: "both",
            buttonImage: "{{ STATIC_URL }}front/img/profile/calendar.svg",
            buttonImageOnly: true,
            buttonText: "Wybierz końcową datę"
        });
        $("#profile-progress-date-start").datepicker({
            showAnim: "slideDown",
            dateFormat: "dd-mm-yy",
            showOn: "both",
            buttonImage: "{{ STATIC_URL }}front/img/profile/calendar.svg",
            buttonImageOnly: true,
            buttonText: "Wybierz początkową datę"
        });
        $("#profile-progress-date-end").datepicker({
            showAnim: "slideDown",
            dateFormat: "dd-mm-yy",
            showOn: "both",
            buttonImage: "{{ STATIC_URL }}front/img/profile/calendar.svg",
            buttonImageOnly: true,
            buttonText: "Wybierz końcową datę"
        });

        //folding and unfolding aside filters for small screens
        $('.aside-filters-foldable').addClass('hidden');

        $.fn.toggleText = function (t1, t2) {
            if (this.text() == t1)
                this.text(t2);
            else
                this.text(t1);
            return this;
        };

        $('.aside-filters-toggle').on('click', function () {
            $(this).closest('aside').find('.aside-filters-foldable').toggleClass('hidden');

            //edit profile tab has other labels
            if ($(this).closest('.profile-content-wrap').hasClass('edit-profile-wrap')) {
                $(this).find('.aside-filters-toggle-button span').toggleText('ukryj edycję avatara', 'pokaż edycję avatara');
            }
            else {
                $(this).find('.aside-filters-toggle-button span').toggleText('ukryj filtry wyszukiwania', 'pokaż filtry wyszukiwania');
            }

        });

        $(".readings-list-tab").each(function (index, element) {
            $(element).on({
                mouseenter: function () {
                    $(this).children(".readings-tabs-triangle").css('display', 'block');
                },
                mouseleave: function () {
                    $(this).children(".readings-tabs-triangle").css('display', 'none');
                },
                click: function () {
                    //przełączenie pomiędzy zakładkami, zmiana listy książek
                }
            });
        });
    });
});

/* Polish initialisation for the jQuery UI date picker plugin. */
/* Written by Jacek Wysocki (jacek.wysocki@gmail.com). */
( function (factory) {

    // Browser globals
    factory(jQuery.datepicker);

}(function (datepicker) {

    datepicker.regional.pl = {
        closeText: "Zamknij",
        prevText: "&#x3C;Poprzedni",
        nextText: "Następny&#x3E;",
        currentText: "Dziś",
        monthNames: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec",
            "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
        monthNamesShort: ["Sty", "Lu", "Mar", "Kw", "Maj", "Cze",
            "Lip", "Sie", "Wrz", "Pa", "Lis", "Gru"],
        dayNames: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
        dayNamesShort: ["Nie", "Pn", "Wt", "Śr", "Czw", "Pt", "So"],
        dayNamesMin: ["N", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
        weekHeader: "Tydz",
        dateFormat: "dd.mm.yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ""
    };
    datepicker.setDefaults(datepicker.regional.pl);

    return datepicker.regional.pl;

}) );
