/* Wersja testowa - później napisać animację z liczeniem pozycji elementów, uwzględniającą skalowanie */

require(['domReady',
    'jquery', 'underscore'
],
    function (domReady, $, _) {
        domReady(function () {

            $.easing.kastom = function (x, t, b, c, d) {
                var ts = (t /= d) * t;
                var tc = ts * t;
                return b + c * (13.3975 * tc * ts + -54.39 * ts * ts + 80.485 * tc + -52.39 * ts + 13.8975 * t);
            };

            //IE Mobile fix
            if (navigator.userAgent.match(/IEMobile/)) {
                var msViewportStyle = document.createElement("style");
                msViewportStyle.appendChild(
                    document.createTextNode(
                        "@-ms-viewport{width:auto!important}"
                    )
                );
                document.getElementsByTagName("head")[0].
                    appendChild(msViewportStyle);
            }

            /*function calculateMainDiv() {

             var topbarHeight = $('.topbar').outerHeight();
             var footerHeight = $('#footer-welcome').outerHeight();
             var mainDivMinHeight = $(window).innerHeight() - topbarHeight - footerHeight - 80; //no scroll for full HD; 80px is the margin in main div
             $('#main-div').css('min-height', '' + mainDivMinHeight + 'px');

             };

             calculateMainDiv();

             $(window).resize(function () {
             calculateMainDiv();
             });*/

            var counter = 0;

            function circleOnClick(ev) {
                ev.target = this;
                ev.preventDefault();
                var centralCircleSize = 210;
                if (counter == 0) {
                    $(this).animate({"width": centralCircleSize * 1.25, "height": centralCircleSize * 1.25, "top": centralCircleSize * 0.125 }, 500, 'swing');
                    $(this).addClass('active');
                    counter++;

                }
                else {

                    if (!$(this).hasClass('active')) {
                        closeAllActive();
                        $(this).animate({"width": centralCircleSize * 1.25, "height": centralCircleSize * 1.25, "top": centralCircleSize * 0.125 }, 500, 'swing');
                    } else {
                        $(this).animate({"width": centralCircleSize, "height": centralCircleSize, "top": "0px"}, 0, 'swing');
                    }
                    $(this).toggleClass('active');
                }

                var details = $(this).parent().find('.details-circle');
                animateDetails(this);
                //animateChaptersOld(this);
                animateChapters(this);
            };
            $('.central-circle').on('click', _.debounce(circleOnClick, 500, true));


            function closeAllActive() {

                $('.central-circle.active').each(function () {

                    var centralCircleSize = 210;

                    $(this).animate({"width": centralCircleSize, "height": centralCircleSize, "top": "0px"}, 0, 'swing');

                    $(this).removeClass('active');


                    var details = $(this).parent().find('.details-circle');
                    animateDetails(this);
                    //animateChaptersOld(this);
                    animateChapters(this);
                });

            }

            function animateDetails(centralCircle) {
                var details = $(centralCircle).parent().find('.details-circle');

                detailsShownTop = "412.5px";
                detailsHiddenTop = "311.5px";

                if ($(centralCircle).hasClass("active")) {
                    $(details).find("span").addClass('active');
                    details.animate(
                        {"top": detailsShownTop},
                        1000,
                        'kastom'
                    );

                }
                else {
                    details.animate(
                        {"top": detailsHiddenTop},
                        'fast',
                        'swing'
                    );
                    $(details).find("span").removeClass('active');
                }
                return false;
            }


            function animateChapters(centralCircle) {

                var chapterList = $(centralCircle).parent().find('.chapter-list');

                this.chapters = new Array();

                this.chapters = $(chapterList).find('.chapter-circle');
                var properHeight = ($(this.chapters[0]).hasClass('volumized') ? '195px' : '145px');

                if (!$(centralCircle).hasClass("active")) {
                    $(this.chapters[0]).css('width', '115').css('height', '115');
                    $(this.chapters[0]).animate(
                        {"left": "+=137px", "top": "+=75px", "width": "115px", "height": "115px"},
                        'fast',
                        'swing'
                    );
                    $(this.chapters[1]).css('width', '115').css('height', '115');
                    $(this.chapters[1]).animate(
                        {"left": "+=60px", "top": "+=155px", "width": "115px", "height": "115px"},
                        'fast',
                        'swing'
                    );
                    $(this.chapters[2]).css('width', '115').css('height', '115');
                    $(this.chapters[2]).animate(
                        {"left": "-=37px", "top": "+=155px", "width": "115px", "height": "115px"},
                        'fast',
                        'swing'
                    );
                    $(this.chapters[3]).css('width', '115').css('height', '115');
                    $(this.chapters[3]).animate(
                        {"left": "-=110px", "top": "+=75px", "width": "115px", "height": "115px"},
                        'fast',
                        'swing'
                    );
                    $(chapterList).find('.chapter-circle').removeClass('active');
                    $(chapterList).find('.chapter-circle span').removeClass('active');


                }
                else {
                    $(chapterList).find('.chapter-circle').addClass('active');
                    $(chapterList).find('.chapter-circle span').addClass('active');

                    $(this.chapters[0]).animate(
                        {"left": "-=137px", "top": "-=75px", "width": "145px", "height": properHeight},
                        1000,
                        'kastom'
                    );
                    $(this.chapters[1]).animate(
                        {"left": "-=60px", "top": "-=155px", "width": "145px", "height": properHeight},
                        1000,
                        'kastom'
                    );

                    $(this.chapters[2]).animate(
                        {"left": "+=37px", "top": "-=155px", "width": "145px", "height": properHeight},
                        1000,
                        'kastom'
                    );

                    $(this.chapters[3]).animate(
                        {"left": "+=110px", "top": "-=75px", "width": "145px", "height": properHeight},
                        1000,
                        'kastom'
                    );

                    this.chapters = [];


                }
            }

        });

        $('#camera').click(function () {
            $.fancybox({type: 'iframe',
                href: $('#showcase-video').data('showcase-url'),
                width: '100%',
                height: '100%',
                autoSize: false,
                topRatio: 0,
                leftRatio: 0,
                margin: 1,
                padding: 1,
                scrolling: 'no'});
        });

        if (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)) {
            $('#footer-welcome').css('padding-left', '0px');
            $('#footer-welcome').css('padding-right', '16px');
            $('#footer-welcome').css('width', '100%');
        }
    }
);
