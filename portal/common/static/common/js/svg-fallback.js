define(['jquery'], function ($) {
    'use strict';

    var supportsSVG = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

    var handleSVGImages = function () {
        if (!supportsSVG) {
            console.log('SVG not supported, replacing images with fallback content');

            $('img[src*="svg"]').attr('src', function () {
                var newsrc = null;

                if ($(this).data('fallback')) {
                    newsrc = $(this).data('fallback');
                } else {
                    newsrc = $(this).attr('src').replace('.svg', '.png');
                }

                return newsrc;
            });
        }
    };

    if (!supportsSVG) {
        $(document).ready(function () {
            handleSVGImages();
        });

        $('html').addClass('no-svg');
    } else {
        $('html').addClass('svg');
    }

    return {
        handleSVGImages: handleSVGImages
    };
});