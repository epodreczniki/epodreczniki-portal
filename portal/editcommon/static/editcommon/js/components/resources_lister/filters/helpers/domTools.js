define(['jquery'], function($) {

    var renderSelect = function(values) {
        var $select = $('<select>');

        var $blankOption = $('<option>');
        $blankOption.text('Wybierz wartość');
        $blankOption.attr('value', '');
        $select.append($blankOption);

        values.forEach(function(obj) {
            var $option = $('<option>');
            $option.text(obj.name);
            $option.attr('value', obj.value);
            $select.append($option);
        });

        return $select;
    };

    return {
        renderSelect: renderSelect
    }

});
