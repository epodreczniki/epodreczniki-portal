define(['_jquery',
        'underscore',
        'EpoAuth',
        '../views/Generic',
        '../views/DGT1/DragAndDropMethods',
        'text!../templates/drag_and_drop/table_droppable.html',
        'text!../templates/drag_and_drop/table_draggable.html'],

        function($, _, EpoAuth, Generic, DGMethods, table_droppable, table_draggable) {

            'use strict';

            return Generic.extend({
                
                className: 'drag-and-drop-table',
                
                templateDroppable: _.template( table_droppable ),
                
                templateDraggable: _.template( table_draggable ),
                
                postInitialize: function(options) {

                    this.draggable = this.options.draggable;

                    this.droppable = this.options.droppable;     

                    this.multipleAnswerUsage = this.options.config.multipleAnswerUsage;

                },

                initExercise: function() {
                    var answeredLists = this.$('.droppable-element');
                    var _this = this;

                    this.readerApi.getUserVar("dragdroptable", function(response) {
                        if (response.status == 'success') {
                            var dragdroptable = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                            if (dragdroptable !== null) {
                                if (dragdroptable.answer == "saveonly") {
                                _.each(answeredLists, function (answerContainer) {
                                    var dropId = $(answerContainer).data('id');
                                    _.each(dragdroptable.value, function (item) {
                                        if (item.containerId == dropId) {
                                            var dropView = _this.templateDraggable( item );
                                            var tempView = $('<span>');
                                            tempView.append(dropView);
                                            tempView.find(".content").append(item.content);
                                            var draggable = tempView.find('.draggable-element');
                                            $(answerContainer).append(draggable);
                                            draggable.draggable(_this.drgProps);
                                            _this.$('.draggable-collection .draggable-element').filter("[data-id='"+item.id+"']").remove();
                                        }
                                    });

                                });
                                } else if (dragdroptable.answer == "correct") {
                                    _this.eventBus.trigger('setMessage', "To zadanie zostało rozwiązane poprawnie.");
                                } else if (dragdroptable.answer == "incorrect") {
                                    _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                                }
                            }
                        }
                    });

                },
                
                makeStructure: function() {
                    this.$el.append('<div class="droppable-collection" />');
                    this.$el.append('<div class="separator" />');
                    this.$el.append('<div class="draggable-collection" />');
                    
                    this.dropsDiv = this.$('.droppable-collection');
                    this.dragsDiv = this.$('.draggable-collection');
                },
                
                checkExercise: function(e) {
                    e.preventDefault();

                    var answersState = this.checkAnswers();

                    this.readerApi.setUserVar("dragdroptable", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });
                    
                    this.eventBus.trigger('getFeedback', answersState[0]);
                },

                checkAnswers: function(state){
                    var answeredLists = this.$('.droppable-element'),
                        numOfCorrect = 0,
                        numOfIncorrect = 0,
                        numberOfAnswers = 0;

                    var correctWcag = $("<div>",{
                        class: "quiz-answer-correct-wcag wcag-hidden",
                        text: "Dobrze"
                    });

                    var incorrectWcag = $("<div>",{
                        class: "quiz-answer-incorrect-wcag wcag-hidden",
                        text: "Źle"
                    });

                    this.$('.draggable-element').removeClass('correct wrong');
                    $('.quiz-answer-incorrect-wcag').remove();
                    $('.quiz-answer-correct-wcag').remove();

                    var dragDropTable = [];


                    _.each(answeredLists, function(dropDiv) {
                        var dropId = $(dropDiv).data('id');
                        var droppedElements = $(dropDiv).find('.draggable-element');
                        _.each(droppedElements, function(dropped) {
                            var dropedItem = $(dropped).data('id');
                            var dropContent = $(dropped).find('.content').html();
                            var correct = _.contains(this.droppable.get(dropId).get('correctDrg'), dropedItem);
                            if (!correct) {
                                if (state === undefined) {
                                    $(dropped).addClass('wrong');
                                    $(dropped).prepend(incorrectWcag.clone());
                                }
                                numOfIncorrect += 1;
                                dragDropTable.push({
                                    id: dropedItem,
                                    containerId: dropId,
                                    content: dropContent,
                                    correct: false
                                });
                            } else {
                                if (state === undefined) {
                                    $(dropped).addClass('correct');
                                    $(dropped).prepend(correctWcag.clone());
                                }
                                numOfCorrect += 1;
                                dragDropTable.push({
                                    id: dropedItem,
                                    containerId: dropId,
                                    content: dropContent,
                                    correct: true
                                });
                            }

                        }, this);

                        numberOfAnswers += this.droppable.get(dropId).get('correctDrg').length;

                    }, this);

//                    this.$('.draggable-collection .draggable-element').addClass('wrong');
//                    var result = numOfCorrect === this.draggable.size();

                    var result = ((numberOfAnswers == numOfCorrect) && (numOfIncorrect == 0)) ? true : false;

                    var answer = '';
                    if (state === undefined) {
                        answer = result ? 'correct' : 'incorrect';
                    } else {
                        answer = "saveonly";
                    }

                    var dragDropTableState = {
                        answer: answer,
                        value:  dragDropTable
                    };

                    return [result, dragDropTableState];
                },

                render: function() {
                    this.$el.empty();
                    
                    this.makeStructure();
                    
                    this.droppable.each(this.addDroppableElement, this);
                    
                    this.draggable.each(this.addDraggableElement, this);

                    this.startDragDrop();

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
                
                addDroppableElement: function(model) {
                    var modelJSON = model.toJSON();

                    var newView = this.templateDroppable( modelJSON );

                    var tempView = $('<span>');

                    tempView.append(newView);

                    tempView.find(".content").append(model.attributes.content);

                    // Need to made this one method, which creates exercise independent of template.
                    this.dropsDiv.append(tempView.find('.droppable-element'));
                },
                
                addDraggableElement: function(model) {
                    var modelJSON = model.toJSON();

                    var newView = this.templateDraggable( modelJSON );

                    var tempView = $('<span>');

                    tempView.append(newView);

                    tempView.find(".content").append(model.attributes.content);

                    this.dragsDiv.append(tempView.find('.draggable-element'));

                },

                startDragDrop: function() {
                    // Other views overwrite this function.
                    this.drgProps = {
                        helper: 'clone',
                        revert: true
                    };
                    
                    var that = this;

                    var type = !this.multipleAnswerUsage ? "single" : "multiple";

                    console.log(type);

                    DGMethods[type + 'Answer'].call(this);
                    
                    this.$('.draggable-element').draggable(this.drgProps);
                    
                },

                saveState: function(e){
                    e.preventDefault();

                    var answersState = this.checkAnswers("saveonly");

                    this.readerApi.setUserVar("dragdroptable", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                }

            });

        }
);
