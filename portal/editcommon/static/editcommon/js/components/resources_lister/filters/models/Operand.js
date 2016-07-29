define(['underscore', 'backbone', 'operandScheme'], function(_, backbone, oScheme) {

    var Operand = Backbone.Model.extend({
        
        defaults: function() {
            var value = oScheme.defaultValue(this.get('field'));
            return {
                'value': value,
                'mode': 'exact',
                'enabled': true,

                'hidden': false,
                'fixed': false
            }
        },

        initialize: function() {
            this.listenTo(this, 'change:field', function(model) {
                this.set('value', this.defaults().value);
            });

            //console.log('serialized:', this.serialize());

            this.listenTo(this, 'change:value', function(model) {
                // Clean previous relations in this model (we don't need them
                // if value is changed)

                if (this.collection) {
                    this.cleanRelation();
                    // If there is proper array of related fields, create operands
                    // with property (rid) indicates that they are relatd, also 
                    // setting It to changed model (related).
                    // Add all operands to collection.
                    var relFields = oScheme.hasRelatedField(model.get('value'));

                    if (relFields && relFields.length) {
                        var rid = _.uniqueId('rid_');
                        relFields.forEach(function(field) {
                            var operand = new Operand({
                                rid: rid,
                                field: field
                            });
                            model.collection.add(operand);
                        }, this);
                        model.set('related', rid);
                    }
                }

            });
        },

        destroy: function(options) {
            if (this.collection) this.cleanRelation();
            backbone.Model.prototype.destroy.call(this, options);
        },

        cleanRelation: function() {
            // This gets all operands that are related to model, and destroy It
            // silently (to prevent multiplication of request).
            // (This we be fired only when model is changed or destroyed)
            if (this.get('related') && this.get('related').length) {
                var related = this.get('related');
                this.collection.where({'rid': related}).forEach(function(obj) { 
                    obj.destroy({silent: true}) 
                });
                this.unset('related', {silent: true});
            }
        },

        serialize: function(options) {
            var json = this.toJSON();
            var whiteList = ['field', 'mode', 'value'];
            return whiteList.reduce(function(result, property) {
                if (json[property]) {
                    result[property] = json[property];
                }
                return result;
            }, {});
        },

        toJSON: function(options) {
            var json = backbone.Model.prototype.toJSON.call(this, options);
            //json.field === 'created' ? json.mode = 'range' : json.mode = 'exact'
            return json;
        }

    });

    return Operand;

});
