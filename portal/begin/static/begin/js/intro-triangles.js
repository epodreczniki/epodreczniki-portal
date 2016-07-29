/* Show/hide the triangles on intro page */
jQuery.flexslider.defaults.slideshow = false;
jQuery.flexslider.defaults.controlsContainer = $('<div>');

jQuery(".header-block-3").each(function (index, element) {
    $(element).on({
        mouseenter: function () {
            //stuff to do on mouse enter
            jQuery(this).children(".intro-triangle-div").css('display', 'block');
            $('.slider').flexslider(index);
            /*var color = jQuery(this).css('background-color');
             color = 'transparent transparent ' + color + ' transparent';
             jQuery(this).children(".intro-triangle-div").css('border-color', color);*/
        },
        mouseleave: function () {
            //stuff to do on mouse leave
            jQuery(this).children(".intro-triangle-div").css('display', 'none');
        }

    });
});

jQuery('.header-block-inner.usertype-intro').mouseleave(function () {
    $('.slider').flexslider(0);
});
