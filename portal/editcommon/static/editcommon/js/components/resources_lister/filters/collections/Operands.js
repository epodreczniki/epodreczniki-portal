define([
    'underscore', 
    'backbone', 
    '../models/Operand',
    'operandScheme'
], function(
    _, 
    backbone, 
    Operand,
    oScheme
) {

    'use strict';

    return Backbone.Collection.extend({

        model: Operand,

        initialize: function() {
            this.listenTo(this, 'change', function(model, opts) {
                if (model.get('value').join('') !== model.previous('value').join('') &&
                    !opts.pair) {
                    this.trigger('validatedChange');
                }
            });

            this.listenTo(this, 'remove', function(model) {
                if (model.get('value').length) {
                    this.trigger('validatedChange');
                }
            });

        },

        addOperand: function(properties, options) {
            //console.log('XXXX ABC', properties, options);
            var operand = new Operand(properties, (options || {}));
            this.add(operand);
        },

        addFeaturedOperand: function(properties, options) {
            // Assumes that there is only one featured operand.
            var featured = this.featured()[0];
            var properties = _.extend(properties, {featured: true});
            // This prevents from dissapearing featured operands when new featured
            // operand is added (thats why there is unset on previous featured).
            if (!featured) {
                this.addOperand(properties, {silent: true});
            } else if (featured && featured.get('field') !== properties.field) {
                featured.unset('featured');
                this.addOperand(properties, {silent: true});
            }
        },

        featured: function() {
            return this.where({featured: true});
        },

        serialize: function() {
            // This is just for request, so empty values may be omitted.
            return this.map(function(model) { 
                return model.serialize();
            }).filter(function(model) { return (model.value.join("").length)});
        },

        toJSON: function(options) {
            // This is for saving data, not request to ES.
            var json = backbone.Collection.prototype.toJSON.call(this, options);
            // We need to serialize only objects with value or related objects
            // (to prevent lack of fields when rerendered).
            return json.filter(function(obj) { return (obj.value.join("").length || obj.rid ) });
        }

    });

});
