define(['jquery'], function ($) {

    $(document).ready(function () {

        $(".profile-topbar-menu").find(".profile").addClass("active-tab");
        $(".profile-tab").addClass("visible-tab");

        $(".inner > div").click(function () {
            var clickedTab = $(this).attr("class") + "-tab";
            console.log("Clicked: " + clickedTab);

            $(".inner > div").removeClass("active-tab");
            $(this).addClass("active-tab");

            $(".profile-page-tab").removeClass("visible-tab");
            $("." + clickedTab + "").addClass("visible-tab");


        });

       /* $(function () {
            $("#book-title-select").selectmenu();
        });*/
    });


});