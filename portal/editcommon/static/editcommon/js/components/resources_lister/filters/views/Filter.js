define([
    'jquery',
    'underscore',
    'backbone',
    '../helpers/operandScheme',
    './Operand/Operand',
    './Operand/Value/featured',
    'text!../templates/filter_body.html',
    '../helpers/names',
    'text!../templates/filter_summary.html'
], function(
    $,
    _,
    backbone,
    oScheme,
    Operand,
    FeaturedOperand,
    filter_body,
    names,
    filter_summary
) {

    return backbone.View.extend({
        
        className: 'filter-body',

        template: _.template(filter_body),

        template_summary: _.template(filter_summary),

        events: {
            'click .add': 'addOperandClickHandle'
        },

        initialize: function(filter, opts) {
            this.opts = opts || {};    
            this.filter = filter;

            this.listenTo(this.filter.operands, 'validatedChange', this.renderSummary);

            this.listenTo(this.filter.operands, 'add', this.renderOperand);
            //this.listenTo(this.filter.operands, 'add', this.addNewOperand);

            // TODO: THIS MAY GO AWAY SOON.
            //this.filter.trigger('sendNewRequest');
        },

        remove: function() {
            // Override remove because of unbind hiding summary
            $('body').unbind();
            backbone.View.prototype.remove.call(this);
        },

        render: function() {
            this.$el.html(this.template());

            this.$featuredOperand = this.$('.global-filter');

            this.$filterList = this.$('ul.filter-list');

            this.filter.operands.forEach(this.renderOperand, this);

            this.renderFeaturedOperand();

            this.renderSummary();

            $('body').bind('click', $.proxy(this.hideSummary, this));

            return this;
        },

        renderOperand: function(model) {
            if (!model.get('featured') && 
                !model.get('fixed') && 
                !model.get('rid') && 
                !model.get('hidden')) {
                var view = new Operand({operand: model});
                this.$filterList.append(view.render().el);
            }
        },

        renderFeaturedOperand: function() {
            var featured = this.filter.operands.featured();
            if (featured.length) {
                var view = new FeaturedOperand({operand: featured[0]});
                this.$featuredOperand.append(view.render().el);
            } 
        },

        //addNewOperand: function(model) {
        //    // All this crazy magical stuff needs to be separated.
        //    var el = this.getStandardOperandElement(model);
        //    if (this.$('.filter-list').is(':hidden')) {
        //        this.$('.filter-list').velocity(
        //            "transition.slideDownIn", {
        //            drag: true, 
        //            duration: 20, 
        //            complete: function() {
        //                el.css('background', '#CAFF94');
        //                $('.filter-list').append(el);
        //                el.velocity("transition.flipYIn", { drag: true, duration: 100 });
        //                el.velocity({'backgroundColor': '#ffffff'}, 500); 
        //            }
        //        });
        //    } else {
        //        el.css('background', '#CAFF94');
        //        $('.filter-list').append(el);
        //        el.velocity("transition.flipYIn", { drag: true, duration: 100 });
        //        el.velocity({'backgroundColor': '#ffffff'}, 500); 
        //    };
        //},

        //getStandardOperandElement: function(model) {
        //    return new StandardOperand({
        //        operand: model,
        //        availableFields: this.availableFields
        //    }).$el;
        //},

        addOperandClickHandle: function(ev) {
            this.filter.trigger('addUnusedOperand');
            ev.stopPropagation();
        },

        // TODO: ALL OF THIS NEEDS HIGHER LEVEL OF ABSTRACTION.
        renderSummary: function() {
            this.$('.summary').html(
                // TODO: Can do this nicer way.
                "" +
                this.template_summary({summary: this.getSummary(), favorites: this.filter.type === 'favorites' })
            ); 
        },

        getSummary: function() {
            return this.filter.operands.reduce(function(result, obj) {
                var summary = [
                    obj.get('field'),
                    obj.get('value').join(" ")
                ];
                // TODO maybe make it a little bit more clear?
                if (typeof summary[0] != 'undefined' && 
                    !obj.get('hidden') &&
                    summary[1].length) {
                    result.push(names.getSummaryString.apply(null, summary));
                }
                return result;
            }, []);
        }

        //toggleSummary: function(ev) {
        //    if ($('.filter-list').is(':hidden')) {
        //        this.$('.filter-list').velocity("transition.slideDownIn", { drag: true, duration: 20 });
        //    } else {
        //        this.$('.filter-list').velocity("transition.slideUpOut", { drag: true, duration: 20 });
        //    }
        //    if (ev) ev.stopPropagation();
        //},

        //hideSummary: function(ev) {
        //    this.filter.trigger('validateOperands');

        //    var container = $('.summary, .filter-list');
        //    if (!container.is(!ev.target)
        //        && container.has(ev.target).length === 0)
        //    {
        //        $('.filter-list').velocity("transition.slideUpOut", { 
        //            drag: true, 
        //            duration: 20 
        //        });
        //    }

        //}

    });

});
