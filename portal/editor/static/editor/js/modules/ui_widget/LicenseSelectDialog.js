define(['jquery', 'underscore', 'backbone', './Dialog'], function ($, _, Backbone, Dialog) {
    return Dialog.extend({
    	
        LICENSES: [
            { name: 'CC BY 1.0', url: 'http://creativecommons.org/licenses/by/1.0/pl/legalcode' },
            { name: 'CC BY 2.0', url: 'http://creativecommons.org/licenses/by/2.0/pl/legalcode' },
            { name: 'CC BY 2.5', url: 'http://creativecommons.org/licenses/by/2.5/pl/legalcode' },
            { name: 'CC BY 3.0', url: 'http://creativecommons.org/licenses/by/3.0/pl/legalcode' },
            { name: 'CC BY 4.0', url: 'http://creativecommons.org/licenses/by/4.0/pl/legalcode' },
            { name: 'CC BY SA 1.0', url: 'http://creativecommons.org/licenses/by-sa/1.0/legalcode' },
            { name: 'CC BY SA 2.0', url: 'http://creativecommons.org/licenses/by-sa/2.0/legalcode' },
            { name: 'CC BY SA 2.5', url: 'http://creativecommons.org/licenses/by-sa/2.5/legalcode' },
            { name: 'CC BY SA 3.0', url: 'http://creativecommons.org/licenses/by-sa/3.0/legalcode' },
            { name: 'CC BY SA 4.0', url: 'http://creativecommons.org/licenses/by-sa/4.0/legalcode' },
            { name: 'Free for Commercial Use', url: '' },
            { name: 'GE S.A.', url: '' },
            { name: 'GNU FDL', url: '' },
            { name: 'GNU FDL 1.1', url: '' },
            { name: 'GNU FDL 1.2', url: '' },
            { name: 'GNU FDL 1.3', url: '' },
            { name: 'nieznana', url: '' },
            { name: 'ORE', url: '' },
            { name: 'PCSS', url: '' },
            { name: 'PŁ', url: '' },
            { name: 'pubic domail', url: '' },
            { name: 'slultterstock', url: '' },
            { name: 'Studio nagrań', url: '' },
            { name: 'wlasność prywatna', url: '' }
        ],
        
        defaultValue: 'http://creativecommons.org/licenses/by/1.0/pl/legalcode',
        
        initialize: function (params) {
            this.saveCallback = params.saveCallback;
            this.header = 'Wybór licencji';
            this.template = '<div style="z-index: 100000000;"></div>';
            this.buttonText = 'Zapisz';
            if (params.header) {
                this.header = params.header;
            }
        },

        _afterCreate: function () {
            var select = $('<select>');

            _.each(this.LICENSES, function (license) {
                select.append($('<option>', {
                    value: license.url,
                    html: license.name
                }));
            });

            this.dialog.append(select);
         //console.log(this.dialog.find('select'));      
          this._setSelectValue(this.defaultValue);
        },
        
        _setSelectValue: function (val){
        	var _this = this;
        	_this.dialog.find('select option').each(function(){
        		if($(this).text() == val){
        			$(this).prop('selected', true);
        		}
        	});
        },

        _afterOpen: function () {
            this.dialog.parent().css('z-index', 100000000);
        },

        _click: function () {
            //this.saveCallback(this.dialog.find('select').val());
            this.saveCallback(this.dialog.find('select').val(), this.dialog.find('select :selected').text());
        }
    })
});
