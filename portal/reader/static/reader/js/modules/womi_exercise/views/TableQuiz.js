define(['jquery',
        'underscore',
        '../views/Generic',
        'EpoAuth',
        'text!../templates/table_quiz/table_skelton.html',
        'text!../templates/table_quiz/table_question.html'],

        function($, _, Generic, EpoAuth, table_skelton, table_answer) {
        
            return Generic.extend({
                
                postInitialize: function(options) {

                    this.answers = this.options.answers;
                    this.questions = this.options.questions;

                },

                className: 'table-quiz',

                initExercise: function() {
                    var _this = this,
                        tableQuizQuestionsList = this.$('tr.question'),
                        numOfCorrect = 0;
                    this.readerApi.getUserVar("tableQuiz", function(response){
                        if(response.status == 'success') {
                            var tableQuizState = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                            if (tableQuizState !== null) {

                                if(tableQuizState.answer == "saveonly") {
                                    _.each(tableQuizQuestionsList, function (question) {
                                        _.each(tableQuizState.value, function (table) {
                                            var questionId = table[0];
                                            var answerId = table[1];
                                            var correct = table[2];
                                            if (_this.$(question).data("id") == questionId) {
                                                var answerEl = _this.$(question).find("[data-id='" + answerId + "']");
                                                _this.$(answerEl).attr('checked', true);
                                                if (correct == "correct") {
                                                    numOfCorrect += 1;
                                                }
                                            }
                                        });
                                    });
                                }else{
                                    _.each(tableQuizQuestionsList, function (question) {
                                        _.each(tableQuizState.value, function (table) {
                                            var questionId = table[0];
                                            var correct = table[2];
                                            if (_this.$(question).data("id") == questionId) {
                                                if (correct == "correct") {
                                                    numOfCorrect += 1;
                                                }
                                            }
                                        });
                                    });
                                    var result = numOfCorrect === _this.questions.size();
                                    var message = "";
                                    if(result){
                                        message = "To zadanie zostało rozwiązane poprawnie.";
                                    }else{
                                        message = "To zadanie jest rozwiązane niepoprawnie.";
                                    }
                                    _this.eventBus.trigger('setMessage', message);
                                }

                            }
                        }

                    });
                },

                render: function() {

                    this.$el.html(table_skelton);

                    this.answers.each(this.addAnswer, this); 

                    this.questions.each(this.addQuestion, this);

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

                addAnswer: function(model) {
                    
                    var cell = $('<th>', {
                        class: 'answer',
                        html: model.attributes.content
                    });

                    this.$('.head').append(cell);

                },

                addQuestion: function(model) {
                
                    var question = model;

                    var row = $('<tr>', {
                        class: 'question',
                        attr: {
                            'data-id': question.attributes.id
                        }
                    });

                    row.append(
                        $('<td>', {
                            html: question.attributes.content
                        })
                    );

                    this.answers.each(function(answer) {
                        var elem = _.template(table_answer)(
                            {
                                cid: question.cid,
                                id: answer.id,
                                label: question.attributes.content + ' ' + answer.attributes.content
                            }
                        );

                        row.append(elem);

                    }, this);

                    this.$('.exercise-table').append(row);
                
                },

                checkExercise: function(e) {

                    e.preventDefault();

                    var answersState = this._checkAnswers();

                    this.readerApi.setUserVar("tableQuiz", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                    this.eventBus.trigger('getFeedback', answersState[0]);

                },

                _checkAnswers: function(state) {
                    var _this = this,
                        numOfCorrect = 0;

                    var tableQuizAnswers = [];

                    var correctWcag = $("<div>",{
                        class: "quiz-answer-correct-wcag wcag-hidden",
                        text: "Dobrze"
                    });

                    var incorrectWcag = $("<div>",{
                        class: "quiz-answer-incorrect-wcag wcag-hidden",
                        text: "Źle"
                    });

                    var correctEl = $("<div>",{
                        class: "quiz-answer-correct",
                        title: "Dobrze"
                    });

                    var incorrectEl = $("<div>",{
                        class: "quiz-answer-incorrect",
                        title: "Źle"
                    });

                    this.$('tr.question').first().parent().find('.quiz-answer-incorrect-wcag').remove();
                    this.$('tr.question').first().parent().find('.quiz-answer-correct-wcag').remove();
                    this.$('tr.question').each(function() {

                        if($(this).children().last().attr('class') != 'result') {
                            $(this).append('<td class="result"></td>');
                        }
                        else {
                            $(this).find('.result').empty();
                        };

                        var qID = $(this).data('id'),
                            aID = $(this).find("input[type='radio']:checked").data('id');

                        if (_this.questions.get(qID).get('correct') == aID) {
                            numOfCorrect += 1;
                            if (state === undefined) {
                                $(this).attr('data-correct', 'correct');
                                $(this).children().last().prepend(correctWcag.clone());
                                $(this).children().last().prepend(correctEl.clone());
                            }
                            tableQuizAnswers.push([qID, aID, "correct"]);

                        } else {
                            if (state === undefined) {
                                $(this).attr('data-correct', 'incorrect');
                                $(this).children().last().prepend(incorrectWcag.clone());
                                $(this).children().last().prepend(incorrectEl.clone());
                            }
                            tableQuizAnswers.push([qID, aID, "incorrect"]);
                        }

                    });

                    var result = numOfCorrect === this.questions.size();

                    var answer = '';
                    if (state === undefined) {
                        answer = result ? 'correct' : 'incorrect';
                    } else {
                        answer = "saveonly";
                    }

                    var tableQuizState = {
                        answer: answer,
                        value:  tableQuizAnswers
                    };

                    return [result, tableQuizState];
                },

                saveState: function(e){
                    e.preventDefault();

                    var answersState = this._checkAnswers("saveonly");

                    this.readerApi.setUserVar("tableQuiz", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                }

            });
        }
);
