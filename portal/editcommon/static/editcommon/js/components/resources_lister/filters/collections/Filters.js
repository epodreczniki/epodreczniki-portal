define([
    'underscore', 
    'backbone', 
    '../models/Filter', 
    '../collections/Operands',
    'localStorage' 
], function(
    _, 
    backbone, 
    Filter,
    Operands
){

    'use strict';
     
    return backbone.Collection.extend({

        model: Filter,

        localStorage: new Backbone.LocalStorage("epo.edit.filters"),

        initialize: function() {
            this.listenTo(this, 'reset', this.getOperands);
            this.listenTo(this, 'addNewFilter', this.addNewFilter);
        },

        getOperands: function() {
            // This is part of difference beetween stored data and backbone scheme.
            // On fetch, we re-set all of the operands to reloaded filters
            this.each(function(filter) {
                filter.operands.add(filter.get('operands'));
                filter.unset('operands', { silent: true });
            });
        },

        addNewFilter: function(opts) {
            var filter = new Filter();
            //' console.log('cb', opts.cb);
            if (opts.cb) {
                opts.cb.call(opts.context, filter);
            }
            this.add(filter);
        }

    });

});
