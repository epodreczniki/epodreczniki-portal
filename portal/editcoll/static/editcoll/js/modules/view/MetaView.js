define(['jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {
    return Backbone.View.extend({
        remove: function () {
            $(this.el).empty().detach();
            return this;
        },

        _metadataChanged: function () {
        },

        render: function () {
            var _this = this;
            _this.$el.html(_.template(this.template, {}));
            _this.$el.find("#metadata-tabs").tabs({
                hide: { effect: 'blind', duration: 200 },
                show: { effect: 'blind', duration: 200 }
            });
            this.addWatchers();
            this.formatOutput();
        },

        addWatchers: function(){
            this.$el.find('input').change(this._triggerInputChange());
            this.$el.find('select').change(this._triggerInputChange());
        },

        _triggerInputChange: function(){
            var _this = this;
            return function(){
                _this.trigger('inputChanged');
            };
        },

        disabled: function(disabled){
            this._disabled = disabled;
            this.formatOutput();
        },

        formatOutput: function() {
            this.$el.find('input').attr('disabled', this._disabled);
            this.$el.find('select').attr('disabled', this._disabled);
            this.$el.find('button').attr('disabled', this._disabled);
        }
    });
});
