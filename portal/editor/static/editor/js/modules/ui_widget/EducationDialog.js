define(['jquery', 
        'underscore', 
        'backbone', 
        './Dialog',
        'text!../templates/EducationsDialog.html'
        ], function ($, _, Backbone, Dialog, EducationsDialog) {
	return Dialog.extend({

		attrs: [
		        {name: 'eduName', value: ''},
		        {name: 'descrition', value: ''},
		        ],
		
		        
		initialize: function (params) {
			this.template = EducationsDialog;
			this.buttonText = 'Zapisz';
			this.header = 'Dodaj edukację';
			this.saveCallback = params.saveCallback;
		},
		
		_afterCreate: function(){
		},

		_attributes: function () {
			return { attributes: this.attrs };
        },

        _click: function () {
        	var education = {};
        	this.dialog.find('[data-param]').each(function (index, element) {
        		var el = $(element);
        		if(el.data('param') == 'eduName'){
        			education.name = el.val();
        		}else{
        			education.description = el.val();
        		}
        	});
        	
        	var educObject = {};
        	educObject['core-curriculum-stage'] = $.makeArray({
        		'ep:key': 'E1',
        		'value': 'Etap 1' 
        	});
        	educObject['core-curriculum-school'] = $.makeArray({
    			'ep:key': 'POCZ',
    			'value': 'Szkoła podstawowa, kl.1-3'
    		});
        	if(education.name == 'przyrodnicza'){
        		educObject['authors-comment'] = $.makeArray(education.description),
        		educObject['core-curriculum-subject'] = $.makeArray({
            		'ep:key': 'EPRZYR',
            		'value': education.name 
            	})
        	}else if(education.name == 'polonistyczna'){
        		educObject['authors-comment'] = $.makeArray(education.description),
        		educObject['core-curriculum-subject'] = $.makeArray({
            		'ep:key': 'EPOL',
            		'value': education.name 
            	})
        	}else if(education.name == 'matematyczna'){
        		educObject['authors-comment'] = $.makeArray(education.description),
        		educObject['core-curriculum-subject'] = $.makeArray({
            		'ep:key': 'EMAT',
            		'value': education.name 
            	})
        	}else{
        		educObject['authors-comment'] = $.makeArray(education.description),
        		educObject['core-curriculum-subject'] = $.makeArray({
            		'ep:key': 'ESPOL',
            		'value': education.name 
            	})
        	}
        	
        	this.saveCallback(educObject);
		}
	});
});