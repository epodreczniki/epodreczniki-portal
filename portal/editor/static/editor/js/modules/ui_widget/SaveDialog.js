define(['jquery', 'underscore', 'backbone', './Dialog', 'text!../templates/SaveDialog.html'], function ($, _, Backbone, Dialog, SaveDialog) {
    return Dialog.extend({
        initialize: function (params) {
            this.fields = params.fields;
            this.saveCallback = params.saveCallback;
            this.template = SaveDialog;
            this.buttonText = 'OK';
            if(params.header){
                this.header = params.header;
            }
        },
        
        _click: function () {
            var attributes = {};
            this.dialog.find('[data-attr]').each(function (index, element) {
                var e = $(element);
                attributes[e.data('attr')] = e.val();

            });
            this.saveCallback(attributes);
        },

        _attributes: function () {
            return { attrs: this.fields};
        }
    })
});
