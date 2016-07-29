define(['jquery', 'underscore', 'backbone', './Dialog', 'text!../templates/FormEditDialog.html', 'text!../templates/FormEditCCommandsDialog.html'], function ($, _, Backbone, Dialog, FormEditDialog, FormEditCCommandsDialog) {
    return Dialog.extend({
        initialize: function (params) {
            this.fields = params.fields;
            this.saveCallback = params.saveCallback;
            if(params.isCCommandsForm){
            	this.template = FormEditCCommandsDialog;
            }else{
            	this.template = FormEditDialog;	
            }
            this.buttonText = 'Zapisz';
            if(params.header){
                this.header = params.header;
            }
        },
        
        _click: function () {
        	if(this.template == FormEditCCommandsDialog){
        		var attribute = this.dialog.find('.full-input').val();
        		this.saveCallback(attribute);
        	}else{
        		 var attributes = {};
                 this.dialog.find('[data-attr]').each(function (index, element) {
                     var e = $(element);
                     attributes[e.data('attr')] = e.val();
                 });
                 this.saveCallback(attributes);
        	}
        },

        _attributes: function () {
            return { attrs: this.fields};
        }
    })
});
