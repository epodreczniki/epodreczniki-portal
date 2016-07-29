define(['jquery',
    'underscore',
    'backbone',
    '../BlockView',
    '../../grid/Element',
    'text!modules/templates/ContextMenuTemplate.html'], function ($, _, Backbone, BlockView, Element, ContextMenuTemplate) {
    return {
        view: BlockView.extend({
            events: {
                'contextmenu': 'showContextMenu',
                'click': 'removeContextMenu'
            },

            render: function () {
                var el = this.template(_.extend({}, this.model.cssValues()));
                this.setElement($(el));
            },

            removeContextMenu: function () {
                this.$el.find('.menu').remove();
            },
            showContextMenu: function () {
                var _this = this;
                if (this.$el.find('.menu').length == 0) {
                    var menu = $(_.template(ContextMenuTemplate, {}));
                    menu.menu();
                    menu.find('[data-id=remove]').click(function () {
                        _this.remove();
                    });
                    this.$el.append(menu);
                }
                return false;
            },
            focus: function (model) {
                if (model !== this.model) {
                    this.removeContextMenu();
                }
            },
            remove: function () {
                this.grid.blocks.remove(this.model);
            }
        }),
        callbacks: {
            stateLoaded: function (grid) {

            },

            stateUnloaded: function (grid) {

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
                this.grid.blocks.add({x: this.model.get('x'), y: this.model.get('y'), width: 1, height: 1});
            }
        })
    };

});