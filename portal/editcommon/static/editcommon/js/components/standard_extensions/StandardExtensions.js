define(['jquery'], function ($) {

    $.fn.extend({
        disable: function() {
            return this.each(function() {
                this.disabled = true;
            });
        },
        enable: function() {
            return this.each(function() {
                this.disabled = false;
            });
        },
        toggleEnabled: function(state) {
            return this.each(function() {
                this.disabled = !state;
            });
        }
    });
});
