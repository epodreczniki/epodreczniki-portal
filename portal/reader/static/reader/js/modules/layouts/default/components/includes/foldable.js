define(['jquery', 'underscore', 'modules/core/WomiManager'], function ($, _, WomiManager) {
    'use strict';

    var MORE = "więcej";
    var LESS = "zwiń";
    var TITLE_LESS = "zwiń";
    var TITLE_MORE = "rozwiń";
    var ADDITIONAL_IMAGE_HTML = '<button class="additional-image" title="'+TITLE_MORE+'"></button>';
    var ADDITIONAL_IMAGE_FOLDED_HTML = '<button class="additional-image folded" title="'+TITLE_LESS+'"></button>';


    $.fn.fold = function (option) {
        return this.each(function () {
            var $this = $(this);

            var collapsed = !$this.hasClass('in-x');
            var opt = option;

            if (opt == 'toggle') {
                opt = (collapsed ? 'show' : 'hide');
            }

            if (opt == 'show' && collapsed) {
                $this.slideDown(200);
                $this.addClass('in-x');
            }

            if (opt == 'hide' && !collapsed) {
                $this.slideUp(200);
                $this.removeClass('in-x');
            }


        });


    };

    $.fn.addFoldable = function (option) {
        return this.each(function () {
            addFoldable();
        })
    };

    function buildCuriosityContentHeader(foldableElement) {
        //console.log("buildCuriosityContentHeader(foldableElement)",foldableElement);
        var origContents = foldableElement.children('.note-contents').children('.para');
        if (origContents.length==0) {
            origContents = foldableElement.children('.note-contents');
        }
        var targetContentsHeader = $('<div class="note-contents" style="overflow: hidden;"><div class="para note-contents-header"></div></div>');
        var foldPointExists = Boolean(origContents.find('span.fold-point').length);

        origContents.first().contents().each(function() {
            var _this = $(this);
            if (_this.is('span.fold-point')) return false;

            var text = _this.text();
            if (this.nodeType == 3 && text.indexOf('.') > -1 && !foldPointExists) {
                var dotIndex = text.indexOf('.');
                while (text.substring(dotIndex - 4, dotIndex) == ' tzw') {
                    dotIndex = text.indexOf('.', dotIndex + 1);
                }
                targetContentsHeader.children().first().append(text.substring(0, dotIndex + 1));
                return false;
            } else {
                targetContentsHeader.children().first().append(_this.clone(true));
            }
        });

        if (!foldPointExists && (targetContentsHeader.text().trim().length == origContents.first().text().trim().length)) {
            targetContentsHeader.addClass('short-curiosity');
        }

        return targetContentsHeader;
    }


    function onClickFoldable(e) {
        e.preventDefault();
        var targetHeader = $(this);
        var foldableElement = $(this).parent();

        if (!foldableElement.hasClass('foldable')) {
            return;
        }

        if (targetHeader.parent().children('.foldable-contents').length > 0) {
            var target = $(targetHeader.parent().children('.foldable-contents'));
        }
        else {
            var target = $(targetHeader.parent().children('.note-contents'));
        }

        // 1. Toggle the target (display (part/nothing) or whole content):
        if (targetHeader.parent().hasClass('note-curiosity')) {
            $('.foldable>.foldable-header, .foldable>.note-header').off('click');
            if (target.hasClass('in-x')) {
                target.animate({ height: targetHeader.parent().attr("collapsed-height") }, { queue: false, duration: 300, complete: function () {
                    $(targetHeader.parent().find('.note-contents-header')).toggle();
                    target.removeClass('in-x');
                    target.hide();
                    $('.foldable>.foldable-header, .foldable>.note-header').on('click', onClickFoldable);
                }
                });

            } else {
                
                // save collapsed and folded heights for first time click
                if (!targetHeader.parent().attr("folded-height")) {
                    // we need it invisible but not hided to get actual height
                    target.css('opacity', '0');
                    target.show();
                    try {
                        resizeWOMIs(target); //EPP-6008
                    }
                    catch (err) {
                        console.log("WOMI resize error catched.");
                    }
                    targetHeader.parent().attr("folded-height", target.height());
                    target.hide();
                    target.css('opacity', '1');

                }
                if (!targetHeader.parent().attr("collapsed-height")) {
                    targetHeader.parent().attr("collapsed-height", $(targetHeader.parent().find('.note-contents-header')).height());
                }

                target.css('height', targetHeader.parent().attr("collapsed-height"));
                target.show();
                $(targetHeader.parent().find('.note-contents-header')).toggle();

                target.animate({ height: targetHeader.parent().attr("folded-height") }, { queue: false, duration: 300, complete: function () {
                    target.addClass('in-x');
                    $('.foldable>.foldable-header, .foldable>.note-header').on('click', onClickFoldable);
                }
                });
            }
        } else { // toggle whole content
            target.fold("toggle");
        }

        //2. Toggle the target header:
        if (targetHeader.parent().hasClass('note-curiosity') && !($('#reader-definition[data-stylesheet=standard-2-przyroda]'))) { // Toggle curiosity additional header with LESS/MORE
            if ($(targetHeader.parent().find('.section-without-header')).html() == LESS) {
                $(targetHeader.parent().find('.section-without-header')).html(MORE);
            } else {
                $(targetHeader.parent().find('.section-without-header')).html(LESS);
            }
        } else { //Toggle section header
            if (targetHeader.find(".section-without-header").length > 0) {  // case for header-less sections

                if ($(targetHeader.find('.section-without-header')).html().indexOf(LESS) == 0) {
                    $(targetHeader.find('.section-without-header')).html(MORE + ADDITIONAL_IMAGE_HTML);
                } else {
                    $(targetHeader.find('.section-without-header')).html(LESS + ADDITIONAL_IMAGE_FOLDED_HTML);
                }

            } else { // case for header-full sections
                //console.log("rozwin");
                $(targetHeader.find('button.additional-image')).toggleClass("folded");
                if ($(targetHeader.find('button.additional-image')).hasClass('folded')) {
                    $(targetHeader.find('button.additional-image')).attr('title', TITLE_LESS);
                } else {
                    $(targetHeader.find('button.additional-image')).attr('title', TITLE_MORE);
                }
            }
        }

        // 3. Remember about WOMIs containers to resize:
        resizeWOMIs(foldableElement);

    }

    function resizeWOMIs(foldableElement) {
        var ws = foldableElement.find('.womi-container').toArray()
            .concat(foldableElement.find('.womi-gallery').toArray());
        WomiManager.resizeSelected(_.map(ws, function (w) {
            return $(w).data('womiObject')
        }));
    }

    function addFoldable() {

        var foldableElements = $('.foldable');

        /*The if-else clauses below are designed to make old markup work as not all collections have foldable headers and contents,
        so the code redundancy is on purpose. When all collections have foldable, foldable-header and foldable-contents
        classes this may be simplified again.
        */
        foldableElements.each(function () {

            var foldableElement = $(this);

            // let's hide whole content - the header if any left intact
            var targetContentsHeader = '';

            // curiosities should display some content even in collapsed state. Let's build it:
            if (foldableElement.hasClass('note-curiosity')) {
                targetContentsHeader = buildCuriosityContentHeader(foldableElement);

                if ($(targetContentsHeader).hasClass('short-curiosity')) { // this should not be foldable at all EPP-6303
                    foldableElement.removeClass('foldable');
                    return;
                }

                foldableElement.append($(targetContentsHeader));
                if (!($('#reader-definition[data-stylesheet=standard-2-przyroda]'))) {
                    foldableElement.append($('<a class="foldable-header section-without-header" href="#" style="display: block">' + MORE + '</a>'));
                }
            }

            var targetContents = '';
            if (foldableElement.children('.foldable-contents').length > 0) {
                targetContents = foldableElement.children('.foldable-contents');
            }
            else {
                targetContents = foldableElement.children('.note-contents');
            }
            targetContents.css("overflow", "hidden");
            targetContents.slideUp(0);


            var targetHeaders = '';
            if (foldableElement.children('.foldable-header').length > 0) {
                targetHeaders = foldableElement.children('.foldable-header');
            }
            else {
                targetHeaders = foldableElement.children('.note-header');
            }

            if (targetHeaders.length == 0) { //in some weird cases sections do not have headers, we have to build it:

                targetHeaders = $('<div class="section-header foldable-header section-without-header-wrapper">' +
                    '<a class="section-without-header" href="#" style="display: block">' + MORE + '</a></div>');
                if (!foldableElement.hasClass('note-curiosity')) { // append right side icon only to sections
                    $(targetHeaders.find('.section-without-header')).append(ADDITIONAL_IMAGE_HTML);
                }
                foldableElement.prepend(targetHeaders);
            } else { // we have proper headers
                if ($('#reader-definition[data-stylesheet=standard-2-przyroda]') || !foldableElement.hasClass('note-curiosity')) { // append right side icon only to sections
                    targetHeaders.append(ADDITIONAL_IMAGE_HTML);
                }
            }

            $('.foldable>.foldable-header, .foldable>.note-header').off('click').on('click', onClickFoldable);

            if (foldableElement.find(location.hash).length) {
                targetHeaders.first().click();
            }
        });
        // not needed now - links in foldables are cloned now with handlers,
        // on the other hand tooltips are not cloned anymore, so this make us some troubles in case of unfolded curiosities
        // so uncomment only if tooltip mechanism use cloning again.
        /*$('.note-contents-header a').each(function() {
            var _this = $(this);
            _this.click(function(event) {
                event.preventDefault();
                $('.foldable-contents a').filter(function() {
                    return $(this).html() == _this.html();
                }).click();
            });
        });*/
    }

    return {
        addFoldable: addFoldable
    };

});



