define(['_jquery',
        'backbone',
        '../views/GenericQAView',
        'EpoAuth',
        'text!../templates/true_false_skelton.html',
        'text!../templates/true_false.html'
        ], function($, backbone, GenericQAView, EpoAuth, tf_skelton_template, tf_template) {

        'use strict';

        return GenericQAView.extend({

            skelton: _.template( tf_skelton_template ),
            template: _.template( tf_template ),

            initExercise: function () {
                var questions = this.$('.question-set');
                var _this = this;

                this.readerApi.getUserVar("truefalse", function(response){
                    if(response.status == 'success') {
                        var truefalse = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                        if (truefalse !== null) {
                            if (truefalse.answer == "saveonly") {
                                _.each(questions, function (element) {
                                    _.each(truefalse.value, function(trfl){
                                        if (_this.$(element).find('input').data('id') == trfl.answerId) {
                                            _.each(_this.$(element).children("input[type='radio']"), function(el){
                                                if(trfl.correct !== undefined) {
                                                    if (trfl.correct.toString() == _this.$(el).val()) {
                                                        _this.$(el).attr('checked', 'checked');
                                                    }
                                                }
                                            });
                                        }
                                    });
                                });
                            } else if (truefalse.answer == "correct") {
                                _this.eventBus.trigger('setMessage', "To zadanie zostało rozwiązane poprawnie.");
                             }else if (truefalse.answer == "incorrect") {
                                _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                            }

                        }
                    }
                });
            },

            checkExercise: function(e) {
                e.preventDefault();

                var answersState = this._checkAnswers();

                this.readerApi.setUserVar("truefalse", JSON.stringify(answersState[1]), function(status){
//                    console.log(status);
                });

                this.eventBus.trigger('getFeedback', answersState[0]);

            },

            _checkAnswers: function(state) {
                var questions = this.$('.question-set');
                var wrong = 0;
                var that = this;

                var truefalse = [];

                var correctEl = $("<div>",{
                    class: "quiz-answer-correct",
                    title: "Dobrze"
                });

                var incorrectEl = $("<div>",{
                    class: "quiz-answer-incorrect",
                    title: "Źle"
                });

                var correctWcag = $("<div>",{
                    class: "quiz-answer-correct-wcag wcag-hidden",
                    text: "Dobrze"
                });

                var incorrectWcag = $("<div>",{
                    class: "quiz-answer-incorrect-wcag wcag-hidden",
                    text: "Źle"
                });

                questions.each(function(index, element) {
                    var id = $(element).data("id");
                    var item = that.collection.get(id);

                    var selected = $(element).children("input[type='radio']:checked").val();
                    var selectedBool;

                    if($(element).parents('li').find('.quiz-answer-correct').length > 0){
                        $(element).parents('li').find('.quiz-answer-correct').remove();
                        $(element).parents('li').find('.quiz-answer-correct-wcag').remove();
                    }
                    if($(element).parents('li').find('.quiz-answer-incorrect').length > 0){
                       $(element).parents('li').find('.quiz-answer-incorrect').remove();
                        $(element).parents('li').find('.quiz-answer-incorrect-wcag').remove();
                    }

                    if (selected) {
                        selectedBool = selected === 'true';
                    }
                    if ( selectedBool === item.get('correct') ) {
                        //$(element).children('label').addClass('correct');
                        if (state === undefined) {
                            $(element).parents('li').removeClass('wrong-answer').addClass('correct-answer');
                            $(element).parents('li').prepend(correctEl.clone());
                            $(element).parents('li').prepend(correctWcag.clone());
                        }
                        truefalse.push({
                            answerId: item.get('id'),
                            correct: selectedBool,
                            answer: "correct"
                        });
                    } else {
                        wrong += 1;
                        if (state === undefined) {
                           $(element).parents('li').removeClass('wrong-answer').addClass('wrong-answer');
                           $(element).parents('li').prepend(incorrectEl.clone());
                            $(element).parents('li').prepend(incorrectWcag.clone());
                        }
                        truefalse.push({
                            answerId: item.get('id'),
                            correct: selectedBool,
                            answer: "incorrect"
                        });
                    }
                });

                var result = wrong === 0;

                var answer = '';
                if (state === undefined) {
                    answer = result ? 'correct' : 'incorrect';
                } else {
                    answer = "saveonly";
                }

                var trueFalseAnswersState = {
                    answer: answer,
                    value:  truefalse
                };

                return [result, trueFalseAnswersState];
            },

            saveState: function(e){
                e.preventDefault();

                var answersState = this._checkAnswers("saveonly");

                this.readerApi.setUserVar("truefalse", JSON.stringify(answersState[1]), function(status){
//                    console.log(status);
                });

            },

            render: function() {
                this.$el.append(this.skelton());
                this.filtered.each(this.addOne, this);
                this.initExercise();
                var _this = this;
                this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function(data){
                    setTimeout(function(){
                        _this.eventBus.trigger('showSaveState');
                    }, 50);
                });
                EpoAuth.ping();
                return this;
            },

            addOne: function(model) {

                var modelJSON = model.toJSON();

                var newView = this.template(modelJSON);

                var tempView = $('<span>');
                
                tempView.append(newView);

                tempView.find('.content').append(model.attributes.content);
                tempView.find('input').each(function() {
                    $(this).attr('aria-label', model.attributes.content + $(this).attr('aria-label'));
                });

                this.$el.append(tempView);

            },

            recreate: function() {
                this.clean();
                this.$el.empty();
                this.$el.find('input[type=checkbox]:checked').removeAttr('checked');
                this.getFiltered();
                this.$el.append(this.skelton());
                this.filtered.each(this.addOne, this);
                var _this = this;
                this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function(data){
                    setTimeout(function(){
                        _this.eventBus.trigger('showSaveState');
                    }, 50);
                });
                EpoAuth.ping();
                return this;
            }
            
        });

});

