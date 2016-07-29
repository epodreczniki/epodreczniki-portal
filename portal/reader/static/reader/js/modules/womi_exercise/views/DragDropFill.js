define(['_jquery',
        'underscore',
        'backbone',
        'EpoAuth',
        'text!../templates/drag_and_drop/fill_body.html',
        'text!../templates/drag_and_drop/fill_answers.html',
        'text!../templates/drag_and_drop/fill_answers_exit.html'
    ],

        function($, _, backbone, EpoAuth, fill_body, fill_answers, fill_answers_exit) {
        
            'user strict';

            return backbone.View.extend({
            
                className: 'drag-and-drop-fill',

                templateBody: _.template( fill_body ),

                templateAnswers: _.template( fill_answers ),

                templateExitAnwer:  _.template( fill_answers_exit ),

                initialize: function(options) {
                    this.options = options || {};
                    this.eventBus = this.options.eventBus;

                    this.body = this.options.body;
                    this.answers = this.options.answers;
                    this.readerApi = this.options.readerApi;
                    this.eventBus.on('checkExercise', this.checkExercise, this);
                    this.eventBus.on('saveState', this.saveState, this);
                },

                makeStructure: function() {
                    this.$el.append('<div class="exercise-body" />');
                    this.$el.append('<div class="separator" />');
                    this.$el.append('<div class="draggable-collection" />');

                    this.bodyDiv = this.$('.exercise-body');
                    this.dragsDiv = this.$('.draggable-collection');
                },

                checkExercise: function(e) {
                    e.preventDefault();

                    var answersState = this.checkAnswers();

                    this.readerApi.setUserVar("dragdropfill", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                    this.eventBus.trigger('getFeedback', answersState[0]);
                },

                render: function() {
                    this.$el.empty();

                    this.makeStructure();
                    
                    this.body.each(this.addBodyElement, this);
                    this.answers.each(this.addAnswersElement, this);

                    var drgProps = {
                        helper: 'clone',
                        revert: true
                    };
                    
                    this.$('.drop-placeholder').droppable({
                        tolerance: 'pointer',
                        drop: function( event, ui ) {
                            $(this).empty().addClass('filled');
                            var dragg = $(ui.draggable).clone().addClass('dragged-element');
                            $(this).append(dragg);
                            $(this).find('.draggable-element-background').removeClass('draggable-element-background')
                                .addClass('draggable-element-background-exit');
                            var _this = this;

                            $(this).find('.draggable-element-background-exit').on('click', function(ev){
                                ev.preventDefault();
                                $(_this).removeClass('filled');
                                dragg.remove();
                                return false;
                            });

                            ui.helper.remove();
                        }
                    });
                    
                    this.$('.draggable-element').draggable(drgProps);

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

                initExercise: function (state) {
                    var exerciseGaps = this.bodyDiv.children('.drop-placeholder');
                    var _this = this;
                    this.readerApi.getUserVar("dragdropfill", function(response) {
                        if (response.status == 'success') {
                            var dragdropfill = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                            if (dragdropfill !== null) {
                                if (dragdropfill.answer == "saveonly") {
                                    _.each(exerciseGaps, function (exerciseGap) {
                                        var gapId = $(exerciseGap).data('id');
                                        _.each(dragdropfill.value, function (dragItem) {
                                            if (dragItem.containerId == gapId) {
                                                if (dragItem.id != "no_id") {
                                                    var dropView = _this.templateExitAnwer( dragItem );
                                                    var dropViewEl = $(dropView);
                                                    $(exerciseGap).append(dropView);
                                                    $(exerciseGap).addClass('filled');
                                                    $(exerciseGap).find('.draggable-element-background-exit').on('click', function(ev){
                                                        ev.preventDefault();
                                                        $(exerciseGap).find('.draggable-element').remove();
                                                        $(exerciseGap).removeClass('filled');
                                                        return false;
                                                    });
                                                }
                                            }
                                        });

                                    });
                                } else if (dragdropfill.answer == "correct") {
                                    _this.eventBus.trigger('setMessage', "To zadanie zostało rozwiązane poprawnie.");
                                } else if (dragdropfill.answer == "incorrect") {
                                    _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                                }
                            }
                        }
                    });
                },

                checkAnswers: function (state) {
                    var exerciseGaps = this.bodyDiv.children('.drop-placeholder');
                    var numOfWrong = 0;

                    this.$('.draggable-element').removeClass('correct wrong');
                    $('.quiz-answer-incorrect-wcag').remove();
                    $('.quiz-answer-correct-wcag').remove();

                    var dragDropFill = [];

                    var correctWcag = $("<div>",{
                        class: "quiz-answer-correct-wcag wcag-hidden",
                        text: "Dobrze"
                    });

                    var incorrectWcag = $("<div>",{
                        class: "quiz-answer-incorrect-wcag wcag-hidden",
                        text: "Źle"
                    });

                    _.each(exerciseGaps, function(gap) {
                        var gapId = $(gap).data('id');

                        var fillElement = $(gap).children('.draggable-element');
                        var fillElementId = $(fillElement).data('id');

                        var correctArray = this.body.get(gapId).get('answersId');

                        var correct = _.contains(correctArray, fillElementId);

                        if (correct) {
                            if (state === undefined) {
                                $(fillElement).addClass('correct');
                                $(fillElement).prepend(correctWcag.clone());
                            }
                            dragDropFill.push({
                                id: fillElementId,
                                containerId: gapId,
                                content: fillElement.text().trim(),
                                correct: true
                            });
                        }
                        else {
                            if (state === undefined) {
                                $(fillElement).addClass('wrong');
                                $(fillElement).prepend(incorrectWcag.clone());
                            }
                            dragDropFill.push({
                                id: fillElementId ? fillElementId : "no_id",
                                containerId: gapId,
                                content: fillElement.text().trim(),
                                correct: false
                            });
                            numOfWrong += 1;
                        }
                    }, this);

                    var result = numOfWrong === 0;

                    var answer = '';
                    if (state === undefined) {
                        answer = result ? 'correct' : 'incorrect';
                    } else {
                        answer = "saveonly";
                    }

                    var dragDropFillState = {
                        answer: answer,
                        value:  dragDropFill
                    };

                    return [result, dragDropFillState];
                },

                addBodyElement: function(model) {
                    var newView = this.templateBody( model.toJSON() );

                    this.bodyDiv.append(newView);
                },

                addAnswersElement: function(model) {
                    var newView = this.templateAnswers( model.toJSON() );
                    this.dragsDiv.append(newView);
                },

                saveState: function(e){
                    e.preventDefault();

                    var answersState = this.checkAnswers("saveonly");

                    this.readerApi.setUserVar("dragdropfill", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                }

            });
        
        }
);
