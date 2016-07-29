define(['_jquery',
    'backbone',
    '../views/QAlist',
    '../views/GenericQAView'], function($, Backbone, QAList, GenericQAView) {

        'use strict';

        return GenericQAView.extend({

            initExercise: function () {
                var answers = this.$('li');
                var _this = this;
                this.readerApi.getUserVar("multipleAnswers", function(response){
                    if (response.status == 'success') {
                        var multipleAnswers = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                        if (multipleAnswers !== null) {
                            if (multipleAnswers.answer == "saveonly") {
                                _.each(answers, function (el) {
                                    _.each(multipleAnswers.value, function (answer) {
                                        _this.$(el).find("[data-id='" + answer[0] + "']").attr('checked', true);
                                    });
                                });
                            } else if (multipleAnswers.answer == "correct") {
                                _this.eventBus.trigger('setMessage', "To zadanie zostało rozwiązane poprawnie.");
                             }else if (multipleAnswers.answer == "incorrect") {
                                _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                            }
                        }
                    }
                });

            },

            checkExercise: function(e) {
                e.preventDefault();

                var answersState = this._checkAnswers();

                this.readerApi.setUserVar("multipleAnswers", JSON.stringify(answersState[1]), function(status){
//                    console.log(status);
                });

                this.eventBus.trigger('getFeedback', answersState[0]);
            },

            _checkAnswers: function(state) {
                var answer = this.$('li'),
                    exerciseCorrect = this.collection.correct,
                    selectedCorrect = 0,
                    selectedWrong = 0,
                    result;

                answer.removeClass('correct-answer wrong-answer');

                var correctEl = $("<div>",{
                    class: "quiz-answer-correct",
                    title: "Dobrze"
                });

                var correctWcag = $("<div>",{
                        class: "quiz-answer-correct-wcag wcag-hidden",
                        text: "Dobrze"
                    });

                var incorrectEl = $("<div>",{
                    class: "quiz-answer-incorrect",
                    title: "Źle"
                });

                var incorrectWcag = $("<div>",{
                        class: "quiz-answer-incorrect-wcag wcag-hidden",
                        text: "Źle"
                    });

                var multipleAnswers = [];

                _.each(answer, function(el) {
                    var model = this.collection.get($(el).find(':checked').data('id'));

                    if($(el).find('.quiz-answer-correct').length > 0){
                        $(el).find('.quiz-answer-correct').remove();
                    }
                    if($(el).find('.quiz-answer-incorrect').length > 0){
                       $(el).find('.quiz-answer-incorrect').remove();
                    }

                    if (model) {

                        if (model.attributes.correct === true) {

                            if (state === undefined) {
                                $(el).addClass('correct-answer');
                                $(el).prepend(correctEl.clone());
                                $(el).prepend(correctWcag.clone());
                            }

                            selectedCorrect += 1;
                            multipleAnswers.push([model.id, 'correct']);

                        } else {

                            if (state === undefined) {
                                $(el).addClass('wrong-answer');
                                $(el).prepend(incorrectEl.clone());
                                $(el).prepend(incorrectWcag.clone());
                            }

                            selectedWrong += 1;
                            multipleAnswers.push([model.id, 'incorrect']);

                        }

                    } else {

                        if (state === undefined) {
                            $(el).addClass('wrong-answer');
                            $(el).prepend(incorrectEl.clone());
                            $(el).prepend(incorrectWcag.clone());
                        }

                    }

                }, this);

                if (selectedCorrect === exerciseCorrect && selectedWrong === 0) {

                    result = true;

                    answer.removeClass('wrong-answer');
                    if(answer.find('.quiz-answer-incorrect').length > 0){
                       answer.find('.quiz-answer-incorrect').remove();
                        answer.find('.quiz-answer-incorrect-wcag').remove();
                    }

                } else {

                    result = false;

                }

                var answer = '';
                if (state === undefined) {
                    answer = result ? 'correct' : 'incorrect';
                } else {
                    answer = "saveonly";
                }

                var multipleAnswersState = {
                    answer: answer,
                    value:  multipleAnswers
                };

                return [result, multipleAnswersState];
            },
                        
            addOne: function(model) {

                var newView = new QAList.MultipleAnswers( {model:model} );
                this.$el.append(newView.render().el);
            },

            saveState: function(e){
                e.preventDefault();

                var answersState = this._checkAnswers("saveonly");

                this.readerApi.setUserVar("multipleAnswers", JSON.stringify(answersState[1]), function(status){
//                    console.log(status);
                });

            }

        });

});
