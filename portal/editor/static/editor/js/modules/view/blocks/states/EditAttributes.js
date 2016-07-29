define(['jquery',
    'underscore',
    'backbone',
    '../BlockView',
    'modules/ui_widget/AttributesDialog',
    'modules/ui_widget/GalleryAttrsDialog',
    'modules/app/CacheManager',
    '../../../models/gallery/GalleryItemCollection',
    '../../../models/gallery/GalleryCollection',], function ($, _, Backbone, BlockView, AttributesDialog, GalleryAttrsDialog, CacheManager, GalleryItemCollection, GalleryCollection) {
    return {
        view: BlockView.extend({
            events: {
                'click': 'edit',
                'dblclick': 'doubleClick'
            },
            edit: function () {
                this.grid.trigger('blockSelected', this.model);
            },
            doubleClick: function () {
            	this.grid.trigger('openWomiWindow', this.model);
            },
            _deleteElement: function(){
            	var _this = this;
            	
            	var blockID = _this.model.get('id');
				_this.galleryItemCollection = new GalleryItemCollection([], {id: blockID});
				_this.galleryItemCollection.comparator = 'position';
				_this.galleryItemCollection.fetch();
				var models = _this.galleryItemCollection.toArray();
				_.each(models, function(model) {
					model.destroy();
				});
				_this.galleryItemCollection.invoke('save');

				_this.model.set('attrWomi', null);
				_this.model.set('attrType', null);
				_this.model.save();
				_this.grid.trigger('blockChanged', _this.model);
				_this.grid.trigger('blockSelected', _this.model);
            },
            afterInit: function (options) {
        		var _this = this;
            	var clearButton = this.$el.find('.clear-media-button').button();
            	clearButton.click(function () {
               		if (confirm('Czy na pewno chcesz usunąć media?')) {
               			_this._deleteElement();
					}
            	});
            	var editAttribtesButton = this.$el.find('.edit-attrs-button').button();
            	editAttribtesButton.click(function () {
            		if(_this.model.get('attrType') == 'WOMI' || _this.model.get('attrType') == 'VIDEO'){
            			var attrsDialog = new AttributesDialog({model: _this.model, grid: _this.grid, saveCallback: function (model, pin) {
                			_this.model = model;
                			if(pin){
                				var cache = CacheManager.getProperties();
                				cache.putPin(model.attributes.attrWomi);
                                cache.trigger('change:pin', _this.cache);
                			}
                			attrsDialog.close();
                		}});
                        attrsDialog.open();
            		}else{
            			
            			var selectedBlockID = _this.model.get('id');
            			_this.galleryCollection = new GalleryCollection([], {id: selectedBlockID});
            			_this.galleryCollection.comparator = 'position';
						_this.galleryCollection.fetch();
						var models = _this.galleryCollection.models;
						_.each(models, function(model) {
							var galleryModel = model;
							if(selectedBlockID == model.get('blockId')){
								var galleryAttrsDialog = new GalleryAttrsDialog({model: galleryModel, grid: _this.grid, type: galleryModel.get('type'), saveCallback: function (model) {
									galleryModel = model;
		                			galleryAttrsDialog.close();
		                			galleryModel.save();
		                		}});
		            			galleryAttrsDialog.open();
							}
						});
						_this.galleryCollection.invoke('save');
            		}
            		_this.model.save();
					_this.grid.trigger('blockChanged', _this.model);
					_this.grid.trigger('blockSelected', _this.model);
            	});
            	
            	var addButton = this.$el.find('.add-media-button').button();
            	addButton.click(function(){
            		_this.grid.trigger('openWomiWindow', _this.model);	
            	});
            	var editButton = this.$el.find('.edit-media-button').button();
            	editButton.click(function(){
            		_this.grid.trigger('openWomiWindow', _this.model);
            	});
            	
            	var type = this.model.get('attrType');
            	if (type == null) {
            		clearButton.css('display', 'none');
            		editAttribtesButton.css('display', 'none');
            		addButton.css('display', 'block');
            		editButton.css('display', 'none');
            	}else {
            		clearButton.css('display', 'block');
            		editAttribtesButton.css('display', 'block');
            		addButton.css('display', 'none');
            		editButton.css('display', 'block');
            	}
            }
        }),
        callbacks: {
            stateLoaded: function (grid) {
                grid.on('blockChanged', function(block){
                   grid.render();
                });
            },

            stateUnloaded: function (grid) {
                grid.off('blockChanged');
            }
        }
    };

});
