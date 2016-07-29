define(['jquery',
    'underscore',
    'backbone',
    './GridEditToolbar',
    './ModuleEditToolbar',
    '../blocks/states/EditAttributes',
    './PreviewToolbar'
], function ($, _, Backbone, GridEditToolbar, ModuleEditToolbar, EditAttributes, PreviewToolbar) {
    return Backbone.View.extend({

        initialize: function (options) {
            var pvToolbar = new PreviewToolbar({el:this.el, model: this.model, grid: options.grid, cache: options.cache});
            var geToolbar = new GridEditToolbar({el: this.el, model: this.model, grid: options.grid, cache: options.cache});
            var meToolbar = new ModuleEditToolbar({el: this.el, model: this.model, grid: options.grid, cache: options.cache});
            
            pvToolbar.setState();
            pvToolbar.inputsEnabled(true);
            
            var tt = this.$el.find('[data-role="toolbar-tabs"]');
            tt.tabs();
            tt.removeClass('ui-widget ui-tabs-panel ui-widget-content');
            tt.find('[data-role^="toolbar-tab-"]').removeClass('ui-widget ui-tabs ui-tabs-panel ui-widget-content');
            var _this = this;

            tt.tabs({
                activate: function(event, ui){
                    if(ui.newPanel.data('role') == "toolbar-tab-module-edit"){
                        pvToolbar.inputsEnabled(false);
                        meToolbar.setState();
                    }
                    else if(ui.newPanel.data('role') == "toolbar-tab-preview"){
                        pvToolbar.inputsEnabled(true);
                        pvToolbar.setState();
                    }
                }
            });
            this.grid = options.grid;
			this.listenTo(this.grid, 'collisionDetected', this._collisionInfo);
			this.grid._checkCollision();
        },

        _collisionInfo: function(isCollided){
            var info = this.$el.find('[data-role="info-box"]').html('');
            if(isCollided){
                info.append($('<div>Wykryto kolizję</div>').addClass('ui-state-error'));
            }
        }
    });

});
