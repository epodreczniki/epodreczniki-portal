define([
    'jquery',
    'underscore', 
    'backbone', 
    './filters/collections/Filters',
    './filters/views/Tabs',
    './filters/views/Filter',
    'ResultsView'
],  function(
    $, 
    _, 
    backbone, 
    Filters,
    TabsView,
    FilterView,
    ResultsView
) {

    'use strict';

    return backbone.View.extend({

        className: 'resources-lister',

        initialize: function(opts) {
            // Basic API for the lister will be below.
            this.opts = opts || {};
            //console.log('opts', this.opts);

            // Saved Filters, represented as a tabs. 
            this.filters = new Filters();

            this.listenTo(this, 'loadFilter', this.loadFilter);

            this.postInitialize();
        },

        postInitialize: function(opts) {},

        render: function() {
            this.$el.html('');

            // Create a hook for filter-vc.
            this.$el.append("<div class='tabs'></div>");
            this.$el.append("<div class='filter'></div>");
            this.$el.append("<div class='search-results'></div>");

            // First we fetch saved filters, and create tabs view from it.
            // TODO: hm, maybe nicer?
            if (!!this.opts.saveMode) {
                this.filters.fetch({reset: true});
                this.tabsView = new TabsView(this.filters, { controller: this });
                //this.$el.append(this.tabsView.$el);
                this.$('.tabs').append(this.tabsView.$el);
            } else {
                this.filters.trigger('addNewFilter', { cb: this.loadFilter, context: this });
            }
            
            // Check if the is some valid lastUsed filter.
            this.loadLastUsedFilter();
        },

        loadFilter: function(filter) {
            //console.log('*** from loadFilter THAT WAS CALLED, filter: ', filter, this);
            filter.setup(this.opts);
            this.createFilterVC(filter);
            this.createResultsVC(filter);
        },

        loadLastUsedFilter: function() {
            var lastUsedId = localStorage["epo.edit.lastUsed"];

            if (!!this.opts.saveMode &&
                lastUsedId && this.filters.get(lastUsedId)) {
                this.filters.trigger('selectFilter', 
                                     this.filters.get(lastUsedId));
            }
        },

        createFilterVC: function(filter) {
            if (this.filterView) this.filterView.remove();
            this.filterView = new FilterView(filter, { controller: this });
            this.$('.filter').html(this.filterView.render().el);
        },

        createResultsVC: function(filter) {
            if (this.resultsView) this.resultsView.remove();    
            this.resultsView = new ResultsView(filter, { controller: this });
            this.$('.search-results').html(this.resultsView.$el);
        }

    });

});
