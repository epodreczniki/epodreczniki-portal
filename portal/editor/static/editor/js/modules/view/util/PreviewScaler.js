define(['declare', 'jquery'], function (declare, $) {
    return declare({
        'static': {
            setPreview: function (board, width, height) {
                var w = $(window);
                var maxWidth = w.width() - 5;
                var maxHeight = w.height() - 5;


                var ratio = Math.min(maxWidth / width, maxHeight / height);

                board.height(height * ratio);
                board.width(width * ratio);
            }
        }
    });
});
