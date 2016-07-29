define(['jquery', 'underscore', 'backbone', 'text!../../templates/GridElementTemplate.html'], function ($, _, Backbone, GridElementTemplate) {
    return Backbone.View.extend({
        initialize: function (options) {
            this.grid = options.grid;
            var el = _.template(GridElementTemplate, this.model.cssValues());
            this.setElement($(el));
            this.$el.on('click', _.bind(this._onFocus, this));
        },

        _onFocus: function (e) {
            if (e.target == this.el) {
                this.grid.trigger('focus', null);
            }
        }
    });
});
