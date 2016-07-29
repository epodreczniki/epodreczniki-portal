define(['jquery', 'domReady'], function ($, domReady) {

    var bookWidth = 236;
    return function () {
        var books = $('#books-roll');
        books.css('width', bookWidth * books.children().length);

        var bookColl = books.children();

        //var descr = $(".books-gallery-description");

        bookColl.each(function (ind, el) {
            var t = $(this);
            var i = (ind);
            t.css('left', bookWidth * i);
            t.attr('data-index', i);
            t.find('.book-cover').attr('data-index', i);
            /*if (i == 0) {
                descr.text(t.data('title'));
            }*/
        });

        function shift(pos) {
            bookColl.each(function (ind, el) {
                var t = $(this);
                var i = parseInt(t.attr('data-index')) + pos;
                t.animate({'left': bookWidth * i});
                t.attr('data-index', i);
                t.find('.book-cover').attr('data-index', i);
                /*if (i == 3) {
                    descr.text(t.data('title'));
                }*/
            });
        }


        $('#books-left').click(function () {
            if(parseInt($(bookColl[bookColl.length-1]).attr('data-index')) == 3){
                return;
            }
            shift(1);
        });

        $('#books-right').click(function () {
            if(parseInt($(bookColl[0]).attr('data-index')) == 3){
                return;
            }
            shift(-1);
        });

    };
});