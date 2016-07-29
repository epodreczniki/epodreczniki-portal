define(['jquery',
    'underscore',
    'backbone',
    './Dialog',
    'womi_dialog',
    'base_lister',
    './GalleryWizardDialog',
    './SavedGalleryDialog',
    'text!../templates/WomiSearchDialog.html',
    'text!../templates/MediaSelectDialog.html',
    'text!../templates/MediaSelectItems.html'], function ($, _, Backbone, Dialog, WOMISelectDialog, BaseLister, GalleryWizardDialog, SavedGalleryDialog, WomiSearchDialog, MediaSelectDialog, MediaSelectItems) {

    var SearchDialog = Dialog.extend({
        dialogHeight: 350,
        initialize: function (options) {
            this.searchCallback = options.searchCallback;
            this.template = WomiSearchDialog;
            this.header = 'Wyszukiwanie WOMI';
        },

        _afterOpen: function (){
            var _this = this;
            var dialogUi = $(this.dialog).dialog();
            dialogUi.parent().height(this.dialogHeight);
            dialogUi.height(this.dialogHeight - 100);
            this.lister = new BaseLister({
                defaultFilter: {
                    field: 'category',
                    value: ['module']
                },
                selectedItemAction: function(selectedItem) {
                    dialogUi.find(".lister_choice").val(selectedItem.identifier);
                    _this.selectedWomi = selectedItem;
                    //_this.searchCallback(selectedItem.identifier, selectedItem);
                },
                killAfterSelect: false
            });
            _this.lister.render();
            dialogUi.find(".base_lister").append(_this.lister.$el);
        },

        hide: function () {
            this.dialog.dialog('widget').hide();
        },

        show: function () {
            this.open();
        },

        _click: function () {
            this.searchCallback(this.selectedWomi.identifier, this.selectedWomi);
            this.close();
        }
    });

    return Dialog.extend({

        categories: [
            {
                name: 'single-womi',
                label: 'WOMI',
                items: [
                    {
                        womiSelectDialog: this.womiSelectDialog,
                        name: 'womi',
                        label: 'WOMI',
                        description: 'Otwiera okno dodawania pojedynczego WOMI',
                        callback: function (block, grid, cache, dialog) {
                            var d = this.womiSelectDialog;
                            d.saveCallback = function (id, selectedWomi, treeData, selectedPath) {
                            	cache.setTreeData(treeData);
                            	cache.setSelectedTreeDataPath(selectedPath);
                                block.set('attrWomi', id);
                                if(selectedWomi.womi['media-type'] == 'VIDEO'){
                                	block.set('attrType', 'VIDEO');	
                                }else{
                                	block.set('attrType', 'WOMI');
                                }
                                grid.trigger('blockChanged', block);
                                grid.trigger('blockSelected', block);
                                d.close();
                                dialog.close();
                            };
                            d.show();
                        }
                    },
                    {
                        womiSearchDialog: this.womiSearchDialog,
                        name: 'womi',
                        label: 'Wyszukiwanie WOMI',
                        description: 'Wyszukiwanie pojedynczego WOMI',
                        callback: function (block, grid, cache, dialog) {
                            var s = this.womiSearchDialog;
                            s.searchCallback = function (id, selectedWomi) {
                                block.set('attrWomi', id);
//                                if(selectedWomi.womi['media-type'] == 'VIDEO'){
//                                	block.set('attrType', 'VIDEO');
//                                }else{
                                	block.set('attrType', 'WOMI');
//                                }
                                grid.trigger('blockChanged', block);
                                grid.trigger('blockSelected', block);
                                //s.hide();
                                dialog.close();
                            };
                            s.show();
                        }
                    }
                ]
            },
            {
                name: 'gallery',
                label: 'Galeria WOMI',
                items: [
                    {
                        name: 'gallery-a',
                        label: 'Galeria typu A',
                        description: 'Otwiera okno kreatora galerii typu A',
                        callback: function (block, grid, cache, dialog) {
                        	var d = new GalleryWizardDialog({block: block, grid: grid, cache: cache, type: "A"});
                            d.closeCallback = function() {
                        		dialog.close();
                        	};
                            d.open();
                        }
                    },
                    {
                        name: 'gallery-b',
                        label: 'Galeria typu B',
                        description: 'Otwiera okno kreatora galerii typu B (siatka miniatur)',
                        callback: function (block, grid, cache, dialog) {
                        	var d = new GalleryWizardDialog({block: block, grid: grid, cache: cache, type: "B"});
                            d.closeCallback = function() {
                        		dialog.close();
                        	};
                            d.open();
                        }
                    },
                    {
                        name: 'gallery-c',
                        label: 'Galeria typu C',
                        description: 'Otwiera okno kreatora galerii typu C (tylko miniatury)',
                        callback: function (block, grid, cache, dialog) {
                        	var d = new GalleryWizardDialog({block: block, grid: grid, cache: cache, type: "C"});
                            d.closeCallback = function() {
                        		dialog.close();
                        	};
                            d.open();
                        }
                    }
                ]
            },
            {
            	name: 'gallery-saved',
                label: 'Zapisane galerie',
                items: [
                    {
                        name: 'gallery-saved-b',
                        label: 'Zapisane galerie',
                        description: 'Otwiera okno zapisanych galerii',
                        callback: function (block, grid, cache, dialog) {
                        	var d = new SavedGalleryDialog({block: block, grid: grid, cache: cache});
                            d.closeCallback = function() {
                        		if (d.isGallerySelected) {
                        			dialog.close();
                        			var dGWD = new GalleryWizardDialog({block: block, grid: grid, cache: cache});
									dGWD.open();
                        		}
                        	};
                            d.open();
                        }
                    }
                ]
            }
        ],

        _attributes: function () {
            return { categories: this.categories };
        },
        
        _afterCreate: function () {
        	var categories = this.dialog.find('.dialog-menu-category');
            var cats = this.categories;
            var _this = this;
            var items = this.dialog.find('.dialog-menu-items');
            categories.each(function (index, element) {
                var el = $(element);
                el.click(function () {
                    items.html('');
                    categories.removeClass('dialog-menu-category-selected');
                    el.addClass('dialog-menu-category-selected');
                    var cat = _.where(cats, {name: el.data('role')});
                    _.each(cat[0].items, function (item) {
                    	var tmpl = _.template(MediaSelectItems, {attr: item});
                        var jq = $(tmpl);
                        jq.click(function () {
                            item.callback(_this.block, _this.grid, _this.cache, _this);
                        });
                        items.append(jq);
                    });

                });
            });
        },

        initialize: function (params) {
//            this.fields = params.fields;
//            this.saveCallback = params.saveCallback;
            this.template = MediaSelectDialog;
            this.buttonText = 'Zamknij';
            this.header = 'Wybierz element';
            this.block = params.block;
            this.grid = params.grid;
			this.cache = params.cache;
            this.womiSelectDialog = new WOMISelectDialog({treeData: this.cache.get('treeData'), selectedPath: this.cache.get('selectedTreeDataPath'), saveCallback: function (id, selectedWomi) {}});
            this.womiSearchDialog = new SearchDialog({searchCallback: function(id, womi){}});
            var _this = this;
            _.each(this.categories, function(category){
                if(category.name == 'single-womi'){
                    category.items[0].womiSelectDialog = _this.womiSelectDialog;
                    category.items[1].womiSearchDialog = _this.womiSearchDialog;
                }
            });
        },

        _click: function () {
            this.close();
        }
    })
});