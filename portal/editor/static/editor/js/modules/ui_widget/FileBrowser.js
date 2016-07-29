define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    return Backbone.View.extend({
        template: _.template('<input style="display: none;" type="file" name="files[]"/>'),

        onChange: function (result) {
        },

        initialize: function (options) {
            options = options || {};
            this.input = $(this.template());
            this.$el.after(this.input);
            var _this = this;

            if(options.onChange){
                this.onChange = options.onChange;
            }

            this.input.on('change', function (evt) {
                var files = evt.target.files;
                if (files.length == 0) {
                    return;
                }
                var reader = new FileReader();
                reader.onload = function (e) {
                    _this.onChange(e.target.result);
                    _this.input.val(null);
                };

                reader.readAsText(files[0]);
            });

            this.$el.click(function () {
                _this.input.click();
            })
        }
    });
});
