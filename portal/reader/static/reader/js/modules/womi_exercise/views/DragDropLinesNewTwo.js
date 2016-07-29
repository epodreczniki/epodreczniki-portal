define([
    'jquery',
    'underscore',
    'backbone',
    'EpoAuth',
    '../../core/Registry',
    './Generic'
], function(
    $,
    _,
    backbone,
    EpoAuth,
    Registry,
    GenericView
) {

    // Maybe move it to some module.
    $.fn.swap = function(b){ 
        b = jQuery(b)[0]; 
        var a = this[0]; 
        var t = a.parentNode.insertBefore(document.createTextNode(''), a); 
        b.parentNode.insertBefore(a, b); 
        t.parentNode.insertBefore(b, t); 
        t.parentNode.removeChild(t); 
        return this; 
    };

    return GenericView.extend({

        className: 'drag-drop-arrows',

        postInitialize: function(options) {
            this.columns = [options.draggable, options.droppable];
        },

        render: function() {
            this.$el.html('');

            this.$columns = [
                $('<div>', { class: 'column column-one' }),
                $('<div>', { class: 'column column-two' })
            ];

            this.columns.forEach(function(column, idx) {
                column.forEach(this.addItem(this.$columns[idx]), this);
            }, this);

            this.$el.append(this.$columns);

            this.initExercise();

            var _this = this;

            if(Registry.get('layout')){
                if (this.$el.find("math, .MathJax").length) {
                    Registry.get('layout').trigger('refreshContent', this.$el, {
                    callback: function(){
                        _this.afterRender();
                    },
                    typeset: true});
                }
                Registry.get('layout').on('selectedPage', _this.afterRender, _this);
            }

            this.afterRender();

            return this;
        },

        afterRender: function() {
            setTimeout(function() {
                var $elements = this.$el.find('.dgl-element');
                $elements.removeAttr('style');
                var heights = $.makeArray($elements).map(function(obj) {
                    return $(obj).outerHeight();
                });
                $elements.css('height', _.max(heights));

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

        addItem: function(column) {
            return function(model) {
                var common = {
                    containment: column,
                    scroll: false
                };
                var element = $('<div>', {
                    class: 'dgl-element',
                    'data-id': model.get('id')
                });
                var content = $('<div>', {
                    class: 'dgl-content',
                    html: model.get('content')
                });
                var icon = $('<div>', {
                    class: 'dgl-icon'
                });
                element.append([content, icon]);

                element.draggable(_.extend({}, common ,{
                    helper: 'clone',
                    start: function(ev, ui){
                        $(ev.target).find('.dgl-content').hide();
                    },
                    stop: function(ev, ui){
                        $(ev.target).find('.dgl-content').show();
                    }
                }));
                element.droppable(_.extend({}, common, {
                    hoverClass: 'drop-hover',
                    drop: function(ev, ui) {
                        $(ui.draggable).swap($(ev.target));
                        $(ui.draggable).find('.dgl-content').show();
                    }
                }));

                column.append(element);
            };
        },

        initExercise: function () {
            var _this = this;
            var $first = _.first(this.$columns).children();
            var $rest = this.$columns[1].children();

            this.readerApi.getUserVar("dragDropLines", function(response){
                if(response.status == 'success') {
                    var dragDropLines = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                    if (dragDropLines !== null) {
                        if (dragDropLines.answer == "saveonly") {
                            function newMatchCheck(dragDropTable) {
                                var secondTable = _this.$columns[1].children();
                                var swapObj = {};
                                _.each(dragDropTable, function (ddl) {
                                    _.each($first, function (element, idx) {
                                        if (_this.$(element).data('id') == ddl.drag) {
//                                            _this.$(element).addClass('correct');
                                            _.each(secondTable, function (el, sec_idx) {
                                                if (_this.$(el).data('id') == ddl.drop) {
//                                                    _this.$(el).addClass('correct');
                                                    if (_this.$(element).index() != _this.$(el).index()) {
                                                        swapObj = {
                                                            first_id: _this.$(element).index(),
                                                            second_id: _this.$(el).index(),
                                                            drop_id: _this.$(el).data('id')
                                                        };
                                                    }
                                                }
                                            })
                                        }
                                    });
                                });
                                if (!($.isEmptyObject(swapObj))) {
                                    var first = secondTable.filter(":eq(" + swapObj.first_id + ")");
                                    var second = secondTable.filter(":eq(" + swapObj.second_id + ")");

                                    $(first).swap($(second));

                                    var newDragDropLines = _.without(dragDropTable, _.findWhere(dragDropTable, {drop: swapObj.drop_id}));

                                    if (newDragDropLines.length > 0) {

                                        newMatchCheck(newDragDropLines);

                                    }
                                }
                            }


                            var swapObject = {};
                            _.each(dragDropLines.value, function (ddl) {
                                _.each($first, function (element, idx) {
                                    if (_this.$(element).data('id') == ddl.drag) {
//                                        _this.$(element).addClass('correct');
                                        _.each($rest, function (el, sec_idx) {
                                            if (_this.$(el).data('id') == ddl.drop) {
//                                                _this.$(el).addClass('correct');
                                                if (_this.$(element).index() != _this.$(el).index()) {
                                                    swapObject = {
                                                        first_id: _this.$(element).index(),
                                                        second_id: _this.$(el).index(),
                                                        drop_id: _this.$(el).data('id')
                                                    };
                                                }
                                            }
                                        })
                                    }
                                });
                            });

                            if (!($.isEmptyObject(swapObject))) {

                                var first = $rest.filter(":eq(" + swapObject.first_id + ")");
                                var second = $rest.filter(":eq(" + swapObject.second_id + ")");

                                $(first).swap($(second));

                                var newDragDropLines = _.without(dragDropLines.value, _.findWhere(dragDropLines.value, {drop: swapObject.drop_id}));

                                if (newDragDropLines.length > 0) {
                                    newMatchCheck(newDragDropLines);
                                }
                            }

                        } else if (dragDropLines.answer == "correct") {
                            _this.eventBus.trigger('setMessage', "To zadanie zostało rozwiązane poprawnie.");
                        } else if (dragDropLines.answer == "incorrect") {
                            _this.eventBus.trigger('setMessage', "To zadanie jest rozwiązane niepoprawnie.");
                        }
                    }
                }
            });

        },

        checkExercise: function(ev) {
            ev.preventDefault();

            var answersState = this._checkAnswers();

            this.readerApi.setUserVar("dragDropLines", JSON.stringify(answersState[1]), function(status){
                console.log(status);
            });

            this.eventBus.trigger('getFeedback', answersState[0]);


        },

        _checkAnswers: function(state) {
            var $first = _.first(this.$columns).children();
            var $rest = this.$columns[1].children();
            var wrong;

            var dragDropLines = [];



            var correctWcag = $("<div>",{
                class: "quiz-answer-correct-wcag wcag-hidden",
                text: "Dobrze"
            });

            var incorrectWcag = $("<div>",{
                class: "quiz-answer-incorrect-wcag wcag-hidden",
                text: "Źle"
            });

            $rest.each(function(idx, node) {
                var $c1 = $($first[idx]),
                    $c2 = $(node),
                    id = $c2.data('id');

                var correct = this.columns[1].get(id).get('correctDrg')[0];
                var isCorrect = $c1.data('id') === correct;

//                $c1.add($c2)
//                    .removeClass('correct wrong')
//                    .addClass(isCorrect ? 'correct' : 'wrong');

                if (isCorrect) {
                    if (state === undefined) {
                        $c1.add($c2).removeClass('correct wrong').addClass('correct');
                        $c1.find('.quiz-answer-incorrect-wcag').remove();
                        $c1.find('.quiz-answer-correct-wcag').remove();
                        $c1.prepend(correctWcag.clone());
                    }
                    dragDropLines.push({
                        drag: $c1.data('id'),
                        drop: $c2.data('id'),
                        correct: 'true'
                    });
                } else {
                    if (state === undefined) {
                        $c1.add($c2).removeClass('correct wrong').addClass('wrong');
                        $c1.find('.quiz-answer-incorrect-wcag').remove();
                        $c1.find('.quiz-answer-correct-wcag').remove();
                        $c1.prepend(incorrectWcag.clone());

                    }
                    dragDropLines.push({
                        drag: $c1.data('id'),
                        drop: $c2.data('id'),
                        correct: 'false'
                    });
                }

                if (!isCorrect) wrong = true;

            }.bind(this));

            var answer = '';
            if (state === undefined) {
                answer = !wrong ? 'correct' : 'incorrect';
            } else {
                answer = "saveonly";
            }

            var dragDropLinesState = {
                answer: answer,
                value:  dragDropLines
            };

            return [!wrong, dragDropLinesState];
        },


        saveState: function(e){
            e.preventDefault();

            var answersState = this._checkAnswers("saveonly");

            this.readerApi.setUserVar("dragDropLines", JSON.stringify(answersState[1]), function(status){
                console.log(status);
            });

        }

    });

});
