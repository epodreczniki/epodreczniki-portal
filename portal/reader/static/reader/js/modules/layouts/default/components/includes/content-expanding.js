define(['jquery', 'underscore', 'modules/core/WomiManager'], function ($, _, WomiManager) {
    'use strict';


    $.fn.addSectionExpanding = function (option) {
        return this.each(function () {
            addSectionExpanding();
        })
    };
    $.fn.addTocExpanding = function (option) {
        return this.each(function () {
            addTocExpanding();
        })
    };

     /*$(document).ready(function () {

         addTocExpanding();
     });*/

    function addSectionExpanding() {
        //remove the unwanted span in header before adding the proper one
         $('.module-header').find('span.title').find('span').remove();

        var expandingElements = $('.grid .content-status-expanding > :first-child');
        expandingElements.each (function () {
            var target = $(this);
            if (target.hasClass("section-contents")) {
                target.prepend('<span class="content-status-expanding" title="Treść rozszerzająca"></span>');
            } else {
                target.append('<span class="content-status-expanding" title="Treść rozszerzająca"></span>');
            }
        })
        var supplementalElements = $('.grid .content-status-supplemental > :first-child');
        supplementalElements.each (function () {
            var target = $(this);
            if (target.hasClass("section-contents")) {
                target.prepend('<span class="content-status-supplemental" title="Treść uzupełniająca"></span>');
            } else {
                target.append('<span class="content-status-supplemental" title="Treść uzupełniająca"></span>');
            }
        })
        var recipientElements = $('.grid .recipient-teacher > :first-child');
        recipientElements.each (function () {
            var target = $(this);
            if (target.hasClass("section-contents")) {
                target.prepend('<span class="recipient-teacher" title="Treść dla nauczyciela"></span>');
            } else {
                target.append('<span class="recipient-teacher" title="Treść dla nauczyciela"></span>');
            }
        })
    }

    function addTocExpanding() {


        var expandingElements = $('#table-of-contents li a[data-content-status="expanding"]:not(:has(span.content-status-expanding))');
        expandingElements.append('<span class="content-status-expanding" title="Treść rozszerzająca"></span>');
        var supplementalElements = $('#table-of-contents li a[data-content-status="supplemental"]:not(:has(span.content-status-supplemental))');
        supplementalElements.append('<span class="content-status-supplemental" title="Treść uzupełniająca"></span>');
        var recipientElements = $('#table-of-contents li a[data-module-recipient="teacher"]:not(:has(span.recipient-teacher))');
        recipientElements.append('<span class="recipient-teacher" title="Treść dla nauczyciela"></span>');

    }

    return {
        addSectionExpanding: addSectionExpanding,
        addTocExpanding: addTocExpanding
    };

});



