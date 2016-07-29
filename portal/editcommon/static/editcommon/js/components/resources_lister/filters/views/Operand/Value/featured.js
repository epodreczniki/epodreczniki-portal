define([
    'jquery',
    'underscore',
    'backbone',
    './Value'
], function(
    $,
    _,
    backbone,
    ValueView
) {

    return ValueView.extend({

        className: 'filter-item',

        template: _.template("\
            <input class='model-value allsearch-field' placeholder='Wpisz wyszukiwany tytuł'><button class='search-trigger'>szukaj</button>"),

        addButton: _.template("<button class='add'></button>"),

        postInitialize: function(params) {
            this.$value = $(this.template());
        },

        postRender: function() {
            //this.$el.append($(this.addButton()));
        }
    
    });

});

