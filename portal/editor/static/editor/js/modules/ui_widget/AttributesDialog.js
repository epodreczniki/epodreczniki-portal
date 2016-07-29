define(['jquery',
        'underscore', 
        'backbone', 
        './Dialog', 
        'text!../templates/AttributesDialog.html'], function ($, _, Backbone, Dialog, AttributesDialog) {
	return Dialog.extend({
		
		womiAttributes: [
		                  {name: 'width', value: '[0-100]'},
		                  {name: 'type', value: 'voiceover'},
		                  {name: 'context', value: 'bool'},
		                  {name: 'readingRoom', value: 'bool'},
		                  {name: 'hideCaption', value: 'none, all, title, true(=all), false(=none)'},
		                  {name: 'zoomable', value: 'bool'},
		                  {name: 'embedded', value: 'bool'},
		                  {name: 'autoplay', value: 'bool'},
		                  {name: 'transparent', value: 'bool'},
		                  {name: 'avatar', value: 'bool'},
		                  {name: 'content', value: ''},
		                  {name: 'contentFormat', value: ['classic']},
		                  //{name: 'contentFormat', value: ['classic', 'mobile', 'static', 'static-mono']}
		                  {name: 'transcript', value: ''}
		                  ],
		                  
		womiGalleryAttributes: [
		                        {name: 'Zoomable', value: 'bool'},
		                        {name: 'Magnifier', value: 'bool'},
		                        {name: 'Content', value: ''}
		                        ],
		                  
		initialize: function (params) {
			this.template = AttributesDialog;
			this.buttonText = 'Zapisz';
			this.header = 'Edycja atrybutów WOMI';
			this.saveCallback = params.saveCallback;
			this.model = params.model;
			this.grid = params.grid;
		},
		
        _afterCreate: function(){
        	var _this = this;
        	if(_this.model.get('attrType') == "WOMI" || _this.model.get('attrType') == "VIDEO"){
        		_.each(_this.womiAttributes, function(element){
        			var el = _this.dialog.find("[data-param='" + element.name + "']");
        			var womiAttrValue = _this.model.attributes["womi"+element.name];
        			if(typeof womiAttrValue !== "undefined"){
        				el.val(""+womiAttrValue);	
        			}
        		});
        	}else{
        		_.each(_this.womiGalleryAttributes, function(element){
        			var el = _this.dialog.find("[data-param='" + element.name + "']");
        			var womiAttrValue = _this.model.attributes["attr"+element.name];
            		if(typeof womiAttrValue !== "undefined"){
            			el.val(""+womiAttrValue);	
            		}
            	});
        	}
        },

        _afterOpen: function (){
            this.dialog.css('min-height', '320px');
        },
		
		_attributes: function () {
			var _this = this;
			if(_this.model.get('attrType') == "WOMI" || _this.model.get('attrType') == "VIDEO"){
				if(_this.model.get('attrType') == "WOMI"){
					var transcriptEl = $.grep(_this.womiAttributes, function(attr){ return attr.name == 'transcript'; });
                    if(transcriptEl.length > 0){
                        _this.womiAttributes.splice($.inArray(transcriptEl[0], _this.womiAttributes),1);
                    }
        		}else{
        			var transcriptAttr = {name: 'transcript', value: ''};
        			var transcriptEl = $.grep(_this.womiAttributes, function(attr){ return attr.name == 'transcript'; });
        			if(transcriptEl.length < 1){
        				_this.womiAttributes.push(transcriptAttr);
        			}
        		}
				return { attributes: _this.womiAttributes };
			}else{
				return { attributes: _this.womiGalleryAttributes };
			}
        },

        _click: function () {
        	var _this = this;
        	var validate = true;
        	var pin = false;
        	this.dialog.find('[data-param]').each(function (index, element) {
        		var el = $(element);
        		if(el.data('param') == 'width'){
        			var womiWidth = el.val();
        			if ((womiWidth <= 100) && (womiWidth >= 1)){
        				_this.model.attributes["womiwidth"] = womiWidth;	
        			}else{
        				alert("Atrybut WOMI-width powinien byc liczbą z przedziału 1-100.");
        				validate = false;
        			}
        		}else{
        			if(_this.model.get('attrType') == "WOMI" || _this.model.get('attrType') == "VIDEO"){
        				_this.model.attributes["womi"+el.data('param')] = el.val();
        			}else{
        				_this.model.attributes["attr"+el.data('param')] = el.val();
        			}
        		}
        		
        		if(el.data('param') == 'context'){
        			if(el.val() == 'true'){
        				if (confirm('Ustawienie parametru "context" na TRUE powoduje dodanie nowej przypinki z referencją do WOMI. Czy chcesz dodać przypinkę ?')) {
        					pin = true;
        					el.val('false');
        					_this.model.attributes["womi"+el.data('param')] = el.val();	
                        }else{
                        	validate = false;
                        }
        			}
        		}
        		
        	});
        	if(validate){
        		this.saveCallback(this.model, pin);
        	}
        }
    })
});