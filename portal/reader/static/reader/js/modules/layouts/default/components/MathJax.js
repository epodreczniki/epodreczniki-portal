define(['jquery', '../../Component', 'underscore'], function ($, Component, _) {

    return Component.extend({
        name: 'EpoMathJax',
        load: function () {
            var _this = this;

            this.listenTo(this._layout, 'moduleLoaded', _this.setupMathml);
        },

        setupMathml: function() {
            var mathElems = $('ol.lower-alpha').filter(function() {
                return $(this).find('> .item > div > .mathml-wrapper').length > 0;
            });
            mathElems.addClass('has-mathml');

            $.each(mathElems.find('li.item'), function(key, listItem) {
                var decorationMargin = (parseInt($(listItem).css('height')) - parseInt($(listItem).css('padding-bottom')))/2 - 11;
                if(decorationMargin>0) {
                    $(listItem).find('span.item-decoration').css('margin-top', decorationMargin.toString() + 'px');
                }
            });

            $('div.answers-container').filter(function() {
                return $(this).find('> .answer > label > .mathml-wrapper').length > 0;
            }).addClass('has-mathml');

            function toggleScroll(){
                $('.mathml-wrapper').each(function() {
                    var wrapper = $(this);
                    wrapper.toggleClass('mathml-scroll', wrapper.children('.MathJax').width() > wrapper.parent().width());
                });
            }

            $('input.commentary-toggle').on('click',function(){
                if ($('div.commentary').is(':visible')) {
                    toggleScroll();
                }
            });

            var setMathmlScroll = _.debounce(function() {
                toggleScroll();
            }, 100);

            setTimeout(setMathmlScroll, 1000);
            this._layout.on('windowResize', setMathmlScroll);
        }
    });
});
