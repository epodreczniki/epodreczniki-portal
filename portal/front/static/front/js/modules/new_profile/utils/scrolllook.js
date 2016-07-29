define(['jquery'], function ($) {

    return function(){
        var menu = $('.topbar-menu');
        var info = $('.showcase-topbar-menu');
        var content = $('#content-wrap');
        $(window).on('scroll', function(){
            if($(window).scrollTop() > 40){
                menu.addClass('fixed');

            }else{
                menu.removeClass('fixed');
            }

            if($(window).scrollTop() > 200){
                info.addClass('fixed');

            }else{
                info.removeClass('fixed');
            }
        });
    }
});