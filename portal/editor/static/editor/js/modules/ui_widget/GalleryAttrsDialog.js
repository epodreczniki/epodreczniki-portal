define(['jquery',
        'underscore', 
        'backbone', 
        './Dialog', 
        'text!../templates/GalleryAttrsDialog.html'], function ($, _, Backbone, Dialog, GalleryAttrsDialog) {
	return Dialog.extend({
		
//		galleryAttributes: [
//		                  {name: 'StartOn', value: '0'},
//		                  {name: 'Thumbnails', value: 'all'},
//		                  {name: 'Titles', value: 'all'},
//		                  {name: 'FormatContents', value: 'all'},
//		                  {name: 'Width', value: '0'},
//		                  {name: 'Height', value: '0'}
//		                  ],
		                  
		initialize: function (params) {
			this.template = GalleryAttrsDialog;
			this.buttonText = 'Zapisz';
			this.header = 'Edycja atrybutów galerii';
			this.saveCallback = params.saveCallback;
			this.galleryModel = params.model;
			this.grid = params.grid;
			this.type = params.type;
		},
		
        _afterCreate: function(){
        	var _this = this;
        	//_.each(_this.galleryAttributes, function(element){
        	_.each(_this._attributes(), function(element){        		
        		var el = _this.dialog.find("[data-param='" + element.name + "']");
        		var galleryAttrValue = _this.galleryModel.attributes[element.name];
        		if(typeof galleryAttrValue !== "undefined"){
        			el.val(""+galleryAttrValue);
        		}
        	});
        },

        _afterOpen: function (){
            this.dialog.css('min-height', '300px');
        },
		
		_attributes: function () {
			var params = [];
        	if(this.type == "A"){
        		params = this.galleryModel.getParamsA();
        	}else if(this.type == "B"){
        		params = this.galleryModel.getParamsB();
        	}else if(this.type == "C"){
        		params = this.galleryModel.getParamsC();
        	}else{
        	}
        	return { attributes: params};
            //return { attributes: this.galleryAttributes };
        },

        _isNumber: function (str){
        	var regex  = /^\s*\d+\s*$/;
        	return String(str).search (regex) != -1
        },

        _click: function () {
        	var _this = this;
        	var validate = true;
        	this.dialog.find('[data-param]').each(function (index, element) {
        		var el = $(element);
        		if((el.data('param') == 'paramStartOn') || (el.data('param') == 'viewWidth') || (el.data('param') == 'viewHeight')){
        			var elemValue = el.val();
        			if (_this._isNumber(elemValue)){
        				_this.galleryModel.attributes[el.data('param')] = elemValue;
         			}else{
        				alert("Niepoprawna wartość parametru "+ el.data('param'));
        				validate = false;
        			}
        		}else{
        			_this.galleryModel.attributes[el.data('param')] = el.val();	
        		}
        	});
        	if(validate){
        		this.saveCallback(this.galleryModel);
        	}
        }
    })
});