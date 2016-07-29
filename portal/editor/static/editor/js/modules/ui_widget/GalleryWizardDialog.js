define(['jquery',
    'underscore',
    'backbone',
    './Dialog',
    //'./WOMISelectDialog',
    'womi_dialog',
    'modules/models/gallery/GalleryItemCollection',
    'modules/models/gallery/GalleryCollection',
    'modules/models/gallery/GalleryItem',
    'modules/models/gallery/Gallery',
    'modules/view/components/WOMIItemView',
    'text!../templates/GalleryDialog.html',
    'text!../templates/MediaSelectItems.html',
    'text!../templates/WOMIItem.html'], function ($, _, Backbone, Dialog, WOMISelectDialog, GalleryItemCollection, GalleryCollection, GalleryItem, Gallery, WOMIItemView, MediaSelectDialog, MediaSelectItems, WOMIItem) {
    return Dialog.extend({
    	
        //womiSelectDialog: new WOMISelectDialog({saveCallback: function (id) {
        //}}),

        _attributes: function () {
        	var params = [];
        	if(this.type == "A"){
        		params = this.gallery.getParamsA();
        	}else if(this.type == "B"){
        		params = this.gallery.getParamsB();
        	}else if(this.type == "C"){
        		params = this.gallery.getParamsC();
        	}else{
        	}
            //return { attributes: this.gallery.getParams()  };
        	return { attributes: params};
        },

        _afterCreate: function () {
            var categories = this.dialog.find('.dialog-menu-category');
            var addBtn = this.dialog.find('[data-role="button-add-womi"]');
            var items = this.dialog.find('.dialog-menu-items');
            this.sortable = items.find('ol');
            var _this = this;
            this.galleryItemCollection.each(function (item) {
                _this._putWomi(item.attrWomi, item, false);
            });

            addBtn.button();
            addBtn.click(function () {
                _this.womiSelectDialog.saveCallback = function (id, context, treeData, selectedPath) {
                	_this.cache.setTreeData(treeData);
                	_this.cache.setSelectedTreeDataPath(selectedPath);
                	var type = context.womi['media-type'];
                	if (type == 'IMAGE') {
                		_this._putWomi(id, context, true);
						_this.womiSelectDialog.close();
                	}
                	else {
                		alert('Wybrany WOMI nie jest typu "IMAGE"');
                	}
                };
                _this.womiSelectDialog.show();
            });

            this.sortable.sortable({
                //revert: true
                containment: this.sortable,
                placeholder: "ui-state-highlight",
                update: function (event, ui) {
                    _this.galleryItemCollection.trigger('positionChanged');
                    console.log('upd');
                }
            });
            this.sortable.sortable("refreshPositions");
            /*.draggable({
             connectToSortable: this.sortable,
             helper: "clone",
             revert: "invalid"
             });*/
        },

        _putWomi: function (id, context, newItem) {
            var _this = this;

            var view = null;
            if (newItem) {
                view = new WOMIItemView({context: context, galleryItemCollection: this.galleryItemCollection, womiSelectDialog: this.womiSelectDialog});
            } else {
                view = new WOMIItemView({model: context, galleryItemCollection: this.galleryItemCollection, womiSelectDialog: this.womiSelectDialog});
            }
            this.sortable.append(view.el);
        },

        initialize: function (params) {
//            this.fields = params.fields;
//            this.saveCallback = params.saveCallback;
            this.template = MediaSelectDialog;
            this.buttonText = 'Zapisz';
            this.header = 'Kreator galerii';
            this.block = params.block;
            this.grid = params.grid;
            this.cache = params.cache;
            this.womiSelectDialog = new WOMISelectDialog({treeData: this.cache.get('treeData'), selectedPath: this.cache.get('selectedTreeDataPath'), saveCallback: function (id, selectedWomi) {}});
            this.galleryCollection = new GalleryCollection();
            this.galleryCollection.fetch();
            this.gallery = this.galleryCollection.where({blockId: this.block.id});
            if (!this.gallery || this.gallery.length == 0) {
                this.gallery = new Gallery({blockId: this.block.id});
                this.galleryCollection.add(this.gallery);
            } else {
                this.gallery = this.gallery[0];
            }
            if(params.type !== undefined){
            	this.type = params.type;
            }else{
            	this.type = this.gallery.get('type');
            }
            this.galleryItemCollection = new GalleryItemCollection([], {id: this.block.id});
            this.galleryItemCollection.comparator = 'position';
            this.galleryItemCollection.fetch();
            var _this = this;
            this.listenTo(this.galleryItemCollection, 'remove', function (model) {
                model.destroy();
            });
            
        },

        _click: function () {
            var _this = this;
            if(_this.type == "A"){
        		_this.gallery.set("type", "A");
        	}else if(_this.type == "B"){
        		_this.gallery.set("type", "B");
        	}else if(_this.type == "C"){
        		_this.gallery.set("type", "C");
        	}else{
        	}
            this.dialog.find('[data-param]').each(function (index, element) {
                var el = $(element);
                _this.gallery.set(el.data('param'), el.val());
                _this.gallery.save();
                _this.block.set('attrWomi', null);
                _this.block.set('attrType', 'gallery');
                _this.block.save();
                _this.grid.trigger('blockChanged', _this.block);
                _this.grid.trigger('blockSelected', _this.block);
            });
            
            // iterate gallery items
            var womiArray = new Array();
            this.galleryItemCollection.each(function (model, index) {
            	
            	var item = {
            		womi: {
            			id: model.get('attrWomi'),
                    	title: model.get('attrTitle'),
                    	author: model.get('attrAuthor'),
                    	'media-type': model.get('attrMediaType'),
                    	zoomable: model.get('attrZoomable'),
                    	magnifier: model.get('attrMagnifier'),
                    	content: model.get('attrContent')
                    },
                    image: model.get('attrImage'),
                    womiRelated: model.get('attrRelatedWomi'),
                    imageRelated: model.get('attrRelatedImage'),
                    position: model.get('position'),
                    key: null
            	};
            	
            	womiArray.push(item);
            });
            
            var gallery = {};
            if(_this.type == "B"){
            	gallery = {
                    	name: null,
                    	type: "B",
                    	viewWidth: _this.gallery.get("viewWidth"),
                    	viewHeight: _this.gallery.get("viewHeight"),
                    	items: womiArray
                    };
        	}else {
        		gallery = {
                    	name: null,
                    	type: _this.gallery.get("type"),
                    	items: womiArray
                    };
        	}
            // save gallery
            this.cache.putGallery(gallery);
            
            this.close();
        }
    })
});