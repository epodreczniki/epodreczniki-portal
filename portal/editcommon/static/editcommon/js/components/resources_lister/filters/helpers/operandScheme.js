define([], function() {

    var firstLevelOperands = ['category', '_id', 'title', 'author', 'created'];

    var types = {
        category: {
            format: 'select',
            values: ['collection', 'module', 'womi']
        },
        _id: {
            format: 'textField'
        },
        title: {
            format: 'textField'
        },
        author: {
            format: 'textField'
        },
        subject: {
            format: 'select',
            values: [
                'edukacja dla bezpieczeństwa', 
                'przyroda', 
                'wiedza o społeczeństwie', 
                'historia', 
                'historia i społeczeństwo', 
                'edukacja wczesnoszkolna', 
                'geografia', 
                'biologia', 
                'chemia', 
                'język polski', 
                'zajęcia komputerowe', 
                'informatyka',
                'fizyka',
                'matematyka'
            ]
        },
        womi_type: {
            format: 'select',
            values: [
                'icon',
                'interactive',
                'sound',
                'movie',
                'graphics'
            ]
        },
        created: {
            format: 'datePicker'
        }
    };

    // This is realtion beetween operands and coexist, ex. when I only can set
    // 'subject' operand when category is set to 'collection'
    var relation = {
        collection: ['subject'],
        womi: ['womi_type']
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
