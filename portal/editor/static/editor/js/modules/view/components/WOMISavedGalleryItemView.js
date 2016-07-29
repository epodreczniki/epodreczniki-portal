define(['jquery',
    'underscore',
    'backbone',
    '../../models/gallery/GalleryItem',
    'text!../../templates/WOMIItem.html',
    'text!../../templates/WOMISubitem.html',
    'text!../../templates/WOMISubitemRelated.html'
    ], function ($, _, Backbone, GalleryItem, WOMIItem, WOMISubitem, WOMISubitemRelated) {
    return Backbone.View.extend({
        template: _.template(WOMIItem),
        templateSubitem: _.template(WOMISubitem),
        templateSubitemRelated: _.template(WOMISubitemRelated),
        
        initialize: function (options) {
            var _this = this;
            this.galleryItem = options.galleryItem;
            
            var li = $('<li>', {style: ''});
            
            var womiItem = $(this.template(this.galleryItem));
            var womiItemTr = womiItem.find('tr').first();
            
            var womiSound = this.galleryItem.womiRelated;
            if (womiSound != null) {
            	var womiSound = _this.templateSubitemRelated(this.galleryItem);
            	womiItemTr.append(womiSound);
            }
            
            li.append(womiItem);
            this.setElement(li);
        }
    });
});
