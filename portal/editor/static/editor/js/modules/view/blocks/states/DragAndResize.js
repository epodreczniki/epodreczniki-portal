define(['jquery', 'underscore', 'backbone', '../BlockView'], function ($, _, Backbone, BlockView) {
    var DragAndResize = BlockView.extend({

        afterInit: function (options) {
            var containment = '#' + options.grid.$el.attr('id');
            this.$el.draggable({ containment: containment });
            this.$el.draggable('option', 'view', this);
            this.$el.resizable({
                containment: containment,
                stop: _.bind(this.resize, this),
                grid: this.model.get('a')
            });
            this.$el.css('position', 'absolute');
        },

        render: function () {
            var el = this.template(_.extend({}, this.model.cssValues(false)));
            this.setElement($(el));
        },

        resize: function (e, ui) {
            var dimensions = {
                width: ui.size.width / this.model.get('a'),
                height: ui.size.height / this.model.get('a')
            };
            this._updateModel(dimensions);
        },

        focus: function(model){
        },

        onModelChange: function (model) {
            var vals = model.cssValues(false);
            this.$el.css({
                left: vals.x,
                top: vals.y,
                width: vals.width,
                height: vals.height,
                'background-color': vals.color
            });
        },

        move: function (pos) {
            this._updateModel(pos);
        }
    });

    var gridCallbacks = {
        stateLoaded: function (grid) {
            var func = _.bind(this.drop(), grid);
            grid.$el.droppable({
                drop: func
            });
        },

        _getPos: function (e, grid) {
            return {
                x: Math.floor(e.left / grid.model.get('a')) + 1,
                y: Math.floor(e.top / grid.model.get('a')) + 1
            }
        },

        drop: function () {
            var _this = this;
            return function (event, ui) {
                ui.draggable.draggable('option', 'view').move(_this._getPos(ui.position, this));
            };
        },

        stateUnloaded: function (grid) {
            grid.$el.droppable('destroy');
        }
    };
    return {
        view: DragAndResize,
        callbacks: gridCallbacks
    }

});
