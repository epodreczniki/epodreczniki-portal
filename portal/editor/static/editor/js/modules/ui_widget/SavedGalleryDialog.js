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
    'modules/view/components/WOMISavedGalleryItemView',
    'text!../templates/SavedGalleryDialog.html',
    'text!../templates/SavedGalleryButtons.html'], function ($, _, Backbone, Dialog, WOMISelectDialog, GalleryItemCollection, GalleryCollection, GalleryItem, Gallery, WOMISavedGalleryItemView, SavedGalleryDialog, SavedGalleryButtons) {
    return Dialog.extend({

		isGallerySelected: false,

        womiSelectDialog: new WOMISelectDialog({saveCallback: function (id) {
        }}),

        _afterCreate: function () {
			this.reloadGalleries();
        },

        reloadGalleries: function () {
        	var galleryMenu = this.dialog.find('.dialog-menu-categories');
        	var galleryItems = this.dialog.find('.dialog-menu-items');
        	galleryMenu.html('');
        	galleryItems.html('');
        	var _this = this;
        	var galleriesArray = this.cache.getGalleries();
        	_.each(galleriesArray, function (gallery) {
        		var htmlGalleryItem = $('<p>', {
        			class: 'dialog-menu-gallery-name'
        		}).append(
        			$('<a>', {
        				href: '#',
        				'data-value': gallery.key,
        				text: gallery.name
        			})
        		).appendTo(
        			galleryMenu
        		).click(function () {
        			var galleryKey = $(this).find('a').attr('data-value');
        			_this.loadGalleryView(galleryKey);
            		return false;
        		});
        	});
        	
        	if (galleriesArray.length == 0) {
				$('<p>', {
					class: 'dialog-menu-no-galleries',
					text: 'Brak zapisanych galerii'
				}).appendTo(galleryItems);
			}
			else {
				$('<p>', {
					class: 'dialog-intro-label',
					text: 'Wybierz galerie z menu po lewej'
				}).appendTo(galleryItems);
			}
        },

        loadGalleryView: function (galleryKey) {
        	var galleryMenu = this.dialog.find('.dialog-menu-categories');
        	var galleryItems = this.dialog.find('.dialog-menu-items');
        	var _this = this;
        	var gallery = this.cache.get('galleries')[galleryKey];
        	galleryItems.html('');
			galleryItems.append(
				$('<p>', {
					class: 'dialog-menu-gallery-name',
					text: gallery.name
				})
			);
			var header = galleryItems.append(_.template(SavedGalleryButtons));
			header.find('[data-role="saved-gallery-change-name"]').button().click(function () {
				var newName = prompt(gallery.name).trim();
				if (newName.length > 0) {
					_this.cache.changeGalleryName(galleryKey, newName);
					_this.reloadGalleries();
					_this.loadGalleryView(galleryKey);
				}
			});
			header.find('[data-role="saved-gallery-remove"]').button().click(function () {
				if (confirm('Czy na pewno chcesz usunąć tę galerię?')) {
					_this.cache.removeGallery(galleryKey);
					_this.reloadGalleries();
				}
			});
			header.find('[data-role="saved-gallery-select"]').button().click(function () {
				
				_this.galleryCollection = new GalleryCollection();
				_this.galleryCollection.fetch();
				_this.gallery = _this.galleryCollection.where({blockId: _this.block.id});
				if (!_this.gallery || _this.gallery.length == 0) {
					_this.gallery = new Gallery({blockId: _this.block.id});
					_this.galleryCollection.add(_this.gallery);
				} else {
					_this.gallery = _this.gallery[0];
				}
				
				if(gallery.type == "A"){
					_this.gallery.set('paramTitle', gallery.name);
					_this.gallery.set('paramStartOn', '1');
					_this.gallery.set('paramThumbnails', 'all');
					_this.gallery.set('paramTitles', 'all');
					_this.gallery.set('paramFormatContents', 'all');
					_this.gallery.set('miniaturesOnly', false);
					_this.gallery.set('type', 'A');
				}else if(gallery.type == "B"){
					_this.gallery.set('paramTitle', gallery.name);
					_this.gallery.set('viewWidth', gallery.viewWidth);
					_this.gallery.set('viewHeight', gallery.viewHeight);
					_this.gallery.set('miniaturesOnly', true);
					_this.gallery.set('type', 'B');
				}else if(gallery.type == "C"){
					_this.gallery.set('paramTitle', gallery.name);
					_this.gallery.set('miniaturesOnly', true);
					_this.gallery.set('type', 'C');
				}
				_this.gallery.save();
				
				_this.galleryItemCollection = new GalleryItemCollection([], {id: _this.block.id});
				_this.galleryItemCollection.comparator = 'position';
				_this.galleryItemCollection.fetch();
				var models = _this.galleryItemCollection.toArray();
				_.each(models, function(model) {
					model.destroy();
				});
				_this.galleryItemCollection.invoke('save');
				_.each(gallery.items, function (item, index) {
					var model = new GalleryItem({
						position: index + 1,
						attrWomi: item.womi.id,
						attrTitle: item.womi.title,
						attrAuthor: item.womi.author,
						attrMediaType: item.womi['media-type'],
						attrImage: item.image,
						attrRelatedWomi: item.womiRelated,
						attrRelatedImage: item.imageRelated,
						attrZoomable: item.womi.zoomable,
                    	attrMagnifier: item.womi.magnifier,
                    	attrContent: item.womi.content
					});
					_this.galleryItemCollection.add(model);
					model.save();
				});
				_this.galleryItemCollection.invoke('save');
				
				_this.block.set('attrWomi', null);
				_this.block.set('attrType', 'gallery');
				_this.block.save();
				_this.grid.trigger('blockChanged', _this.block);
				_this.grid.trigger('blockSelected', _this.block);
				
				_this.isGallerySelected = true;
				_this.close();
			});
			var galleryItemsOl = $('<ol>');
			galleryItemsOl.appendTo(galleryItems);
			_.each(gallery.items, function (item, index) {
				var view = new WOMISavedGalleryItemView({galleryItem: item});
				galleryItemsOl.append(view.el);
			});
        },

        initialize: function (params) {
            this.template = SavedGalleryDialog;
            this.buttonText = 'Zamknij';
            this.header = 'Zapisane galerie';
            this.block = params.block;
            this.grid = params.grid;
            this.cache = params.cache;
        },

        _click: function () {
            this.close();
        }
    })
});