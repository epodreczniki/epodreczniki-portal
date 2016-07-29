/**
 * Created by piotrg on 2015-05-13.
 */

define(['jquery'], function ($) {
    'use strict';

    $.fn.addZebra = function (option) {
        return this.each(function () {
            var $this = $(this);
            if ($this.hasClass('level_1')) {
                // whole section
                if (($this.attr('data-columns') == "1") || ($this.attr('data-columns') == undefined )) {
                    // standard section
                    $this.children('.section-header').addClass('zebra');
                    $this.children('.section-contents').children().addClass('zebra');

                } else {
                    // columns section
                    $this.addClass('zebra');
                }
            } else {
                // my parent is section-contents
                $this.addClass('zebra');
            }


        });
    };


    function activateStripes() {
        var stripingContent = $('.reader-content');
        var stripingPairs = stripingContent.find('.strip-start');
        var stripeServed = false;
        //console.log("stripingPairs.length", stripingPairs.length, stripingPairs);
        for (var stripIndex = 0; stripIndex < stripingPairs.length; stripIndex += 2) {
            var stripeStart = stripingPairs[stripIndex];
            //console.log("stripeStart " + stripIndex, stripeStart);
            $(stripeStart).addClass('zebra');

            if (!($(stripeStart).hasClass('section'))) {  // check this section  for black stripe end
                //console.log('$(stripeStart).next()', $(stripeStart).next('.strip-end'));
                if ($(stripeStart).nextAll('.strip-end').length > 0) { //found in this section
                    $(stripeStart).nextUntil('.strip-end').addZebra();
                    $($(stripeStart).nextAll('.strip-end')[0]).addClass('zebra');
                    stripeServed = true;
                } else {
                    $(stripeStart).nextAll().addZebra();
                }
            }
            if (!stripeServed) { //check next sections for black stripe end
                var sectionsToCheckForStripe;
                if ($(stripeStart).hasClass('section')) {
                    sectionsToCheckForStripe = $(stripeStart).nextUntil('.section.level_1[data-start-new-page=true]', '.section.level_1');
                } else {
                    sectionsToCheckForStripe = $(stripeStart).parents('.section.level_1').nextUntil('.section.level_1[data-start-new-page=true]', '.section.level_1');
                }
                if (sectionsToCheckForStripe.length == 0) { // no more section on a page
                    stripIndex -= 1; // next stripe is first zebra on next page
                }
                for (var i = 0; i < sectionsToCheckForStripe.length; i++) {
                    if ($(sectionsToCheckForStripe[i]).hasClass('strip-end')) { //stripe end between sections
                        $(sectionsToCheckForStripe[i]).addClass('zebra');
                        stripeServed = true;
                        break;
                    }
                    if ($(sectionsToCheckForStripe[i]).find('.strip-end').length > 0) {  // end of stripe in this section
                        $($(sectionsToCheckForStripe[i]).children('.section-header')).addClass('zebra');
                        $($(sectionsToCheckForStripe[i]).find('.strip-end')[0]).prevAll().addZebra();
                        $($(sectionsToCheckForStripe[i]).find('.strip-end')[0]).addClass('zebra');
                        stripeServed = true;
                        break;
                    } else { // whole section zebra
                        $(sectionsToCheckForStripe[i]).addZebra();
                        if (i == (sectionsToCheckForStripe.length - 1)) { // last section on a page
                            stripIndex -= 1; // next stripe is first zebra on next page
                        }
                    }
                }

            }
            //console.log("stripeEnd " + stripIndex, stripeServed);

            stripeServed = false;   // another stripe bites the dust
        }
    }

    $.fn.wrapWithDiv = function () {
        return this.each(function () {
            var $this = $(this);
            $this.html($('<div>').append($this[0].innerHTML));
        });
    };

    function alterDocumentForStripesBefore() {

    }

    function alterDocumentForStripesAfter() {
        //$('.section.level_1[data-columns=1] > .section-contents > .section[data-width]').parent().parent().addClass('zebra');
        $('.section.level_1>.section-contents>.para.zebra').wrap("<div class='zebra para-wrapper'></div>");//.wrapWithDiv();
        $('.section.level_1>.section-contents>.para-wrapper>.para.zebra').removeClass('zebra');
        $('.section.level_1>.section-contents>.exposed.zebra').wrap("<div class='zebra exposed-wrapper'></div>");//.wrapWithDiv();
        $('.section.level_1>.section-contents>.exposed-wrapper>.exposed.zebra').removeClass('zebra');
        $('.section.level_1 .section-contents>.exercise').wrap("<div class='exercise-wrapper'></div>");//.wrapWithDiv();
        $('.section.level_1 .section-contents>.exercise-wrapper>.exercise.zebra').parent().addClass('zebra');
        $('.section.level_1 .section-contents>.exercise-wrapper>.exercise.zebra').removeClass('zebra');
        $('.section.level_1 .section-contents>.command').wrap("<div class='command-wrapper'></div>");//.wrapWithDiv();
        $('.section.level_1 .section-contents>.command-wrapper>.command.zebra').parent().addClass('zebra');
        $('.section.level_1 .section-contents>.command-wrapper>.command.zebra').removeClass('zebra');
        $('.section.level_1 .section-contents>.student-work').wrap("<div class='student-work-wrapper'></div>");//.wrapWithDiv();
        $('.section.level_1 .section-contents>.student-work-wrapper>.student-work.zebra').parent().addClass('zebra');
        $('.section.level_1 .section-contents>.student-work-wrapper>.student-work.zebra').removeClass('zebra');

        $('.authors-mailto').wrap("<div class='zebra authors-mailto-wrapper'><div class='authors-mailto-wrapper-inner'></div></div>");

        // works on non-paged documents:
        if (!($('#module-content').hasClass('pagination-active'))) {
            var lastElement = $('.section.level_1 .section-contents *').last();
            var lastSection = $(lastElement.parents('.section.level_1')[0]);
            if ((lastSection.hasClass('zebra')) ||
                ( (lastSection.find('.zebra').length > 0) && !(lastSection.find('.zebra').last().hasClass('strip-end')))) {
                $('.bottom-content-navigation').addClass('zebra');
                $('.authors-mailto-wrapper').addClass('zebra');
            } else {
                $('.bottom-content-navigation').removeClass('zebra');
                $('.authors-mailto-wrapper').removeClass('zebra');
            }
        }

    }

    function addStripes() {
        //console.log("Stripes detection...");
        if ($('div.grid div.zebra-module').length > 0) { //changed from '.stripe-end' to enable zebra layout for non-zebra modules if we finally decide to have one layout
            //console.log("Stripes activation...");
            $(".grid").addClass('zebra-module');
            alterDocumentForStripesBefore();
            activateStripes();
            alterDocumentForStripesAfter();

            console.log("Stripes detected and activated.")
        } else {
            $(".grid").removeClass('zebra-module');
//            console.log("No stripes in document.");
        }
    }

    return {
        addStripes: addStripes
    };

});
