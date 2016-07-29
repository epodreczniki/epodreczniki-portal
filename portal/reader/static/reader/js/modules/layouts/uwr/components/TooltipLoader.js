define([
    'modules/layouts/default/components/TooltipLoader'
], function (TooltipLoader) {

    return TooltipLoader.extend({
        tooltipWidth: '290px',

        beforeCloseTooltip: function(tooltipPlace, tooltipHelper) {
            tooltipPlace.remove();
        }
    });
});
