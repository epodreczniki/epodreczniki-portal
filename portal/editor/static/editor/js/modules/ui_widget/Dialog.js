define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    return Backbone.View.extend({

        buttonText: 'Zapisz',

        initialize: function (params) {
            this.template = '<div></div>';
            this.header =  '';
            this.closeCallback =  null;
        },

        _click: function () {
        },

        _attributes: function () {
            return { };
        },

        _afterOpen: function () {
        },

        _afterCreate: function(){
        },

        open: function () {
            var _this = this;
            this.dialog = $(_.template(this.template, this._attributes()));
            this._afterCreate();
            this.dialog.dialog({
                width:'auto',
                dialogClass: "no-close",
                buttons: [
                    {
                        text: _this.buttonText,
                        click: function () {
                            return _this._click();
                        }
                    }
                ],
                title: this.header
            });
            this._afterOpen();
        },

        close: function () {
            this.dialog.dialog('close');
            if (this.closeCallback != null && this.closeCallback != undefined) {
            	this.closeCallback();
            }
        },

		updateHeader: function(header) {
			this.header = header;
			this.dialog.dialog({ title: header });
		}
    })
});
