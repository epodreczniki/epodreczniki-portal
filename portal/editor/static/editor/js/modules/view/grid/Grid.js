define(['jquery',
    'underscore',
    'backbone',
    '../../models/GridElementCollection',
    '../../models/blocks/BlockCollection',
    './Element',
    '../util/ColorPool'
], function ($, _, Backbone, GridElementCollection, BlockCollection, Element, ColorPool) {
    function isCollide(a, b) {
        return !(
            ((a.get('y') + a.get('height')) <= (b.get('y'))) ||
                (a.get('y') >= (b.get('y') + b.get('height'))) ||
                ((a.get('x') + a.get('width')) <= b.get('x')) ||
                (a.get('x') >= (b.get('x') + b.get('width')))
            );
    }

    function isOutbound(grid, b) {
        return (
            ((grid.get('y') + grid.get('height')) < (b.get('y') - 1 + b.get('height'))) ||
                ((grid.get('x') + grid.get('width')) < (b.get('x') - 1 + b.get('width')))
            );
    }

    return Backbone.View.extend({
        defaults: {
            width: 10,
            height: 13,
            a: 100, //px
            collision: false
        },

        resize: function (e) {
            if (e.target == window) {
                this.render();
            }
        },

        initialize: function (options) {
            this.colorPool = new ColorPool();
            this.gridElements = new GridElementCollection();
            this.blocks = new BlockCollection();
            this.blocks.fetch();
            this.colorPool.pointer = (this.blocks.length);// > 0 ? (this.blocks.length - 1) : 0);
            this.refillCollection();
            this.render();
            $(window).on('resize', _.debounce(_.bind(this.resize, this), 200));
            this.listenTo(this.blocks, 'add', this._addBlock);
            this.listenTo(this.blocks, 'remove', this._removed);
            this.listenTo(this, 'blockDrop', this._checkCollision);
            this.listenTo(this, 'blockResize', this._checkCollision);
            this.listenTo(this.blocks, 'blockChanged', this._checkCollision);
            this.listenTo(this.model, 'change:currentState', this._stateChanged);
            this.listenTo(this.model, 'sizeChanged', this._sizeChanged);
            this.listenTo(this.model, 'propXYchanged', this.propXYchanged);
            this.$el.on('click', _.bind(this._onFocus, this));
        },

        propXYchanged: function () {
            this.render();
        },

        refillCollection: function () {
            //this.options = _.extend(this.defaults, this.options);
            this.gridElements.reset();
            for (var i = 1; i <= this.model.get('height'); i++) {
                for (var j = 1; j <= this.model.get('width'); j++) {
                    this.gridElements.add({ x: j, y: i});
                }
            }
        },

        _getCalculatedSize: function () {
            var windowHeight = this.$el.height();
            var windowWidth = this.$el.width() - this.$el.position().left;
            return Math.floor(_.min([windowHeight / this.model.get('height'), windowWidth / this.model.get('width')]));
        },

        render: function () {
            var _this = this;
            var root = this.$el;
            var rootChildCenter = null;
            var state = this.model.get('currentState');
            var opts = null;

            // any state
            if (true /* state == Preview */) {

                root.attr('style', '');
                root.html('');
                
                if (this.model.get('currentBackground') == null) {
                	root.css("background-color", "rgba(0, 0, 0, 0.62)");
                	root.css("border", "none");
                }
                else {
                	root.css("background-color", "transparent");
                	root.css("border", "1px dashed #ff0000");
                }

                var propX = this.model.get('propX');
                var propY = this.model.get('propY');
                var windowHeight = this.$el.parent().height();
                var rootLeft = this.$el.position().left;
                var windowWidth = this.$el.parent().width() - 2 * rootLeft;

                var propSize = Math.floor(_.min([windowWidth / propX, windowHeight / propY]));
                var rootHeight = propSize * propY;
                var rootWidth = propSize * propX;
                var itemSize = (_.min([rootHeight / this.model.get('height'), rootWidth / this.model.get('width')]));
                //EPGE-124 Math.floor causing problems for grids bigger than 16x9 - removed
                this.model.set('a', itemSize);
                opts = this.model.cssValues();

                root.height(rootHeight);
                root.width(rootWidth);

                // child div center
                var gridHeight = this.model.get('height');
                var gridWidth = this.model.get('width');

                rootChildCenter = $("<div>", { id: "rootChildCenter" });
                rootChildCenter.width(itemSize * gridWidth);
                rootChildCenter.height(itemSize * gridHeight);
                rootChildCenter.css("margin", "auto");
                rootChildCenter.css("position", "absolute");
                rootChildCenter.css("left", -2);
                rootChildCenter.css("top", -2);
                rootChildCenter.css("bottom", 0);
                rootChildCenter.css("right", 0);
                root.append(rootChildCenter);

                // center root
                var posLeft = rootLeft + (windowWidth - rootWidth) / 2;
                var posTop = (windowHeight - rootHeight) / 2;
                root.css("left", posLeft + "px");
                root.css("top", posTop + "px");
            }
            this.gridElements.each(function (element) {
                element.set('a', opts.a);
                var Elem = (state.gridElement ? state.gridElement : Element);
                var ElemEl = (new Elem({model: element, grid: _this})).el;

				// any state
				var visible = _this.model.get('gridVisible');
				$(ElemEl).css("display", visible ? "block" : "none");
				rootChildCenter.append(ElemEl);
            });
            var View = this.model.get('currentState').view;
            this.blocks.each(function (element) {
                element.save('a', opts.a);
                var BlockEl = (new View({model: element, grid: _this, buttonsVisible: _this.model.get('buttonsVisible') })).el;

				// any state
                rootChildCenter.append(BlockEl);
            });
            this._checkCollision();

            return this;
        },

        _checkCollision: function () {
            var _this = this;

            var collision = false;
            this.blocks.each(function (block) {
                _this.blocks.each(function (block2) {
                    if (block2.id != block.id) {
                        if (isCollide(block2, block)) {
                            collision = true;
                        }
                    }
                });
            });
            this.collision = collision;
            if (this.collision) {
                this.trigger('collisionDetected', true);
            } else {
                this.trigger('collisionDetected', false);
            }
        },

        _stateChanged: function (model, options) {
            model.previous('currentState').callbacks.stateUnloaded(this);
            model.get('currentState').callbacks.stateLoaded(this);
            this.render();
        },

        _onFocus: function (e) {
            if (e.target == this.el) {
                this.trigger('focus', null);
            }
        },

        _sizeChanged: function (model, options) {
            this.refillCollection();
            this._clearOutbound();
            this.render();
        },

        _clearOutbound: function () {
            var gridWidth = this.model.get('width');
            var gridHeight = this.model.get('height');
            var grid = { 'get': function (param) {
                return ({
                    width: parseInt(gridWidth),
                    height: parseInt(gridHeight),
                    x: 0,
                    y: 0
                })[param];
            }};
            this.blocks.each(function (block) {
                if(isOutbound(grid, block)){
                    block.destroy();
                }
            });
        },

        _addBlock: function (block) {
        	var _this = this;
            var root = this.$el.find('#rootChildCenter');
            block.save({
                'a': this.model.get('a'),
                'color': ColorPool.defaultColor//this.colorPool.nextColor()
            });
            var View = this.model.get('currentState').view;
            root.append((new View({model: block, grid: _this})).el);
            this._checkCollision();
            addLeaveWarning();
        },

        _removed: function (block) {
            block.destroy();
            this._checkCollision();
            //this.render();
            addLeaveWarning();
        }
    });
});
