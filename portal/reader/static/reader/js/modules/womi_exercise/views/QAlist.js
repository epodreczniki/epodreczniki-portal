define(['_jquery',
        'backbone',
        'text!../templates/single_answer_list.html',
        'text!../templates/multiple_answers_list.html'], function($, Backbone, single_answer_template, multiple_answers_template) {
    
    'use strict';
    
    var ListView = Backbone.View.extend({
        
        tagName: 'li',
        
        render: function() {
            var model = this.model.toJSON();

            this.$el.html(this.template(
                {
                    cid: model.cid,
                    name: model.name,
                    id: model.id
                }
            ));
            this.$('.content').html(this.model.attributes.content);
            return this;
        }
        
    });
    
    var SingleAnswer = ListView.extend({ template: _.template( single_answer_template ) });
    
    var MultipleAnswers = ListView.extend({ template: _.template( multiple_answers_template ) });
    
    return {
        SingleAnswer: SingleAnswer,
        MultipleAnswers: MultipleAnswers
    }
    
});
