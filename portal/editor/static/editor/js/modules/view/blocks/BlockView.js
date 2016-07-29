define(['jquery',
    'underscore',
    'backbone',
    '../util/ModelAttributesMaker',
    'text!../../templates/BlockTemplate.html'], function ($, _, Backbone, ModelAttributesMaker, BlockTemplate) {
    return Backbone.View.extend({
        initialize: function (options) {
            this.grid = options.grid;
            if (!this.template) {
                this.template = _.template(BlockTemplate);
            }
            this.render();
            this.listenTo(this.model, 'change', this.onModelChange);
            this.afterInit(options);
            this.$el.on('click', _.bind(this._onFocus, this));
            this.listenTo(this.grid, 'focus', this.focus);
        },

        afterInit: function (options) {
        }, //api method to override by state

        render: function () {
            var el = this.template(_.extend({attrs: ModelAttributesMaker.getAttrs(this.model, 'attr')}, this.model.cssValues()));
            this.setElement($(el));
            this.afterRender();
        },

        afterRender: function () {
        }, //api method to override by state

        onModelChange: function (model) {
            var vals = model.cssValues();
            this.$el.css({
                left: vals.x,
                top: vals.y,
                width: vals.width,
                height: vals.height//,
                //'background-color': vals.color
            });
            addLeaveWarning();

        },

        _onFocus: function (e) {
            if (e.target == this.el) {
                //e.stopImmediatePropagation();
                this.grid.trigger('focus', this.model);
            }
        },

        focus: function (model) {
            if (model === this.model) {
                this.$el.addClass('block-focus');
            } else {
                this.$el.removeClass('block-focus');
            }
        },

        _updateModel: function (vals) {
            if (_.isEmpty(this.model.save(vals).changed)) {
                this.model.trigger('change', this.model);
                this.model.collection.trigger('blockChanged', this.model);
            }
            addLeaveWarning();
        }
    });
});
