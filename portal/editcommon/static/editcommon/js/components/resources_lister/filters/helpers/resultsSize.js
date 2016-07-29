define(['jquery'], function($) {

    return function() {

        var winHeight = $(window).height();

        return Math.floor(winHeight / 34);

    };

});
