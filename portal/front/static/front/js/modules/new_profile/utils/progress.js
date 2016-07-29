define(['jquery', './circle-progress'], function ($) {

    function hashCode(str) { // java String#hashCode
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }

    function intToARGB(i) {
        return ''+//((i >> 24) & 0xFF).toString(16) +
            ((i >> 16) & 0xFF).toString(16) +
            ((i >> 8) & 0xFF).toString(16) +
            (i & 0xFF).toString(16);
    }

    function animateElements() {
        $('.recent-progress-graph').each(function () {
            var elementPos = $(this).offset().top;
            var topOfWindow = $(window).scrollTop();
            var percent = $(this).find('.circle').attr('data-percent');
            var percentage = parseFloat(percent) / parseFloat(100);
            var color = $(this).find('.circle').attr('data-color') + 'clr';
            color = intToARGB(hashCode(color));
            console.log(color);
            var animate = $(this).data('animate');
            if (elementPos < topOfWindow + $(window).height() - 30 && !animate) {
                $(this).data('animate', true);
                $(this).find('.circle').circleProgress({
                    startAngle: -Math.PI / 2,
                    value: percentage,
                    thickness: 6,
                    fill: {
                        color: '#' + color
                    },
                    size: 60
                }).on('circle-animation-progress', function (event, progress, stepValue) {
                    $(this).find('div').text((stepValue * 100).toFixed(0) + '%');//String(stepValue.toFixed(2)).substr(2) + '%');
                }).stop();
            }
        });
    }


    return animateElements;
});