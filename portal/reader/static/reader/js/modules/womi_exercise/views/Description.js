define(['_jquery',
    'underscore',
    'backbone',
    '../../core/Registry',
    '../models/Description',
    'text!../templates/describtion.html'], function($, _, Backbone, Registry, ExerciseModel, describtion) {

        'use strict';

        return Backbone.View.extend({

            className: 'exercise-description',

            template: _.template( describtion ),

            render: function() {


                var model = this.model.toJSON();
                this.$el.html(this.template( {
                    title: model.title,
                    author: model.author
                } ));

                this.$(".content").html(this.model.attributes.content);

                if(Registry.get('layout')){
                    if (this.$el.find("math, .MathJax").length) {
                        Registry.get('layout').trigger('refreshContent', this.$el, {typeset: true});
                    }
                }

                return this;
            }


        });

});
