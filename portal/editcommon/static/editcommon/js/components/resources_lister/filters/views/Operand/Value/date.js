define([
    'jquery',
    'underscore',
    'backbone',
    './Value',
    'picker',
    'pickadate'
], function(
    $,
    _,
    backbone,
    ValueView,
    picker
) {

    return ValueView.extend({

        className: 'value',

        postInitialize: function(params) {
        },

        events: {
            'change .picker-date': 'setValue'
        },

        format: 'yyyy-mm-dd',

        render: function() {
            var $inputFrom = $('<input>', {
                className: 'picker-from picker-date', 
                placeholder: 'od:'
            });

            var $inputTo = $('<input>', {
                className: 'picker-to picker-date',
                placeholder: 'do:'
            });

            this.$el.append([$inputFrom, $inputTo]);

            $inputFrom.pickadate({
                formatSubmit: 'yyyy/mm/dd',
                hiddenName: true
            });
            $inputTo.pickadate();

            this.pickerFrom = $inputFrom.pickadate('picker');
            this.pickerTo = $inputTo.pickadate('picker');

            this.pickerFrom.on('close', function() {
                this.setValue();
            }.bind(this));

            this.pickerTo.on('close', function() {
                this.setValue();
            }.bind(this));

            var value = this.operand.get('value');

            if (value[0]) this.pickerFrom.set('select', value[0], { format: this.format });
            if (value[1]) this.pickerTo.set('select', value[1], { format: this.format });

            return this;

        },

        setValue: function() {
            var time = 'T00:00:00+00:00';
            var format = 'yyyy-mm-dd';

            var date = [this.pickerFrom.get('select', format), 
                        this.pickerTo.get('select', format)];

            date = date.map(function(value) {
                return !!value ? value + time : null;
            });

             this.operand.set('value', date);
         }

    });

});
