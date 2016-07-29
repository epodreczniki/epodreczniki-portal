define(['jquery',
    'underscore',
    'backbone',
    'modules/ui_widget/AttributesDialog',
    '../../models/gallery/GalleryItem',
    'text!../../templates/WOMIItem.html',
    'text!../../templates/WOMISubitem.html',
    'text!../../templates/WOMISubitemRelated.html'
    ], function ($, _, Backbone, AttributesDialog, GalleryItem, WOMIItem, WOMISubitem, WOMISubitemRelated) {
    return Backbone.View.extend({
        template: _.template(WOMIItem),
        templateSubitem: _.template(WOMISubitem),
        templateSubitemRelated: _.template(WOMISubitemRelated),
        
        initialize: function (options) {
            var _this = this;
            this.womiSelectDialog = options.womiSelectDialog;
            this.galleryItemCollection = options.galleryItemCollection;
            var context = options.context;
            if (!this.model) {
				
                var model = new GalleryItem({
                    position: this.galleryItemCollection.size() + 1,
                    attrWomi: context.womi.id,
                    attrTitle: context.womi.title,
                    attrAuthor: context.womi.author,
                    attrMediaType: context.womi['media-type'],
                    attrImage: context.image,
                    attrRelatedWomi: null,
                    attrRelatedImage: null,
                    attrZoomable: false,
                    attrMagnifier: '',
                    attrContent: ''
                });
                this.galleryItemCollection.add(model);
                model.save();
                this.model = model;
            }
            context = {
                womi: {
                    id: this.model.get('attrWomi'),
                    title: this.model.get('attrTitle'),
                    author: this.model.get('attrAuthor'),
                    'media-type': this.model.get('attrMediaType'),
                    zoomable: this.model.get('attrZoomable'),
                	magnifier: this.model.get('attrMagnifier'),
                	content: this.model.get('attrContent')
                },
                image: this.model.get('attrImage'),
                womiRelated: ((this.model.get('attrRelatedWomi') != null) ? {
					id: this.model.get('attrRelatedWomi').id,
					title: this.model.get('attrRelatedWomi').title,
					author: this.model.get('attrRelatedWomi').author,
					'media-type': this.model.get('attrRelatedWomi')['media-type'],
					zoomable: this.model.get('attrZoomable'),
                	magnifier: this.model.get('attrMagnifier'),
                	content: this.model.get('attrContent')
				} : null),
                imageRelated: this.model.get('attrRelatedImage')
            };
            
            this.listenTo(this.galleryItemCollection, 'positionChanged', function(){
                _this.model.set('position', li.index());
                console.log(li.index());
                _this.model.save();
            });

            var womiItem = $(this.template(context));
            var womiItemTr = womiItem.find('tr').first();

            var li = $('<li>', {style: ''});
            //var delLink = $('<a>', {href: '', html: 'Usuń kontener'});
            var delLink = $('<a class="womi-item-delete-button">');
            delLink.button().click(function () {
                if (confirm('Czy na pewno chcesz usunąć kontener?')) {
					_this.galleryItemCollection.remove(_this.model);
                	li.remove();
                }
                
                return false;
            });
            
            var womiAttrs =  $('<a>', {href: '', html: 'Atrybuty'});
            womiAttrs.button().click(function () {
            	
            	var attrsDialog = new AttributesDialog({model: _this.model, grid: _this.grid, saveCallback: function (callbackmodel, pin) {
            		_this.model.set('attrZoomable', callbackmodel.get("attrZoomable"));
            		_this.model.set('attrMagnifier', callbackmodel.get("attrMagnifier"));
            		_this.model.set('attrContent', callbackmodel.get("attrContent"));
            		_this.model.save();
        			attrsDialog.close();
        		}});
                attrsDialog.open();
                
            	return false;
            });

            var addSound = $('<a>', {href: '', html: 'Dodaj dźwięk'});
            var delSound = $('<a>', {href: '', html: 'Usuń dźwięk'});
            addSound.button().click(function () {
            	_this.womiSelectDialog.saveCallback = function (id, contextRelated) {
                	var type = contextRelated.womi['media-type'];
                	if (type == 'AUDIO') {
                		context.womiRelated = {
                			id: contextRelated.womi.id,
                			title: contextRelated.womi.title,
							author: contextRelated.womi.author,
							'media-type': contextRelated.womi['media-type']
                		};
                		context.imageRelated = contextRelated.image;

                		var womiImage = _this.templateSubitem(context);
                		var womiSound = _this.templateSubitemRelated(context);
                		womiItemTr.html('');
                		womiItemTr.append(womiImage);
                		womiItemTr.append(womiSound);
                		delSound.button('enable');

                		_this.model.set('attrRelatedWomi', context.womiRelated);
                		_this.model.set('attrRelatedImage', context.imageRelated);
                		_this.model.save();

						_this.womiSelectDialog.close();
                	}
                	else {
                		alert('Wybrany WOMI nie jest typu "AUDIO"');
                	}
                };
                _this.womiSelectDialog.show();
            	
            	return false;
            });
            delSound.button().click(function () {
            	if (confirm('Czy na pewno chcesz usunąć dźwięk?')) {
					
					var womiImage = _this.templateSubitem(context);
					womiItemTr.html('');
                	womiItemTr.append(womiImage);
					
					_this.model.set('attrRelatedWomi', null);
					_this.model.set('attrRelatedImage', null);
					_this.model.save();
					
					delSound.button('disable');
                }
                return false;
            });
            if (context.womiRelated == null) {
            	delSound.button('disable');
            }
            else {
            	var womiSound = _this.templateSubitemRelated(context);
				womiItemTr.append(womiSound);
            }
            
            //li.append(delLink);
            li.append(womiAttrs);
            li.append(addSound);
            li.append(delSound);
            li.append(womiItem);
            this.setElement(li);
        }
    });
});
