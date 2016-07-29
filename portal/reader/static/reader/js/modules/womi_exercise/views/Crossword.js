define(['jquery',
        'underscore',
        'backbone',
        'EpoAuth',
        '../views/Crossword/QuestionView',
        'text!../templates/crossword/body.html',
        'text!../templates/crossword/row.html'],

        function($, _, backbone, EpoAuth, QuestionView, crossword_body, crossword_row) {
        
            'user strict';

            return backbone.View.extend({
            
                className: 'crossword-exercise',

                templateBody: _.template( crossword_body ),

                templateRow: _.template( crossword_row ),

                initialize: function(options) {
                    this.options = options || {};
                    this.eventBus = this.options.eventBus;

                    this.body = this.options.body;
                    this.solutionPosition = this.options.solutionPosition;

                    this.eventBus.on('checkExercise', this.checkExercise, this);
                    this.eventBus.on('saveState', this.saveState, this);

                    this.readerApi = this.options.readerApi;
                },

                initCrossword: function(){
                    var tableRows = this.$el.find('tr');
                    var _this = this;
                    this.readerApi.getUserVar("crossword", function(response){
                        if(response.status == 'success') {
                            var crossword = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
//                            console.log(crossword);
                            if (crossword !== null) {
                                if(crossword.answer == "saveonly") {
                                    _.each(tableRows, function (row, idx) {
                                        var id = idx + 1;
                                        if (crossword.value[id] !== undefined && crossword.value[id] !== null) {
                                            var counter = 0;
                                            var letters = $(row).find('.letter');
                                            _.each(letters, function (letter) {
                                                $(letter).children('input').val(crossword.value[id][0][counter]);
                                                counter += 1;
                                            });
                                        }
                                    });
                                } else if (crossword.answer == "correct") {
                                    _this.eventBus.trigger('setMessage', "To zadanie zostało rozwiązane poprawnie.");
                                }else if (crossword.answer == "incorrect") {
                                    _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                                }
                            }
                        }
                        });


                },

                checkExercise: function(e) {
                    e.preventDefault();

                    var answersState = this._checkAnswers();

                    this.readerApi.setUserVar("crossword", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                    this.eventBus.trigger('getFeedback', answersState[0]);
                },

                _checkAnswers: function(state){
                    var tableRows = this.table.find('tr'),
                        wrongAns = 0,
                        correctAns = 0,
                        _this = this;

                    tableRows.removeClass('correct wrong');

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

                    if(tableRows.find('.quiz-answer-correct').length > 0){
                        tableRows.find('.quiz-answer-correct').remove();
                        tableRows.find('.quiz-answer-correct-wcag').remove();
                    }

                    if(tableRows.find('.quiz-answer-incorrect').length > 0){
                        tableRows.find('.quiz-answer-incorrect').remove();
                        tableRows.find('.quiz-answer-incorrect-wcag').remove();
                    }

                    var crossword = [];

                    _.each(tableRows, function(row) {
                        var counter = 0;
                        var letters = _this.$(row).find('.letter');
                        var id = _this.$(row).data('id');
                        var item = this.body.get(id);
                        var correctLetter = 0;
                        var wrongLetter = 0;
                        var word = [];

                        _.each(letters, function(letter) {
                            var value = $(letter).children('input').val().toLowerCase();
//                            console.log('letter: ', value, 'correct: ', item.get('correct')[counter]);
                            word.push(value);
                            if (value === item.get('correct')[counter].toLowerCase())
                            {
                                correctLetter += 1;
                            } else {
                                wrongLetter += 1;
                                if (state === undefined) {
                                    // _this.$(letter).parent('tr').addClass('wrong');
                                }
                            }

                            counter += 1;
                        }, this);

                        if (wrongLetter > 0) {
                            wrongAns += 1;
                            crossword[id] = [word, 'incorrect'];
                            if (state === undefined) {

                                _this.$(row).addClass('wrong');
                                _this.$(row).append(incorrectEl.clone());
                                _this.$(row).append(incorrectWcag.clone());

                            }
                        } else {
                            crossword[id] = [item.get('correct'), 'correct'];
                            if (state === undefined) {
                                _this.$(row).addClass('correct');
                                _this.$(row).append(correctEl.clone());
                                _this.$(row).append(correctWcag.clone());
                            }
                        }

                    }, this);

                    var result = wrongAns === 0;

                    var answer = '';
                    if (state === undefined) {
                        answer = result ? 'correct' : 'incorrect';
                    } else {
                        answer = "saveonly";
                    }

                    var crosswordState = {
                        answer: answer,
                        value:  crossword
                    };

                    return [result, crosswordState];
                },

                wcagAnswerFocus: function() {
                    var solutionLetters = this.table.find('.solution-letter');
                    solutionLetters.addClass('solution-letter-focused');
                    var solution = "Aktualne rozwiązanie: ";
                    solutionLetters.each(function () {
                        solution += $(this).find('input').val();
                    });
                    this.wcagAnswer.text(solution);
                },

                wcagAnswerBlur: function() {
                    this.table.find('.solution-letter').removeClass('solution-letter-focused');
                },

                render: function() {
                    this.$el.empty();
                    this.table = $('<table class="crossword-table"><tbody></tbody></table>');
                    this.wcagAnswer = $('<span class="wcag-hidden-inside" tabindex="0">');
                    this.cluesList = $('<div class="clues-list" />');

                    this.table.attr('id', _.uniqueId('crossword_'));
                    this.wcagAnswer.focus(_.bind(this.wcagAnswerFocus, this)).blur(_.bind(this.wcagAnswerBlur, this));

                    this.$el.append(this.table).append(this.wcagAnswer).append(this.cluesList);

                    this.body.each(this.addRow, this);

                    this.initCrossword();
                    var _this = this;
                    this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function(data){
                        setTimeout(function(){
                            _this.eventBus.trigger('showSaveState');
                        }, 50);
                    });
                    EpoAuth.ping();

                    return this;
                },

                saveState: function() {
                     var answersState = this._checkAnswers("saveonly");

                    this.readerApi.setUserVar("crossword", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });
                },

                addRow: function(model) {
                    var data = model.toJSON(),
                        wordLength = data.correct.length,
                        cap = data.position - 1,
                        fullId = this.table.attr('id') + '_' + data.id;

                    var newView = this.templateRow( { fullId: fullId, id: data.id, cap: cap, wordLength: wordLength, solutionPosition: this.solutionPosition } );

                    this.table.append( newView );
                    this.cluesList.append('<label for="' + fullId + '">' + data.id + '. ' + data.question + '</label><br/>');

                    this.$('td input[type=text]')
                        .click(function() {
                            $(this).select();
                        })
                        .on('input',function() {
                            if ( $(this).val().length == $(this).attr('maxlength') )
                            {
                                $(this).parent().next().children('input').focus().select();
                            }
                        })
                        .keydown(function(e) {
                            if ((e.which == 8 || e.which == 46) && $(this).val() =='') 
                            {
                                $(this).parent().prev().children('input').focus();
                            }
                        });
                }

            });
        
        }
);

