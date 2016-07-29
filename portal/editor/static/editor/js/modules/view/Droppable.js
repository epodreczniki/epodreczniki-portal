define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {

    return Backbone.View.extend({

        initialize: function(){
            this._dropInit();
        },

        _dropInit: function () {
            this.$el.bind("dragover", _.bind(this._dragOverEvent, this));
            this.$el.bind("dragenter", _.bind(this._dragEnterEvent, this));
            this.$el.bind("dragleave", _.bind(this._dragLeaveEvent, this));
            this.$el.bind("drop", _.bind(this._dropEvent, this));
            this._draghoverClassAdded = false
        },

        _dragOverEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent;
            var data = this._getCurrentDragData(e);

            if (this.dragOver(data, e.dataTransfer, e) !== false) {
                if (e.preventDefault) e.preventDefault();
                e.dataTransfer.dropEffect = 'copy'; // default
            }
        },

        _dragEnterEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent;
            if (e.preventDefault) e.preventDefault()
        },

        _dragLeaveEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent;
            var data = this._getCurrentDragData(e);
            this.dragLeave(data, e.dataTransfer, e)
        },

        _dropEvent: function (e) {
            if (e.originalEvent) e = e.originalEvent;
            var data = this._getCurrentDragData(e);

            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting

            if (this._draghoverClassAdded) this.$el.removeClass("draghover");

            this.drop(data, e.dataTransfer, e)
        },

        _getCurrentDragData: function (e) {
            var data = null;
            if (window._backboneDragDropObject) data = window._backboneDragDropObject;
            return data
        },

        dragOver: function (data, dataTransfer, e) { // optionally override me and set dataTransfer.dropEffect, return false if the data is not droppable
            this.$el.addClass("draghover");
            this._draghoverClassAdded = true
        },

        dragLeave: function (data, dataTransfer, e) { // optionally override me
            if (this._draghoverClassAdded) this.$el.removeClass("draghover")
        },

        drop: function (data, dataTransfer, e) {
            //console.log(data, dataTransfer, e);
        } // overide me!  if the draggable class returned some data on 'dragStart' it will be the first argument
    });

});