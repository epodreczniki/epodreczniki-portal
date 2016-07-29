define(['jquery',
    'underscore',
    'backbone',
    '../util/FileManipulation',
    '../blocks/states/NoOp',
    '../blocks/states/DragAndResize',
    '../blocks/states/AddBlock',
    '../blocks/states/EditAttributes',
    '../blocks/states/FullEditState',
    '../util/ModelAttributesMaker',
    '../util/TemplateLoader',
    '../../ui_widget/FileBrowser',
    'modules/ui_widget/FormDialog',
    'modules/ui_widget/TemplateSelectDialog',
    'modules/app/util/IdGenerator',
    'text!modules/templates/XMLTemplateExportTemplate.html'], function ($, _, Backbone, FileManipulation, NoOp, DragAndResize, AddBlock, EditAttributes, FullEditState, ModelAttributesMaker, TemplateLoader, FileBrowser, FormDialog, TemplateSelectDialog, IdGenerator, XMLTemplateExportTemplate) {
    return Backbone.View.extend({
        initialize: function (opts) {
            this.grid = opts.grid;
            this.cache = opts.cache;
            var _this = this;

            this.listenTo(this.grid, 'blockSelected', this.blockSelected);
            this.listenTo(this.grid, 'blockDrop', this._hideModuleNameDiv);
            this.listenTo(this.grid, 'blockResize', this._hideModuleNameDiv);
            this.listenTo(this.model, 'sizeChanged', this.sizeChanged);
            this.listenTo(this.grid.blocks, 'add', this._hideModuleNameDiv);
            this.listenTo(this.grid.blocks, 'remove', this._hideModuleNameDiv);
            var options = [
                //{state: NoOp, label: "Preview"},
                //{state: DragAndResize, label: "Move/Resize"},
                //{state: AddBlock, label: "Add/Remove"}
                {state: FullEditState, label: "FullEdit"}
                //{state: EditAttributes, label: "Edit"}
            ];
            this.state = options[0].label;

            this._initGridEdit();
            this._initPresetButtons();
            this._initPreview();
            this._initTemplateLoad();
            this._hideModuleNameDiv();
        },

        setState: function () {
            this.model.set('currentState', FullEditState);
        },

        _loadFromJSON: function (result) {
            var obj = JSON.parse(result);
            this.model.save(obj.properties);
            this.grid.blocks.each(function (m) {
                m.destroy();
            });
            this.grid.blocks.fetch();
            this.grid.blocks.set(obj.blocks);
            this.model.trigger('sizeChanged');

			if (obj.name != undefined) {
            	var moduleDiv = this.$el.find('[data-role="module-name"]');
            	moduleDiv.html(obj.name);
            	this._showModuleNameDiv();
            }
        },

        _initPresetButtons: function () {
            var importExport = this.$el.find('[data-role="import-export"]');
            var _this = this;
            importExport.find('[data-role="save"]').button().click(function () {
            	if (_this.grid.collision) {
            		alert('Wykryto kolizję. Usuń ją w celu zapisania presetu.');
            		return;
            	}

                var output = {
                    properties: _this.model.toExportedJSON(),
                    blocks: _this.grid.blocks.toExportedJSON()
                };
                FileManipulation.download($('body'), 'layout.json', JSON.stringify(output));
            });
            var loadHandler = importExport.find('[data-role="load"]').button();
            new FileBrowser({el: loadHandler,
                onChange: function (result) {
                    _this._loadFromJSON(result);
                }
            });
        },

        _initPreview: function () {
            this.$el.find('[data-role="preview"]').find('button').button().click(function () {
                window.open($(this).data('url'));
            });

        },

        _initGridEdit: function () {
            var _this = this;
            var gridProps = this.$el.find('[data-role="grid-properties"]');
            var clearBtn = gridProps.find('[data-role="clear-grid"]').button();
            clearBtn.click(function () {
            	
            	if (confirm('Czy na pewno chcesz wyczyścić siatkę?')) {
					_this.grid.blocks.each(function (m) {
						m.destroy();
					});
					_this.grid.blocks.fetch();
					_this.grid.blocks.set([]);
					_this.model.trigger('sizeChanged');
                }
                return false;
            });

            var inpWidth = this.$el.find('[data-role="dimension-width"]');
            var inpHeight = this.$el.find('[data-role="dimension-height"]');
            inpHeight.val(this.model.get('height'));
            inpWidth.val(this.model.get('width'));
            var inputChange = function () {
            	function isInt(value) {
					return !isNaN(value) && parseInt(value) == value;
				}
				
				var gridWidth = _this.model.get('width');
            	var gridHeight = _this.model.get('height');
            	
				var tmp = inpWidth.val().trim();
				if (isInt(tmp)) {
					gridWidth = tmp;
				}
				tmp = inpHeight.val().trim();
				if (isInt(tmp)) {
					gridHeight = tmp;
				}
				gridWidth = _.max([_.min([gridWidth, 1000]), 1]);
				gridHeight = _.max([_.min([gridHeight, 1000]), 1]);
				
                inpWidth.val(gridWidth);
            	inpHeight.val(gridHeight);
            	
                return false;
            };
            inpWidth.change(inputChange);
            inpHeight.change(inputChange);
            gridProps.find('[data-role="save-grid"]').button().click(function () {
            	
            	if (confirm('Czy chcesz zmienić rozmiar siatki? Może to spowodować, że niektóre elementy zostaną usunięte.')) {
					
					var gridWidth = inpWidth.val();
            		var gridHeight = inpHeight.val();
					
					_this.model.save({
						width: gridWidth,
						height: gridHeight
					});
					_this.model.trigger('sizeChanged');
                    addLeaveWarning();
				}
            	else {
            		var gridWidth = _this.model.get('width');
					var gridHeight = _this.model.get('height');            		
            		inpWidth.val(gridWidth);
					inpHeight.val(gridHeight);
            	}
            	
            	return false;
            });

            var advancedOptions = this.$el.find('[data-role="advanced-options"]');
            var showAdvancedOptions = advancedOptions.find('[data-role="show-advanced-options"]');
            showAdvancedOptions.change(function() {
            	_this._advancedVisible($(this).is(":checked"));
            });
        },

        _initTemplateLoad: function () {
            var MAIN_IMG = '{{ STATIC_URL }}editor/img/szablony/';

            var items = [];
            _.each(_.keys(TemplateLoader.TEMPLATE_MAPPINGS), function (key) {
                items.push({
                    url: MAIN_IMG + TemplateLoader.TEMPLATE_MAPPINGS[key] + '.png',
                    item: key
                });
            });
            var _this = this;

            $('button[data-role="load-template"]').button().click(function () {

                var dialog = new TemplateSelectDialog({items: items, saveCallback: function (item) {
                    if (confirm('Czy na pewno chcesz wczytać nowy moduł?')) {
                    	_this._loadFromJSON(TemplateLoader.getTemplateById(item));
                    	dialog.close();
                    }
                }});

                dialog.open();
            });
        },

        _advancedVisible: function(visible) {
        	var advancedOptions = this.$el.find('[data-role="advanced-options"]');
            var showAdvancedOptions = advancedOptions.find('[data-role="show-advanced-options"]');
            if (visible) {
        		advancedOptions.find('[data-role="import-export"]').show();
				advancedOptions.find('[data-role="import-xml"]').show();
        	}
        	else {
        		advancedOptions.find('[data-role="import-export"]').hide();
				advancedOptions.find('[data-role="import-xml"]').hide();
        	}
        },

        _hideModuleNameDiv: function() {
        	this.$el.find('[data-role="module-name-div"]').hide();
        },

        _showModuleNameDiv: function() {
        	this.$el.find('[data-role="module-name-div"]').show();
        },

        sizeChanged: function() {
        	var inpWidth = this.$el.find('[data-role="dimension-width"]');
            var inpHeight = this.$el.find('[data-role="dimension-height"]');
            inpWidth.val(this.model.get('width'));
            inpHeight.val(this.model.get('height'));
            this._hideModuleNameDiv();
        }
    });
});
