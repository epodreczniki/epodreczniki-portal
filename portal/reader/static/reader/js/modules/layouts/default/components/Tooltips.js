define([
    '../../Component'
], function(
    Component
) {

    return Component.extend({

        postInitialize: function(options) {
            this.listenTo(this._layout, 'allWomiLoaded', function() {
                var tooltipsyOpts = {
                    className: 'base-tooltip-black',
                    alignTo: 'element',
                    offset: [0, 1]
                };

                var toggles = $('.solution-toggle');
                var check = $('.qmlitem .check');

                toggles.each(function(i, o) {
                    var t = $(o).attr('value');
                    $(o).attr('title', t);
                    $(o).tooltipsy(tooltipsyOpts);
                });



                // This goes for our exercises, as we can controll
                // all attr in DOM, I assume that titles are set, so just create
                // tooltipsy on each btn.

                var isMath = $('#reader-definition').attr('data-stylesheet')
                             === 'standard-2-matematyka';

                if (isMath) {
                    var buttons = $('.exercise-buttons, .solution-toggles, .commentary-toggles').children();
                    check = $.merge(check, buttons);
                    $.unique(check);
                }

                check.each(function(i, o) {

                    if($(o).text()) {
                        $(o).attr('title', $(o).text());
                        $(o).tooltipsy(tooltipsyOpts);
                    }

                });

            });
        }

    });

});
