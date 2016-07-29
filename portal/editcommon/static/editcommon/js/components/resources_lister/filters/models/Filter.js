define([
    'underscore', 
    'backbone', 
    './Operand',
    '../collections/Operands',
    '../collections/Results',
    '../helpers/names',
    '../helpers/resultsSize',
    '../../settings/Default'
], function(
    _, 
    backbone, 
    Operand,
    Operands,
    Results,
    name,
    resultsSize,
    defaults
){

    'use strict';

    return Backbone.Model.extend({

        type: 'normal',

        defaults: {
            'name': 'Nowy Filtr'
        },

        availableFields: ['category', 'title', 'author'],

        initialize: function() {
            this.opts = {};
            this.operands = new Operands([], { filter: this });
            this.results = new Results();

            this.listenTo(this, 'addUnusedOperand', this.addUnusedOperand);
            this.listenTo(this, 'getAvailableFields', this.getAvailableFields);

            this.listenTo(this.operands, 'validatedChange', function() {
                this.trigger('sendNewRequest');
                if (!this.attributes.ephemeral) this.save();

                //
                // TODO: BAD SH... SO BAD
                //
                $('#kzd-welcome-box').hide();
                // PLEASE REMEMBER HOW BAD THIS IS AND HOW SH... YOUR SITUATION IS
                $('#kzd-lister .filter-list').show();

            });

            this.listenTo(this, 'sendNewRequest', function() {
                this.sendRequest('newResults', { from: 0 });
            });

            this.listenTo(this, 'getMoreResults', function() {
                this.sendRequest('moreResults', { from: this.results.size() });
            });
        },

        setup: function(opts) {

            this.opts.resultFields = _.union((opts.resultFields || []), defaults.resultFields);

            if (opts.featured !== false) {
                this.operands.addFeaturedOperand((opts.featured || defaults.featured));
            };

            if (opts.defaultFilter) {
                // If operands not exists, add It.
                // TODO: Verify it.
                // ** This only works fine when fixed operands are deleted 
                // before saving **
                var operandExists = this.operands.where({
                    'field': opts.defaultFilter['field']
                }).length;
                !operandExists && this.addFixedOperand(opts.defaultFilter);
            };

            if (opts.autoFilters) {
                this.addOperand
                opts.autoFilters.forEach(function(operand) {
                    //console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!", operand);
                    this.addOperand(operand);
                }, this);
            };

        },

        addOperand: function(field, opts) {
            var opts = opts || {};
            if (field) {
                var operand = new Operand(field);
                //console.log("OOOOO", operand);
                this.operands.add(operand, opts);
            }
        },

        addFixedOperand: function(operand) {
            // Every fixed operand we add with silent-true.
            this.addOperand(_.extend(operand, {'fixed': true}), { silent: true });
            //var idx = this.availableFields.indexOf(operand['field']);
            //if (idx > -1) {
            //    this.availableFields.splice(idx, 1);
            //}
        },

        addUnusedOperand: function() {
            var idx = 1;
            this.addOperand({field: this.availableFields[idx]});
        },

        getAvailableFields: function() {
            return this.availableFields.reduce(function(result, obj) {
                result.push({
                    'field': obj,
                    'name': name.getFieldName(obj)
                });
                return result;
            }, []);
        },

        sendRequest: function(action, opts) {
            var url = defaults.requestURL,
                size = resultsSize(),
                from = opts.from || 0;

            var body = this.serialize(from, size);

            //console.log('***request-body: ', body, JSON.stringify(body));
            
            this.reqInProgress = true;

            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(body),
                context: this,
                success: function(response) {
                    //console.log('*** response: ', response);
                    this.results.trigger(action, response, {
                        from: from, 
                        size: size
                    });
                }
            }).done(function() { 
                this.reqInProgress = false;
            });

            //}.bind(this), 5000);

        },

        toJSON: function() {
          // Overriden for saving proper model.
          var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
          json.operands = this.operands.toJSON();
          return json;
        },

        serialize: function(from, size) {
            var json = Backbone.Model.prototype.toJSON.apply(this, arguments);

            json['filter'] = {};
            json['filter']['operator'] = "and";

            json['filter']['operands'] = this.operands.serialize();

            json['fields'] = this.opts.resultFields;

            json['page'] = from;
            json['size'] = size;

            // TODO: Think more why this needs to be deleted
            delete json.operands;

            return json;
        }

    });

});
