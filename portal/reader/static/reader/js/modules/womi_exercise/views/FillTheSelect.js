define(['_jquery',
        'underscore',
        'backbone',
        '../views/FillTheGap',
        'text!../templates/select_field.html'], 

        function($, _, backbone, FillTheGapView, body_template) {

            'use strict';

            return FillTheGapView.extend({

                templateBody: _.template(body_template),

                initExercise: function() {
                    var list = this.$('.answer');
                    var _this = this;
                    this.readerApi.getUserVar("fillthegapselect", function(response){
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
                                }else if (fillthegap.answer == "incorrect") {
                                    _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                                }

                            }
                        }
                    });

                },

                saveAnswer: function(fillTheGap) {
                    this.readerApi.setUserVar("fillthegapselect", JSON.stringify(fillTheGap), function(status){
//                        console.log(status);
                    });
                },

                saveState: function(e){
                    e.preventDefault();

                    var answersState = this.checkAnswers("saveonly");

                    this.readerApi.setUserVar("fillthegapselect", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                },
                
                addOne: function(model) {
                    var answersId = model.get('answersId');
                    if (this.options.random) {
                        answersId = _.shuffle(answersId);
                    }; 

                    var that = this;
                    var newView = this.templateBody({
                        preInputText: model.get('preInputText'),
                        postInputText: model.get('postInputText'),
                        lineBreak: model.get('lineBreak'),
                        questionId: model.get('id'),
                        placeholder: model.get('placeholder') ? model.get('placeholder') : "Wybierz odpowiedź",
                        answersId: answersId,
                        value: function(id) { return that.answers.get(id).get('content') }
                    });
                    this.$el.append(newView);
                }

                
            });

        }
);
