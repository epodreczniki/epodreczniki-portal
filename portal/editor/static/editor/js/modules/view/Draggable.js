define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    return Backbone.View.extend({
        initialize: function () {
            this._dragInit();
        },

        _dragInit: function(){
            this.$el.attr("draggable", "true");
            this.$el.bind("dragstart", _.bind(this._dragStartEvent, this));
        },

        _dragStartEvent: function (e) {
            var data;
            if (e.originalEvent) e = e.originalEvent;
            e.dataTransfer.effectAllowed = "copy"; // default to copy
            data = this.dragStart(e.dataTransfer, e);

            window._backboneDragDropObject = null;
            if (data !== undefined) {
                window._backboneDragDropObject = data; // we cant bind an object directly because it has to be a string, json just won't do
            }
        },

        dragStart: function (dataTransfer, e) {
           return this;
        } // override me, return data to be bound to drag
    })
});
