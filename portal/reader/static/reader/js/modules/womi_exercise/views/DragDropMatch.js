define(['jquery',
        'underscore',
        '../../core/Registry',
        '../views/Generic',
        'EpoAuth',
        'text!../templates/drag_and_drop/table_droppable.html',
        'text!../templates/drag_and_drop/table_draggable.html'],

        function($, _, Registry, Generic, EpoAuth, table_droppable, table_draggable) {

            'use strict';

            return Generic.extend({

                postInitialize: function(options) {

                    this.backgroundLoaded = this.options.background;
                    this.body = this.options.body;
                    this.answers = this.options.answers;
                    
                    this.backgroundSize = {};

                    this.multipleAnswerUsage = this.options.config.multipleAnswerUsage;

                    this.differentAnswers = this.options.config.differentAnswers;

                    this.locationOfAnswers = this.options.config.locationOfAnswers;

                    var _this = this;

                    this.draggableOpts = {
                        helper: 'clone',
                        revert: true,
                        start: function(event, ui) {
                            _this.answers.get($(this).data('id')).set('source', $(this).parent('.answer-container'));
                        }
                    };

                    this.on('resize', function(){

                        this.backgroundSize = {
                            width: this.$('.image-inside-exercise').width(),
                            height: this.$('.image-inside-exercise').height()
                        };

                        this.exerciseMap.css({
                            width: this.backgroundSize.width,
                            height: this.backgroundSize.height
                        });

                        if(this.locationOfAnswers != "bottom") {
                            this.exerciseAnswersElement.css('height', this.backgroundSize.height);
                        }

                        this.$('.point').each(function(){
                            var model = _this.body.get($(this).data('id'));
                            model.calcCurrentPosition(_this.backgroundSize);

                            var modelJSON = model.toJSON();

                            $(this).css({
                                top: modelJSON.currentPosition.top,
                                left: modelJSON.currentPosition.left
                            });

                        });

                    });

                    this.initExercise();

                    if(Registry.get('layout')){
                        Registry.get('layout').on('selectedPage', function () {
                            _this.$el.empty();
                            _this.render();
                        }, _this);
                    }
                },
                
                className: 'drag-and-drop-match',
                
                templateDroppable: _.template( table_droppable ),
                
                templateDraggable: _.template( table_draggable ),

                checkExercise: function(e) {

                    e.preventDefault();

                    var answersState = this.checkAnswers();

                    this.readerApi.setUserVar("dragdropmatch", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                    this.eventBus.trigger('clearButton');

                    this.eventBus.trigger('getFeedback', answersState[0]);

                },
                
                render: function() {

                    this.$el.empty();
                    
                    var _this = this;

                    var exerciseBackgroundElement = $('<div>', {
                        class: 'exercise-background'
                    });

                    this.exerciseAnswersElement = $('<div>', {
                        class: 'exercise-answers'
                    });

                    this.exerciseMap = $('<div>', {
                        class: 'exercise-map'
                    });

                    this.backgroundLoaded(function(images) {

                        exerciseBackgroundElement.append(_.map(images, function (o) {
                            return o.elem
                        }));

                        _this.backgroundSize = {
                            width: images[0].img.width(),
                            height: images[0].img.height()
                        };

                        _this.exerciseMap.css({
                            'width': _this.backgroundSize.width,
                            'height': _this.backgroundSize.height
                        }).appendTo(exerciseBackgroundElement);

                        _this.body.each(_this.addPoint, _this);

                        if(_this.locationOfAnswers != "bottom"){
                            _this.exerciseAnswersElement.css('height', images[0].img.height());
                        }

                    });

                    this.$el.append([exerciseBackgroundElement, this.exerciseAnswersElement]);

                    if(this.locationOfAnswers == "bottom"){
                        exerciseBackgroundElement.css("float", "none");
                        this.exerciseAnswersElement.css('height', "auto");
                        this.exerciseAnswersElement.css('width', "auto");
                    }

                    this.exerciseAnswersElement.droppable({
                        drop: function(event, ui) {
                            if ($(ui.draggable).hasClass('multi')) {
                                $(ui.draggable).remove();

                            } else {
                                $(ui.draggable).removeAttr('style data-correct')
                                    .appendTo(this);
                            }
                            ui.helper.remove();
                        }
                    });

                    this.answers.each(this.addAnswer, this);

                    this.listenToOnce(EpoAuth, EpoAuth.POSITIVE_PING, function(data){
                        setTimeout(function(){
                            _this.eventBus.trigger('showSaveState');
                        }, 50);
                    });
                    EpoAuth.ping();
                    
                    return this;
                },

                initExercise: function(){
                    var _this = this;

                    this.readerApi.getUserVar("dragdropmatch", function(response) {
                        if (response.status == 'success') {
                            var dragdropmatch = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                            if (dragdropmatch !== null) {
                                setTimeout(function(){
                                if (dragdropmatch.answer == "saveonly") {
                                    var answerAreas = _this.exerciseMap.find('.answer-container');
                                    _.each(answerAreas, function(answerArea) {
                                        var answerId = $(answerArea).data("id");
                                        _.each(dragdropmatch.value, function (dragItem) {
                                            if(dragItem.question == answerId){
                                                if (dragItem.id != "no_answer") {
                                                    var answer = $('<div>', { class: 'answer-element',
                                                        attr : { 'data-id': dragItem.id } });
                                                    var answerBackground = $('<div>', {class: 'answer-element-background'});
                                                    var answerContent = $('<div>', {class: 'answer-element-content', html: dragItem.content});
                                                    answer.append(answerBackground);
                                                    answer.append(answerContent);
                                                    answer.draggable(_this.draggableOpts);
                                                    var model = _this.body.get(dragItem.question);
                                                    answer.appendTo( $(answerArea) ).css('background', model.get('color'));
                                                     if (!_this.multipleAnswerUsage) {
                                                        _this.$('.exercise-answers .answer-element').filter("[data-id='"+dragItem.id+"']").remove();
                                                     }

                                                }
                                            }
                                        });

                                    });

                                } else if (dragdropmatch.answer == "correct") {
                                    _this.eventBus.trigger('setMessage', "To zadanie zostało rozwiązane poprawnie.");
                                } else if (dragdropmatch.answer == "incorrect") {
                                    _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                                }
                                },50);
                            }
                        }
                    });
                },

                saveState: function(e){
                    e.preventDefault();

                    var answersState = this.checkAnswers("saveonly");

                    this.readerApi.setUserVar("dragdropmatch", JSON.stringify(answersState[1]), function(status){
//                        console.log(status);
                    });

                },

                checkAnswers: function (state) {
                    var answerAreas = this.exerciseMap.find('.answer-container'),
                        list = this.$('.exercise-background .answer-element-content'),
                        numOfCorrect = 0,
                        numOfInput = list.length,
                        uniqueDuplicates = [],
                        result;

                    var _this = this;

                    var dragDropMatch = [];

                    var values = [];

                    var correctWcag = $("<div>",{
                        class: "quiz-answer-correct-wcag wcag-hidden",
                        text: "Dobrze"
                    });

                    var incorrectWcag = $("<div>",{
                        class: "quiz-answer-incorrect-wcag wcag-hidden",
                        text: "Źle"
                    });

                    if(this.differentAnswers){
                        _.each(list, function(element) {
                            var el = $(element),
                                value = el.html();
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


                    answerAreas.each(function() {
                        $(this).find('.quiz-answer-incorrect-wcag').remove();
                        $(this).find('.quiz-answer-correct-wcag').remove();
                        if ($(this).children().length > 0) {
                            var qID = $(this).data('id'),
                                aID = $(this).children().data('id'),
                                content = $(this).find(".answer-element-content").html();

                            if ((_this.body.get(qID).get('correct') == aID || $.inArray(aID, _this.body.get(qID).get('correct')) > -1) && $.inArray(content, uniqueDuplicates) < 0) {
                                numOfCorrect += 1;
                                if (state === undefined) {
                                    $(this).children().attr('data-correct', 'correct');
                                    $(this).prepend(correctWcag.clone());
                                }
                                dragDropMatch.push({
                                    id: aID,
                                    question: qID,
                                    content: content,
                                    correct: true
                                });

                            } else {
                                if (state === undefined) {
                                    $(this).children().attr('data-correct', 'incorrect');
                                    $(this).prepend(incorrectWcag.clone());
                                }
                                dragDropMatch.push({
                                    id: aID,
                                    question: qID,
                                    content: content,
                                    correct: false
                                });
                            }

                        } else {
                            if (state === undefined) {
                                $(this).attr('data-correct', 'incomplete');
                            }
                            var question = $(this).data('id');
                            dragDropMatch.push({
                                id: "no_answer",
                                question: question,
                                content: "no_content",
                                correct: false
                            });
                        }

                    });

                    var result = numOfCorrect === this.body.size();

                    var answer = '';
                    if (state === undefined) {
                        answer = result ? 'correct' : 'incorrect';
                    } else {
                        answer = "saveonly";
                    }

                    var dragDropMatchState = {
                        answer: answer,
                        value:  dragDropMatch
                    };

                    return [result, dragDropMatchState];
                },

                addPoint: function(model) {

                    model.calcCurrentPosition(this.backgroundSize);

                    var model = model.toJSON(),
                        _this = this;

                    var point = $('<div>', {
                        class: 'point',
                        css: {
                            'background': model.color,
                            'top': model.currentPosition.top,
                            'left': model.currentPosition.left 
                        },
                        attr: {
                            'data-id': model.id
                        }
                    });

                    var container = $('<div>', {
                        class: 'answer-container',
                        css: {
                            'border-color': model.color
                        },
                        attr: {
                            'data-id': model.id
                        }
                    });

                    container.addClass(function() {
                        return (_this.backgroundSize['width'] - (model.currentPosition.left + 100) > 0) ? 'left' : 'right';
                    });

                    container.droppable({
                        tolerance: "pointer",
                        drop: function(event, ui) {

                            var elem,
                                id = _this.answers.get($(ui.draggable).data('id'));

                            if ($(this).children().length === 0) {

                                if (_this.multipleAnswerUsage == true && $(id.attributes.source).length === 0){
                                    elem = $(ui.draggable).clone().addClass('multi');
                                    elem.draggable(_this.draggableOpts);
                                } else {
                                    elem = $(ui.draggable);  
                                } 

                                elem.appendTo(this).css('background', model.color);

                                ui.helper.remove();

                           } else {
                                
                                if (id.attributes.source && !_this.multipleAnswerUsage) {
                                
                                    var orginal = $(this).children('.answer-element');

                                    var sourceBorderColor = $(id.attributes.source).css('border-color');

                                    orginal.appendTo($(id.attributes.source)).css('background', sourceBorderColor).removeAttr('data-correct');

                                    $(ui.draggable).appendTo(this).css('background', model.color).removeAttr('data-correct');

                                    ui.helper.remove();

                                    _this.eventBus.trigger('cleanupFeedback');

                                }
                                
                           }
                        } 
                    });

                    point.append(container);

                    this.exerciseMap.append(point);

                },

                addAnswer: function(model) {
                
                    var model = model.toJSON();

                    var answer = $('<div>', {
                        class: 'answer-element',
                        //text: model.content,
                        attr : {
                            'data-id': model.id
                        }
                    });

                    var answerBackground = $('<div>', {class: 'answer-element-background'});
                    var answerContent = $('<div>', {class: 'answer-element-content', html: model.content});

                    answer.append(answerBackground);
                    answer.append(answerContent);

                    answer.draggable(this.draggableOpts);

                    this.exerciseAnswersElement.append(answer);

                },

                clearExample: function () {
                    this.$el.empty();
                    this.render();
                }
                
            });

        }
);
