define(['jquery',
    'underscore',
    'backbone',
    '../BlockView',
    '../../grid/Element',
    'modules/view/util/RTUtils',
    'text!../../../templates/PreviewBlockTemplate.html',
    '../../../models/gallery/GalleryItemCollection'], function ($, _, Backbone, BlockView, Element, RTUtil, PreviewTemplate, GalleryItemCollection) {
    var canAddNewBlock = true;
    var canRemoveNewBlock = true;
    var areButtonsVisible = true;
    var dragStartPoint = null;
    var dragStartPointSize = null;
    function getPos(e, grid) {
		return {
			x: Math.round(e.left / grid.model.get('a')) + 1,
			y: Math.round(e.top / grid.model.get('a')) + 1
		}
	};
    return {
        view: BlockView.extend({

            template: _.template(PreviewTemplate),

            render: function () {
            	var _this = this;
            	var imageLocation = null;
            	if(_this.model.get('attrType') == 'gallery'){
            		var blockID = _this.model.get('id');
            		_this.galleryItemCollection = new GalleryItemCollection([], {id: blockID});
					_this.galleryItemCollection.comparator = 'position';
					_this.galleryItemCollection.fetch();
					var models = _this.galleryItemCollection.toArray();
					
					var galleryImages = [];
					_.each(models, function(model) {
						galleryImages.push(RTUtil.getFullImage(model.get('attrWomi')));
					});
					var el = _this.template(_.extend({ image: galleryImages[0]}, _this.model.cssValues(true)));
                    _this.setElement($(el));

                    var galleryImage = null;
                    if(_this.$el.find('img').length > 0){
                    	galleryImage = _this.$el.find('img')[0];
                    }
                    _.each(galleryImages, function(url){
                    	var newImage = $('<img>', {style: 'max-width: 100%; max-height: 100%; float: left; z-index: -1; display:none;'});
                    	newImage.attr('src', url);
                    	$(galleryImage).after(newImage);
                    });
                    $(galleryImage).remove();
                    var x = 0; 
                    var prevImg = _this.$el.find('img')[0];
                    $(prevImg).show();
                    var speed = 400;
                    setInterval(function() {
                    	x = (x == galleryImages.length - 1) ? 0 : x + 1;
                    	var galleryImg = _this.$el.find('img')[x];
                    	$(prevImg).hide("slide", {direction: 'left'}, speed, function(){
                    		$(galleryImg).show("slide", {direction: 'right'}, speed);
                    	});
                    	
                    	prevImg = galleryImg;
                    },6000);
                    
            	}else{
            		 var el = _this.template(_.extend({ image: RTUtil.getFullImage(_this.model.get('attrWomi'))}, _this.model.cssValues(true)));
                     _this.setElement($(el));
            	}
            },

			afterInit: function (options) {				
				var _this = this;
				var containment = '#' + options.grid.$el.attr('id');
				this.$el.draggable({
					containment: containment,
					cursor: 'move',
					start: function(event, ui) {
						dragStartPoint = getPos(ui.helper.position(), _this.grid);
						dragStartPointSize = {
							width: _this.model.get('width'),
							height: _this.model.get('height')
						}
					}
				});
				this.$el.draggable('option', 'view', this);
				this.$el.resizable({
					containment: "parent",
					stop: _.bind(this.resizeStop, this),
					resize: _.bind(this.resizeResize, this),
					grid: this.model.get('a'),
					handles: 'n, e, s, w, ne, se, sw, nw'
				});
				this.$el.css('position', 'absolute');
				this._registerRemoveButton();
				this.registerSize({
					width: this.model.get('width'),
					height: this.model.get('height')
				});
				
				this.model.off('setButtonsVisible');
				this.model.off('setBlockDraggable');
				
				this.listenTo(this.model, 'setButtonsVisible', this.setButtonsVisible);
				this.listenTo(this.model, 'setBlockDraggable', this.setBlockDraggable);
				if (options.buttonsVisible != undefined) {
					this.setButtonsVisible(options.buttonsVisible);
				}
			},
			
			setButtonsVisible: function (visible) {
				this.$el.find('[data-role="block-buttons"]').css('display', visible ? 'block' : 'none');
				areButtonsVisible = visible;
			},
			
			setBlockDraggable: function (drag) {
				this.$el.draggable(drag ? "enable" : "disable");
				this.$el.resizable(drag ? "enable" : "disable");
				this.$el.css('z-index', drag ? "10" : "-10");
				canAddNewBlock = drag;
				canRemoveNewBlock = drag;
				
				// remember state
				var lastState = areButtonsVisible;
				this.setButtonsVisible(!drag ? false : areButtonsVisible);
				areButtonsVisible = lastState;
			},
			
			_registerRemoveButton: function () {
				var _this = this;
				this.$el.find('.remove-button').click(function () {
					if (!canRemoveNewBlock) {
						return;
					}
					if (confirm('Czy na pewno chcesz usunąć ten element?')) {
                		_this.remove();
                		_this.$el.remove();
                	};
				});
			},
			
			focus: function (model) {
				// currently disabled
				return;
				
				if (model !== this.model) {
					this.$el.removeClass('block-focus');
				} else {
					this.$el.addClass('block-focus');
				}
			},
			
			remove: function () {
				this.grid.blocks.remove(this.model);
			},

			resizeStop: function (e, ui) {
				var actualPosition = getPos(ui.position, this.grid);
				var dimensions = {
					width: Math.ceil(Math.abs(ui.size.width / this.model.get('a'))),
					height: Math.ceil(Math.abs(ui.size.height / this.model.get('a')))
				};
                var gridSize = {
					width: parseInt(this.grid.model.get('width')),
					height: parseInt(this.grid.model.get('height'))
				};
				
				// cut too long
				dimensions = {
					width: Math.min(dimensions.width, gridSize.width - actualPosition.x + 1),
					height: Math.min(dimensions.height, gridSize.height - actualPosition.y + 1)
				};
				
				// sanity check
				dimensions = {
					width: Math.max(1, dimensions.width),
					height: Math.max(1, dimensions.height)
				};
				actualPosition = {
					x: Math.min(actualPosition.x, gridSize.width),
					y: Math.min(actualPosition.y, gridSize.height)
				};
				
				this._updateModel(dimensions);
				this.registerSize({ width: Math.round(this.model.get('width')), height: Math.round(this.model.get('height'))});
				this.move(actualPosition);
				this.grid.trigger('blockResize', this.grid);
				
				this.$el.css("background-size", ui.size.width + "px " + ui.size.height + "px");
			},
		
			resizeResize: function (e, ui) {
				this.$el.find('.size-log').hide();
				this.$el.find('.remove-button').hide();
			},
		
			onModelChange: function (model) {
				var vals = model.cssValues(true);
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
				this.$el.find('.size-log').html(Math.round(pos.width) + "x" + Math.round(pos.height));
				this.$el.find('.size-log').show();
				this.$el.find('.remove-button').show();
			},

			move: function (pos) {
				this._updateModel(pos);
			}
        }),
        callbacks: {
            stateLoaded: function (grid) {
				var func = _.bind(this.drop(), grid);
				grid.$el.droppable({
					drop: func
				});
			},

			drop: function () {
				var _this = this;
				return function (event, ui) {
					var view = ui.draggable.draggable('option', 'view');
					if (view != null) {
						var gridSize = {
							width: parseInt(this.model.get('width')),
							height: parseInt(this.model.get('height'))
						};
						
						var point = getPos(ui.position, this);
						point = {
							x: Math.max(1, Math.min(point.x, gridSize.width - dragStartPointSize.width + 1)),
							y: Math.max(1, Math.min(point.y, gridSize.height - dragStartPointSize.height + 1))
						};
						
						view.move(point);
						this.trigger('blockDrop', this);
					}
				};
			},

			stateUnloaded: function (grid) {
				grid.$el.droppable('destroy');
			}
        },
        gridElement: Element.extend({
            events: {
                'click': 'onClick'
            },

            initialize: function (options) {
                Element.prototype.initialize.apply(this, arguments);
                this.grid = options.grid;
            },

            onClick: function () {
            	if (canAddNewBlock) {
                	this.grid.blocks.add({x: this.model.get('x'), y: this.model.get('y'), width: 1, height: 1});
                }
            }
        })
    };

});