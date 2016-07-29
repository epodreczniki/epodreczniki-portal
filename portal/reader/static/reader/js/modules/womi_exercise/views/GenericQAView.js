define(['_jquery',
        'backbone',
        'EpoAuth'],
        
        function($, Backbone, EpoAuth) {

            'use strict';
    
            return Backbone.View.extend({
                
                tagName: 'ul',
                
                className: 'answer-list',
                
                events: {
                    'change input.answer': 'clean'
                },
        
                initialize: function(options) {
                    this.options = options || {};
                    this.eventBus = this.options.eventBus;

                    this.getFiltered();
                    
                    this.eventBus.on('checkExercise', this.checkExercise, this);
                    this.eventBus.on('recreate', this.recreate, this);
                    this.eventBus.on('saveState', this.saveState, this);

                    this.readerApi = this.options.readerApi;
                },

                initExercise: function () {
                    var _this = this;
                    this.readerApi.getUserVar("single", function(response){
                        if(response.status == 'success') {
                            var single = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                            if (single !== null) {
                                if(single.answer == "saveonly") {
                                    _this.$("[data-id='"+single.value+"']").attr('checked', 'checked');
                                }else{
                                    var message = "";
                                    var chosen = _this.collection.get(single.value);
                                    var isCorrect = chosen.get("correct");
                                    if(isCorrect){
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
        
                getFiltered: function() {
                    this.filtered = this.collection.generateCollection();
                },
                
                checkExercise: function(e) {
                    e.preventDefault();

                    var answersState = this._checkAnswers();

                    this.readerApi.setUserVar("single", JSON.stringify(answersState[1]), function(status){
//                            console.log(status);
                    });

                    this.eventBus.trigger('getFeedback', answersState[0], answersState[2]);

                },

                _checkAnswers: function(state) {
                    var el = this.$('input:checked'),
                        id = el.data("id"),
                        hint;

                    this.chosen = this.collection.get(id);

                    if (!this.chosen) return;

                    this.clean();

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

                    var isCorrect = this.chosen.get("correct");

                    if (!isCorrect) {
                        if (state === undefined) {
                            hint = this.chosen.get("hint");
                            el.parents('li').addClass('wrong-answer');
                            el.parents('li').prepend(incorrectEl.clone());
                            el.parents('li').prepend(incorrectWcag.clone());
                        }
                    } else {
                        if (state === undefined) {
                            el.parents('li').addClass('correct-answer');
                            el.parents('li').prepend(correctEl.clone());
                            el.parents('li').prepend(correctWcag.clone());
                        }
                    }
                    var singleAnswer = id;

                    var answer = '';
                    if (state === undefined) {
                        answer = isCorrect ? 'correct' : 'incorrect';
                    } else {
                        answer = "saveonly";
                    }

                    var singleAnswerState = {
                        answer: answer,
                        value:  singleAnswer
                    };

                    return [isCorrect, singleAnswerState, hint];
                },

                saveState: function() {
                     var answersState = this._checkAnswers("saveonly");

                    this.readerApi.setUserVar("single", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });
                },
                
                clean: function() {
                    this.$('li').removeClass('wrong-answer correct-answer');
                    if(this.$('li').find('.quiz-answer-correct').length > 0){
                        this.$('li').find('.quiz-answer-correct').remove();
                        this.$('li').find('.quiz-answer-correct-wcag').remove();
                    }
                    if(this.$('li').find('.quiz-answer-incorrect').length > 0){
                        this.$('li').find('.quiz-answer-incorrect').remove();
                        this.$('li').find('.quiz-answer-incorrect-wcag').remove();
                    }
                    this.eventBus.trigger('cleanupFeedback');
                },
        
                recreate: function() {
                    this.clean();
                    this.$el.empty();
                    this.$el.find('input[type=checkbox]:checked').removeAttr('checked');
                    this.getFiltered();
                    this.filtered.each(this.addOne, this);
                    var _this = this;
                    this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function(data){
                        setTimeout(function(){
                            _this.eventBus.trigger('showSaveState');
                        }, 50);
                    });
                    EpoAuth.ping();
                    return this;
                },
                
                render: function() {
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
                }
            
        });
});
