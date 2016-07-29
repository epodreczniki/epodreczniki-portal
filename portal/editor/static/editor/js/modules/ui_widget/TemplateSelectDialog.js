define(['jquery',
    'underscore',
    'backbone',
    './Dialog',
    '../view/util/TemplateLoader',
    'text!../templates/TemplateSelectorTemplate.html'
], function ($, _, Backbone, Dialog, TemplateLoader, TemplateSelectorTemplate) {
    return Dialog.extend({
        initialize: function (params) {
            this.items = params.items;
            this.saveCallback = params.saveCallback;
            this.template = TemplateSelectorTemplate;
            this.buttonText = 'Wybierz';
            _.bindAll(this, 'getTemplateNameForIndex');
        },
        
        _afterOpen: function () {
        	this.dialog.dialog('option', 'resizable', false);
        },

        _afterCreate: function () {
            var selected = 0;
            var items = this.dialog.find('.image-placeholder');
            this.selectedItem = items[selected];
            this.updateHeader(this.getTemplateNameForIndex(selected));
            
            var _this = this;
            this.dialog.find('[data-role="carousel-back"]').click(function () {
            	$(items[selected]).addClass('hidden');
                if (selected - 1 < 0) {
                    selected = items.length - 1;
                } else {
                    selected--;
                }
                $(items[selected]).removeClass('hidden');
                _this.selectedItem = items[selected];
                _this.updateHeader(_this.getTemplateNameForIndex(selected));
            });
            this.dialog.find('[data-role="carousel-forward"]').click(function () {
                $(items[selected]).addClass('hidden');
                if (selected + 1 > items.length - 1) {
                    selected = 0
                } else {
                    selected++;
                }
                $(items[selected]).removeClass('hidden');
                _this.selectedItem = items[selected];
                _this.updateHeader(_this.getTemplateNameForIndex(selected));
            });
            $(this.selectedItem).removeClass('hidden');
        },

        _click: function () {
            this.saveCallback($(this.selectedItem).find('img').data('item'));
        },

        _attributes: function () {
            return { items: this.items };
        },

        getTemplateName: function(templateId) {
        	var result = TemplateLoader.getTemplateById(templateId);
        	var obj = JSON.parse(result);
        	return obj.name;
        },

        getTemplateNameForIndex: function(index) {
        	return this.getTemplateName(this.items[index].item)
        }
    })
});