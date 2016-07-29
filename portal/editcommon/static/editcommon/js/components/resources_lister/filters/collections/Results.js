define([
    'underscore', 
    'backbone', 
    '../models/Result'
], function(
    _, 
    backbone,
    Result
){

    return backbone.Collection.extend({

        model: Result,

        initialize: function() {
            this.listenTo(this, 'newResults', function(results, opts) {
                this.reset(results);
            });

            this.listenTo(this, 'moreResults', function(results, opts) {
                this.add(results);
            });

            this.listenTo(this, 'newResults moreResults', function(results, opts) {
                this.trigger('setPaginationStatus', results.length, opts.size);
            });

        }
    
    });

});
