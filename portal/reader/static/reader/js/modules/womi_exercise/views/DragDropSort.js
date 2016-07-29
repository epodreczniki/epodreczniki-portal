define(['_jquery',
        'underscore',
        'backbone',
        'EpoAuth',
         '../../core/Registry',
        'text!../templates/drag_and_drop/sortable.html'],

        function($, _, backbone, EpoAuth, Registry, sortable) {

            'use strict';

            $.fn.swap = function(b){
                b = jQuery(b)[0];
                var a = this[0];
                var t = a.parentNode.insertBefore(document.createTextNode(''), a);
                b.parentNode.insertBefore(a, b);
                t.parentNode.insertBefore(b, t);
                t.parentNode.removeChild(t);
                return this;
            };

            return Backbone.View.extend({

                templateSortable: _.template( sortable ),
                
                initialize: function(options) {
                    this.options = options || {};
                    this.eventBus = this.options.eventBus;

                    this.sortable = this.options.sortable;
                    this.correctOrder = this.options.correctOrder;
                    this.readerApi = this.options.readerApi;

                    console.log(this.options.type);

                    this.eventBus.on('checkExercise', this.checkExercise, this);
                    this.eventBus.on('saveState', this.saveState, this);

                    if(Registry.get('layout')){
                        Registry.get('layout').on('windowResize', this.onResize, this);
                        Registry.get('layout').on('selectedPage', this.onResize, this);
                    }
                },

                className: 'drag-and-drop-sortable',

                checkExercise: function(e) {
                    e.preventDefault();

                    var answersState = this.checkAnswers();

                    this.readerApi.setUserVar("dragdropsort", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                    this.eventBus.trigger('getFeedback', answersState[0]);
                },

                checkAnswers: function(state) {
                    var sortedIDs = [],
                        wrong = 0;
                    sortedIDs = this.sortableDiv.sortable( "toArray", {attribute: "data-id" } );
                    var dragDropSort = [];
                    var that = this;

                    var correctWcag = $("<div>",{
                        class: "quiz-answer-correct-wcag wcag-hidden",
                        text: "Dobrze"
                    });

                    var incorrectWcag = $("<div>",{
                        class: "quiz-answer-incorrect-wcag wcag-hidden",
                        text: "Źle"
                    });

                    this.sortableDiv.children().each(function(index, element) {
                        $(element).removeClass('correct wrong');
                        $(element).find('.quiz-answer-correct-wcag').remove();
                        $(element).find('.quiz-answer-incorrect-wcag').remove();

                        var content;
                        var sortedId = sortedIDs[index];
                        _.each(that.sortable.models, function(model){
                            if(model.get('id') == sortedId){
                                content = model.get('content');
                            }
                        });
                        if (sortedId === that.correctOrder[index]) {
                            if (state === undefined) {
                                $(element).addClass('correct');
                                $(element).prepend(correctWcag.clone());
                            }
                            dragDropSort.push({
                                id: sortedId,
                                index: index,
                                content: content,
                                correct: true
                            });
                        } else {
                            if (state === undefined) {
                                $(element).addClass('wrong');
                                $(element).prepend(incorrectWcag.clone());
                            }
                            dragDropSort.push({
                                id: sortedId,
                                index: index,
                                content: content,
                                correct: false
                            });
                            wrong += 1;
                        }

                    });

                    var result = wrong === 0;

                    var answer = '';
                    if (state === undefined) {
                        answer = result ? 'correct' : 'incorrect';
                    } else {
                        answer = "saveonly";
                    }

                    var dragDropSortState = {
                        answer: answer,
                        value:  dragDropSort
                    };

                    return [result, dragDropSortState];
                },

                render: function() {
                    this.$el.empty();

                    var _this = this;

                    this.sortableDiv = $('<div/>', {
                        class: function() {
                            return 'sortable-container ' + (_this.options.type === 'DGS-1' ? 'horizontal' : 'vertical')
                        }
                    });

                    this.$el.append(this.sortableDiv);

                    this.sortable.each(this.addSortableElement, this);

                    this.startDragDrop();

                    this.initExercise();

//                    this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function(data){
//                        setTimeout(function(){
//                            _this.eventBus.trigger('showSaveState');
//                        }, 50);
//                    });
//                    EpoAuth.ping();

                    if(Registry.get('layout')){
                        if (this.$el.find("math, .MathJax").length) {
                            Registry.get('layout').trigger('refreshContent', this.$el, {
                                callback: function(){
                                    _this.afterRender();
                                },
                                typeset: true});
                        }
                    }

                    this.afterRender();

                    return this;
                },

                afterRender: function() {
                    setTimeout(function() {
                        var $elements = this.$el.find('.sortable-element');
                        $elements.removeAttr('style');
                        var width = $.makeArray($elements).map(function(obj) {
                            return $(obj).outerWidth();
                        });
                        $elements.css('width', _.max(width));

                        $elements.find("math, .MathJax").length > 0 ? $elements.find(".wrapper").css({"margin-top": "10%"}) : '';

                        var _this = this;
                        this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function(data){
                            setTimeout(function(){
                                _this.eventBus.trigger('showSaveState');
                            }, 50);
                        });
                        EpoAuth.ping();
                    }.bind(this), 0);
                },

                onResize: function() {
                    this.afterRender();
                },

                initExercise: function() {
                    var _this = this;
                    this.readerApi.getUserVar("dragdropsort", function(response) {
                        if (response.status == 'success') {
                            var dragdropsort = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                            if (dragdropsort !== null) {
                                if (dragdropsort.answer == "saveonly") {
                                    var unsortedItems = [];
                                    _this.sortableDiv.children().each(function(index, element) {
                                        _.each(dragdropsort.value, function (dragItem) {
                                            if(dragItem.id == $(element).data("id")){
                                                unsortedItems.push(dragItem);
                                            }
                                        })
                                    });
                                    unsortedItems.sort(function(a, b){
                                        return a.index - b.index;
                                    });
                                    _this.sortableDiv.empty();
                                    _.each(unsortedItems, function(item){
                                        var newView = $(_this.templateSortable(item));
                                        newView.find('.content').append(item.content);
                                        _this.sortableDiv.append(newView);
                                    });
                                } else if (dragdropsort.answer == "correct") {
                                    _this.eventBus.trigger('setMessage', "To zadanie zostało rozwiązane poprawnie.");
                                } else if (dragdropsort.answer == "incorrect") {
                                    _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                                }
                            }
                        }
                    });
                },

                addSortableElement: function(model) {
                    var modelJSON = model.toJSON();

                    var newView = $(this.templateSortable(modelJSON));

                    newView.find('.content').append(model.attributes.content);

                    this.sortableDiv.append(newView);
                },

                startDragDrop: function() {
                    this.sortableDiv.sortable({
                        scroll: false,
                        tolerance: 'pointer',
                        placeholder: 'sortable-placeholder',
                        start: function(e, ui) {
                            ui.placeholder.height(ui.item.height());
                            ui.placeholder.width(ui.item.width());
                        }
                    });
                    this.sortableDiv.disableSelection();
                },

                saveState: function(e){
                    e.preventDefault();

                    var answersState = this.checkAnswers("saveonly");

                    this.readerApi.setUserVar("dragdropsort", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                }
                
            });

        }
);
