require([
    'domReady',
    'jquery'
],
    function (domReady, $) {

        domReady(function () {
            $(".search-more").on('click', function () {
                $(".search-tabs").toggleClass("tabs-visible");
                $(".search-more").toggleClass("show-less");
                $(".search-under-topbar").toggleClass("search-expanded");
            });
        });

    });
