define(['jquery',
    'underscore',
    'backbone',
    '../BlockView',
    '../../grid/Element',
    'text!../../../templates/GridEditBlockTemplate.html'], function ($, _, Backbone, BlockView, Element, GridEditBlockTemplate) {
    var DragAndResize = BlockView.extend({

        template: _.template(GridEditBlockTemplate),

        afterInit: function (options) {
            var containment = '#' + options.grid.$el.attr('id');
            this.$el.draggable({
            	containment: containment,
            	cursor: 'move'
            });
            this.$el.draggable('option', 'view', this);
            this.$el.resizable({
                containment: containment,
                stop: _.bind(this.resize, this),
                resize: _.bind(this.startDrag, this),
                grid: this.model.get('a'),
                handles: 'n, e, s, w, ne, se, sw, nw'
            });
            this.$el.css('position', 'absolute');
            this._registerRemoveButton();
        },
        _registerRemoveButton: function () {
            var _this = this;
            this.$el.find('.remove-button').click(function () {
                _this.remove();
            });
        },
        focus: function (model) {
            if (model !== this.model) {
                this.$el.removeClass('block-focus');
            } else {
                this.$el.addClass('block-focus');
            }
        },
        remove: function () {
            this.grid.blocks.remove(this.model);
        },

        render: function () {
            var el = this.template(_.extend({}, this.model.cssValues(true)));
            this.setElement($(el));
            this.registerSize({ width: Math.round(this.model.get('width')), height: Math.round(this.model.get('height'))});
        },

        resize: function (e, ui) {
        	var actualPosition = this._getPos(ui.position, this.grid);
        	var dimensions = {
                width: ui.size.width / this.model.get('a'),
                height: ui.size.height / this.model.get('a')
            };

            this._updateModel(dimensions);
            this.registerSize({ width: Math.round(this.model.get('width')), height: Math.round(this.model.get('height'))});
            this.move(actualPosition);
			this.grid.trigger('blockResize', this.grid);
        },
		
		startDrag: function (e, ui) {
			this.$el.find('.size-log').hide();
			this.$el.find('.remove-button').hide();
		},
		
        onModelChange: function (model) {
            var vals = model.cssValues(false);
            var values = {
                left: vals.x,
                top: vals.y,
                width: vals.width,
                height: vals.height
            };
            this.$el.css(values);
            this.$el.find('.relative-div').css(_.pick(values, 'width', 'height'));
        },

        registerSize: function (pos) {
            this.$el.find('.size-log').html(pos.width + "x" + pos.height);
        	this.$el.find('.size-log').show();
			this.$el.find('.remove-button').show();
        },

        move: function (pos) {
        	this._updateModel(pos);
        },

        _getPos: function (e, grid) {
            return {
                x: Math.round(e.left / grid.model.get('a')) + 1,
                y: Math.round(e.top / grid.model.get('a')) + 1
            }
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
                x: Math.round(e.left / grid.model.get('a')) + 1,
                y: Math.round(e.top / grid.model.get('a')) + 1
            }
        },

        drop: function () {
            var _this = this;
            return function (event, ui) {
            	var view = ui.draggable.draggable('option', 'view');
            	if (view != null) {
            		view.move(_this._getPos(ui.position, this));
            		this.trigger('blockDrop', this);
            	}
            };
        },

        stateUnloaded: function (grid) {
            grid.$el.droppable('destroy');
        }
    };
    return {
        view: DragAndResize,
        callbacks: gridCallbacks,
        gridElement: Element.extend({
            events: {
                'click': 'onClick'
            },

            initialize: function (options) {
                Element.prototype.initialize.apply(this, arguments);
                this.grid = options.grid;
            },

            onClick: function () {
                this.grid.blocks.add({x: this.model.get('x'), y: this.model.get('y'), width: 1, height: 1});
            }
        })
    }

});

