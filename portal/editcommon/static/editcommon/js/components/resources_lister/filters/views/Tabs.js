define([
    'jquery',
    'underscore',
    'backbone',
    '../models/FavoriteFilter',
    'text!../templates/tabs/base.html',
    'text!../templates/tabs/tab.html'
], function (
    $,
    _,
    backbone,
    favFilter,
    template_base,
    template_tab
) {

    return backbone.View.extend({

        className: 'tabs',

        events: {
            'click .tab-favs': 'showFavFilters',
            'click .tab-name': 'setTabClickHandle',
            'click .rename': 'renameTab',
            'blur .tab-input': 'renameTab',
            'click .new-tab': 'newTabClickHandle',
            'click .remove-tab': 'removeClickHandle'
        },

        template_base: _.template(template_base),
        template_tab: _.template(template_tab),

        initialize: function(filters, opts) {
            this.opts = opts || {};
            this.filters = filters || [];
            this.render();

            this.listenTo(this.filters, 'add remove', this.render);
            this.listenTo(this.filters, 'add', this.setTab);

            this.listenTo(this.filters, 'selectFilter', this.setTab);
        },

        render: function() {
            this.$el.html(this.template_base());
            this.filters.each(function(tab) {
                var data = _.extend({}, tab.toJSON(), {cid: tab.cid});
                this.$('.tab-list').append(this.template_tab({tab: data}));
            }, this);
        },

        setTabClickHandle: function(ev) {
            ev.preventDefault();
            var elem = $(ev.target).parent(),
                model = this.filters.get(elem.data('cid'));
            this.setTab(model);
        },

        setTab: function(model) {
            //console.log('***setTab: selected filter model is: ', model);

            this.$('li.tab-item').removeClass('selected');
            this.$('li[data-cid="' + model.cid + '"]').addClass('selected');
            this.opts.controller.trigger('loadFilter', model);

            if (model.get('id') && !model.get('ephemeral')) {
                localStorage["epo.edit.lastUsed"] = model.get('id');
            }
        },

        removeClickHandle: function(ev) {
            ev.preventDefault();
            var elem = $(ev.target).parent(),
                model = this.filters.get(elem.data('cid'));
            model.destroy();
        },

        renameTab: function(ev) {
            ev.preventDefault();
            var elem = $(ev.target).parent(),
                input = elem.find('input'),
                model = this.filters.get(elem.data('cid'));

            input.toggle().focus();
            elem.find('.tab-name').toggle();

            if (input.val() != model.get('name')) {
                model.set('name', input.val());
                // We need to call render to change the name in bar.
                this.render();
            }
        },

        newTabClickHandle: function(ev) {
            ev.preventDefault();
            this.filters.trigger('addNewFilter');
        },

        showFavFilters: function() {
            if (this.favFilter) this.favFilter.destroy();
            this.favFilter = new favFilter();
            this.setTab(this.favFilter);
        }

    });

});

