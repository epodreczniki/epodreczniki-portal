define(['jquery',
        'underscore',
        'backbone',
        'EpoAuth',
        '../utils/Numbers',
        'text!../templates/text_field.html', 'device_detection'],

        function($, _, backbone, EpoAuth, numTools, body_template, deviceDetection) {

            'use strict';

            return Backbone.View.extend({

                tagName: 'p',

                templateBody: _.template(body_template),

                events: {
                    'keyup input.answer': 'clean'
                },

                initialize: function(options) {
                    this.options = options || {};
                    this.eventBus = this.options.eventBus;

                    this.body = this.options.body;
                    this.answers = this.options.answers;

                    this.answerType = this.options.answerType;

                    this.options.eventBus.on('checkExercise', this.answerCheck , this);
                    this.options.eventBus.on('saveState', this.saveState, this);

                    this.differentAnswers = this.options.differentAnswers;
                    console.log("UT - differentAnswers: ", this.differentAnswers);

                    this.readerApi = this.options.readerApi;
                },

                initExercise: function() {
                    var list = this.$('.answer');
                    var _this = this;
                    this.readerApi.getUserVar("fillthegap", function(response){
                        if(response.status == 'success') {
                            var fillthegap = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                            if (fillthegap !== null) {
                                if (fillthegap.answer == "saveonly") {
                                    _.each(list, function (row, idx) {
                                        var rowId = _this.$(row).data('id');
                                        _.each(fillthegap.value, function (item) {
                                            if (item.modelId == rowId) {
                                                _this.$(row).val(item.answer);
                                            }
                                        });
                                    });
                                } else if (fillthegap.answer == "correct") {
                                    _this.eventBus.trigger('setMessage', "To zadanie zostało rozwiązane poprawnie.");
                                } else if (fillthegap.answer == "incorrect") {
                                    _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                                }
                            }
                        }
                    });

                },

                answerCheck: function(e) {
                    e.preventDefault();

                    var answersState = this.checkAnswers();
                    this.saveAnswer(answersState[1]);

                    this.eventBus.trigger('getFeedback', answersState[0]);

                },

                saveAnswer: function(fillTheGap) {
                    this.readerApi.setUserVar("fillthegap", JSON.stringify(fillTheGap), function(status){
//                        console.log(status);
                    });
                },

                clean: function() {
                    this.eventBus.trigger('cleanupFeedback');
                    this.$('.answer').removeClass('wrong-answer correct-answer');
                    this.$('.quiz-answer-incorrect-wcag').remove();
                    this.$('.quiz-answer-correct-wcag').remove();
                },

                render: function() {
                    this.body.each(this.addOne, this);

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

                checkAnswers: function(state){
                     var list = this.$('.answer'),
                        numOfInput = list.length,
                        numOfCorrect = 0,
                        uniqueDuplicates,
                        result;

                    this.clean();

                    var fillTheGap = [];

                    var values = [];

                    var _this = this;

                    var incorrectWcag = $("<div>",{
                        class: "quiz-answer-incorrect-wcag wcag-hidden",
                        text: "Źle"
                    });

                    var correctWcag = $("<div>",{
                        class: "quiz-answer-correct-wcag wcag-hidden",
                        text: "Dobrze"
                    });

                    if(this.differentAnswers){
                        _.each(list, function(element) {
                            var el = $(element),
                                value = el.val();
                            values.push(value);
                        });
                        var sorted_arr = values.sort();
                        var results = [];
                        for (var i = 0; i < values.length - 1; i++) {
                            if (sorted_arr[i + 1] == sorted_arr[i]) {
                                results.push(sorted_arr[i]);
                            }
                        }
                        uniqueDuplicates = _.uniq(results);
                    }

                    _.each(list, function(element) {
                        var el = $(element),
                            value = el.val(),
                            id =  el.data('id'),
                            model = this.body.get(id),
                            answerContent;

                        var isCorrect = _.some(model.get('answersId'), function(id) {
                            var answerObj = this.answers.get(id);
                            answerContent = answerObj.get('content');

                            if (!this.options.strictMode) {
                                value = value.toLowerCase();
                                answerContent = answerContent.toLowerCase();
                            };

                            if (this.options.numericVal || answerObj.get('numericVal')) {
                                //value = parseFloat(value.replace(/,/g, "."));
                                //answerContent = parseFloat(answerContent.replace(/,/g, "."));
                                value = numTools.stringToFloat(value);
                                answerContent = numTools.stringToFloat(answerContent);
                            };
                            return answerContent === value && answerObj.get('correct');
                        }, this);

                        if (isCorrect) {
                            if(_this.differentAnswers) {
                                if (uniqueDuplicates.indexOf(value) == -1) {
                                    numOfCorrect += 1;
                                    if (state === undefined) {
                                        el.addClass('correct-answer');
                                    }
                                    fillTheGap.push({
                                        modelId: id,
                                        answer: answerContent,
                                        correct: true
                                    });
                                } else {
                                    if (state === undefined) {
                                        el.addClass('wrong-answer');
                                    }
                                    fillTheGap.push({
                                        modelId: id,
                                        answer: value,
                                        correct: false
                                    });
                                }
                            }else{
                                numOfCorrect += 1;
                                if (state === undefined) {
                                    el.addClass('correct-answer');
                                    el.after(correctWcag.clone());
                                }
                                fillTheGap.push({
                                    modelId: id,
                                    answer: answerContent,
                                    correct: true
                                });
                            }
                        } else {
                            if (state === undefined) {
                                el.addClass('wrong-answer');
                                el.after(incorrectWcag.clone());
                            }
                            fillTheGap.push({
                                modelId: id,
                                answer: value,
                                correct: false
                            });
                        }
                    }, this);

                    result = numOfCorrect === numOfInput;

                    var answer = '';
                    if (state === undefined) {
                        answer = result ? 'correct' : 'incorrect';
                    } else {
                        answer = "saveonly";
                    }

                    var fillTheGapState = {
                        answer: answer,
                        value:  fillTheGap
                    };
                    return [result, fillTheGapState];
                },

                saveState: function(e){
                    e.preventDefault();

                    var answersState = this.checkAnswers("saveonly");

                    this.readerApi.setUserVar("fillthegap", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                },

                addOne: function(model) {
                    var _this = this;
                    var newView = this.templateBody( model.toJSON() );
                    this.$el.append(newView);

                    if (this.answerType !== undefined) {
                        switch (this.answerType) {
                            case "digits":
                                if (deviceDetection.isMobile) {
                                    // TODO: for mobiles add validation after entering value i.e. focusout
                                } else {
                                    if(model.toJSON().type !== undefined){
                                        this._validateModel(model);
                                    }else{
                                        this._validateDigits(model.toJSON().id);
                                    }
                                }
                                break;
                            case "letters":
                                 if (deviceDetection.isMobile) {
                                     // TODO: for mobiles add validation after entering value i.e. focusout
                                 } else {
                                     if(model.toJSON().type !== undefined){
                                        this._validateModel(model);
                                    }else{
                                        this._validateLetters(model.toJSON().id);
                                    }
                                 }
                                break;
                            case "all":
                                break;
                        }
                    }
                },

                _validateModel: function(model) {
                    switch (model.toJSON().type.toLowerCase()) {
                        case "digits":
                            this._validateDigits(model.toJSON().id);
                            break;
                        case "letters":
                            this._validateLetters(model.toJSON().id);
                            break;
                        case "all":
                            break;
                    }
                },

                _validateDigits: function(modelId){
                    var _this = this;
                    this.$el.find("[data-id='"+modelId+"']").on("keydown", function (e) {
                        e.stopPropagation();
                        var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                        if (keyCode != 8 && keyCode != 0 && ((keyCode < 48 || keyCode > 57) || (keyCode >= 96 && keyCode <= 105))) {
                            // _this.$el.find("[data-errormsg-id='"+model.toJSON().id+"']").html("Tylko liczby").show().fadeOut("slow");
                            var errorElement = _this.$el.find("[data-errormsg-id='"+modelId+"']");
                            errorElement.html("Tylko&nbspliczby").fadeTo("slow", 1, function() {
                                errorElement.fadeOut("slow");
                            });
                            return false;
                        }
                    });
                },

                _validateLetters: function(modelId){
                    var _this = this;
                    this.$el.find("[data-id='"+modelId+"']").on("keydown", function (e) {
                        e.stopPropagation();
                        var keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
                        if((keyCode > 47 && keyCode < 58) && (keyCode != 32)){
//                                        _this.$el.find("[data-errormsg-id='"+model.toJSON().id+"']").html("Litery !").show().fadeOut("slow");
                            var errorElement = _this.$el.find("[data-errormsg-id='"+modelId+"']");
                            errorElement.html("Tylko&nbsplitery").fadeTo("slow", 1, function() {
                                errorElement.fadeOut("slow");
                            });
                            return false;
                        }
                    });
                }


            });

        }
);
