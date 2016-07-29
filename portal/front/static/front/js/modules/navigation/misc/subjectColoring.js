define(['jquery'], function ($) {
    return function () {
        $('.subject-li').each(function (index, entry) {
            var li = $(entry);
            var subjects = $('.book[data-subject-id = "' + li.data('subject-id') + '"]');
            li.hover(function () {
                subjects.each(function (index, entry) {
                    $(entry).addClass($(entry).data('subject-id'));
                });
            }, function () {
                subjects.each(function (index, entry) {
                    $(entry).removeClass($(entry).data('subject-id'));
                });
            });
        });
    };
});
