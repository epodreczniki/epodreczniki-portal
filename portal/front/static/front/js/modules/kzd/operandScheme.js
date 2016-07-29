define([], function() {

    //var firstLevelOperands = ['category', '_id', 'title', 'author', 'created'];
    var firstLevelOperands = ['educationLevels', 'extended_category'];

    var categories = [];
    $('a.category').each(function() {
        categories.push({value: $(this).data('category-item'), label: $(this).find('.kzd-category-label').text()});
    });

    var types = {
        'extended_category': {
            format: 'selectKzd',
            values: categories
        },
        educationLevels: {
            format: 'select',
            values: ['E1', 'E2', 'E3', 'E4']
        },
    };

    // This is realtion beetween operands and coexist, ex. when I only can set
    // 'subject' operand when category is set to 'collection'
    var relation = {
    };

    // This is default values setted for
    var defaultValues = {
            //category: 'womi'
    };

    var getDefaultValue = function(field) {
        var value = defaultValues[field];
        return (value) ? [value] : [];
    };

    var hasRelatedField = function(value) {
        return relation[value];
    };

    return {
        types: types,
        relation: relation,
        firstLevel: firstLevelOperands,
        defaultValue: getDefaultValue,
        hasRelatedField: hasRelatedField
    }

});
