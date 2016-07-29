define([
    'jquery',
    'underscore',
    'backbone',
    'operandScheme',
    '../../helpers/names',
    '../../helpers/domTools',
    'text!../../templates/operand/base.html',
    './Value/textField',
    './Value/select',
    './Value/selectKzd',
    './Value/date'
], function(
    $,
    _,
    backbone,
    oScheme,
    names,
    domTools,
    baseTemplate,
    textFieldView,
    selectView,
    selectKzdView,
    dateView
) {

    return backbone.View.extend({

        tagName: 'li',

        className: 'filter-item',

        template: _.template(baseTemplate),

        initialize: function(params) {
            this.params = params;
            this.operand = params.operand;

            this.listenTo(this.operand, 'change', function(model) {
                this.render();
            });

            this.valueView;
        },

        events: {
            'change .field-select': 'changeFieldSelect',
            'click .remove': 'removeOperand'
        },

        render: function() {
            this.$el.html(this.template());

            this.$field = this.$('.field-select');
            this.$values = this.$('.values');

            if (!this.operand.get('static')) {
                oScheme.firstLevel.forEach(this.renderFieldOption, this);
            } else {
                // rethink this later
                this.$field.after($('<span>', {
                    class: 'field-select-static',
                    text: names.getFieldName(this.operand.get('field'))
                }));
                this.$field.remove();
            };

            var field = this.operand.get('field');

            this.$field.val(field);

            this.renderValue();

            this.renderRelatedValue(this.operand);

            return this;
        },

        renderFieldOption: function(option) {
            var element = $('<option>').text(names.getFieldName(option));
            element.attr('value', option);
            this.$field.append(element);
        },

        renderValue: function(operand) {
            var operand = operand || this.operand;
            var type = oScheme.types[operand.get('field')];

            var valueView;

            switch (type.format) {
                case 'textField':
                    valueView = new textFieldView({operand: operand});
                    break;
                case 'select':
                    valueView = new selectView({operand: operand});
                    break;
                case 'selectKzd':
                    valueView = new selectKzdView({operand: operand});
                    break;
                case 'datePicker':
                    valueView = new dateView({operand: operand});
                    break;
            }

            if (typeof valueView !== 'undefined') {
                this.$values.append(valueView.render().el);
            }
        },

        renderRelatedValue: function(model) {
            // TODO MAYBE REPLACE MODEL TO LOCAL MODEL RELATED.
            var related = model.get('related');
            if (related) {
                model.collection.where({'rid': related}).forEach(function(operand) {
                    this.renderValue(operand);
                }, this);
            }
        },

        changeFieldSelect: function(ev) {
            var fieldSelected = this.$field.val();
            this.operand.set('field', fieldSelected);
        },

        removeOperand: function(ev) {
            this.operand.destroy();
            this.remove();
            if (ev) ev.stopPropagation();
        }
    
    });

});
