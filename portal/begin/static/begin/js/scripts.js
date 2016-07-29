// Set Variables
var search_toggle = 'closed';

jQuery(document).ready(function() { 
	
	// Main Menu Drop Down
	jQuery('ul#main-menu').superfish({ 
        delay:       600,
        animation:   {opacity:'show',height:'show'},
        speed:       'fast',
        autoArrows:  true,
        dropShadows: false
    });
	
	// Accordion
	jQuery( ".accordion" ).accordion( { autoHeight: false } );

	// Toggle
	jQuery( ".toggle > .inner" ).hide();
	jQuery(".toggle .title").toggle(function(){
		jQuery(this).addClass("active").closest('.toggle').find('.inner').slideDown(200, 'easeOutCirc');
	}, function () {
		jQuery(this).removeClass("active").closest('.toggle').find('.inner').slideUp(200, 'easeOutCirc');
	});

	// Tabs
	jQuery(function() {
		jQuery( "#tabs" ).tabs();
	});
	
	// PrettyPhoto
	jQuery(document).ready(function(){
		jQuery("a[rel^='prettyPhoto']").prettyPhoto();
	});
	
	// Search Button Toggle
	jQuery(".menu-search-button").click(function() {
		jQuery(".menu-search-field").toggleClass("menu-search-focus", 200);
	});

    //alert(HCTest());
});

function changeSlide(slider) {
    if (slider.container) {
//        slider.find('ul.flex-direction-nav a').attr('role', 'button');
        slider.container.find('a, iframe').attr('tabindex', '-1');
        slider.slides.eq(slider.currentSlide).find('a, iframe').not('.news-image a').removeAttr('tabindex');
        slider.find('li.clone').attr('aria-hidden', 'true');
        slider.slides.attr('aria-hidden', 'true');
        slider.slides.eq(slider.currentSlide).attr('aria-hidden', 'false');
    }
}

// Main Slider
jQuery(window).ready(function(){
  jQuery('.slider').flexslider({
    animation: "slide",
	controlNav: false,
    multipleKeyboard: true,
    prevText: "Poprzedni",
    nextText: "Następny",
	before: function(slider) {
      slider.find('.slide-loader').removeClass('slide-loader');
        slider.find('ul.flex-direction-nav').attr('role', 'navigation');
        slider.find('ul.flex-direction-nav a').attr('role', 'button');
    },
      start: changeSlide,
      after: changeSlide
  });
});

// Page Slider
jQuery(window).ready(function(){
  jQuery('.page-slider').flexslider({
    animation: "slide",
	controlNav: false,
    multipleKeyboard: true,
    prevText: "Poprzedni",
    nextText: "Następny",

	start: function(slider){
		//jQuery('body').removeClass('loading');
        slider.find('ul.flex-direction-nav').attr('role', 'navigation');
        slider.find('ul.flex-direction-nav a').attr('role', 'button');
        changeSlide(slider);
    },
      after: changeSlide
  });
});

blockSliderOptions = {
    animation: "slide",
    controlNav: false,
	directionNav: true,
	slideshow: false,
	smoothHeight: true,
    multipleKeyboard: true,
    prevText: "Poprzedni",
    nextText: "Następny",

      start: function (slider) {
		//jQuery('body').removeClass('loading');
          slider.find('.slide-loader2').removeClass('slide-loader2');
          slider.find('iframe').css('visibility','visible');
          slider.find('ul.flex-direction-nav').attr('role', 'navigation');
          slider.find('ul.flex-direction-nav a').attr('role', 'button');
          changeSlide(slider);
          var blockName = slider.closest('.content-block').find('.block-title').text();
          slider.find('.flex-prev, .flex-next').append(' ' + blockName);
      },
      after: changeSlide
  };

// Block Slider
jQuery(window).ready(function(){
  jQuery('.slider-blocks.slider-news').flexslider(blockSliderOptions);
});

jQuery(window).load(function(){
  jQuery('.slider-blocks.slider-video').flexslider(blockSliderOptions);
});


// Scroll to top
jQuery(document).ready(function(){
	
	jQuery(window).scroll(function(){
		if (jQuery(this).scrollTop() > 100) {
			jQuery('.scrollup').fadeIn();
		} else {
			jQuery('.scrollup').fadeOut();
		}
	});
	
	jQuery('.scrollup').click(function(){
		jQuery("html, body").animate({ scrollTop: 0 }, 600);
		return false;
	});
	
});

jQuery(function () {
	
	// Mobile Menu
	jQuery('#main-menu').tinyNav({
		active: 'selected',
        header: 'POLECAMY:',
		label: ''
	});
    // get rid of dead links in menu
    jQuery('#tinynav1').find("option[value='undefined']").remove();
	// Form Select Styling
	jQuery("select").uniform();


});

// EPP-5721 - detecting high contrast mode
jQuery(function () {
    var objDiv, strColor;
    objDiv = document.createElement('div');
    objDiv.style.color = 'rgb(31, 41, 59)';
    document.body.appendChild(objDiv);
    strColor = document.defaultView ? document.defaultView.getComputedStyle(objDiv, null).color : objDiv.currentStyle.color;
    strColor = strColor.replace(/ /g, '');
    document.body.removeChild(objDiv);
    if (strColor !== 'rgb(31,41,59)') {
        $('body').addClass('high-contrast');
    }
});

// EPP-3716 - tabbing outside of fancybox
$(document).on('keyup', function (event) {
    if (event.keyCode == 9 && $('.fancybox-overlay').length) {
        var focused = $(':focus');
        console.log(focused.closest('.fancybox-overlay').length);
        if (focused.closest('.fancybox-overlay').length == 0) {
            var selector = $('.fancybox-overlay').find('a[href], input[type!="hidden"], button').filter(':visible');
            if (event.shiftKey) {
                selector.last().focus();
            } else {
                selector.first().focus();
            }
        }
    }
});