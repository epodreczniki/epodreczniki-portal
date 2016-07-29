/** Based on the mobile version and on DragDropLines*/

define(['_jquery',
        'underscore',
        'backbone',
        'text!../templates/drag_and_drop/lines_droppable.html',
        '../views/DragDropTable'],

    function ($, _, backbone, lines_droppable, DragDropTableView) {

        //var lines = new Array();

        function drawLine(src, dest, sender) {
            var pos1 = $(src).position();
            var pos2 = $(dest).position();
            var lineWeight = 2;
            var lineColor = '#8fc3f8'; //@kolor-zadania-inne w standard/colors.less

            // Pozycja linii przy lewej kolumnie
            var x1 = pos1.left + src.outerWidth(true);
            var y1 = pos1.top + (src.outerHeight(true) / 2);

            // Pozycja linii przy prawej kolumnie
            var x2 = pos2.left;
            var y2 = pos2.top + (dest.outerHeight(true) / 2);

            // Długość linii
            var length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));

            // Środek linii
            var cx = ((x1 + x2) / 2) - (length / 2);
            var cy = ((y1 + y2) / 2) - (lineWeight / 2);

            // Kąt obrotu linii
            var angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);

            var lineDiv = $("<div></div>", {
                "class": "line"
            }).css({
                'position': 'relative',
                'left': cx,
                'top': cy,
                'width': length,
                'height': lineWeight,
                '-moz-transform': 'rotate(' + angle + 'deg)',
                '-webkit-transform': 'rotate(' + angle + 'deg)',
                '-o-transform': 'rotate(' + angle + 'deg)',
                '-ms-transform': 'rotate(' + angle + 'deg)',
                'transform': 'rotate(' + angle + 'deg)',
                'background-color': lineColor
            });

            sender.append(lineDiv);
            //lines.push([src, dest]);

            src.droppable('disable');
            src.draggable('disable');
            dest.droppable('disable');
            dest.draggable('disable');

            return function(){
                drawLine(src, dest, sender);
            }
        }

        function clearArray(array) {
            while (array.length > 0) {
                array.pop();
            }
        }


        return DragDropTableView.extend({
            checked: false,

            className: 'drag-and-drop-lines',


            postInitialize: function(options) {
                DragDropTableView.prototype.postInitialize.apply(this, arguments);
                this.savedLines = [];
                this.on('resize', function(){
                    this.$el.find('.line').remove();
                    _.each(this.savedLines, function(l){
                       l();
                    });
                });
                this.answersArray = [];
            },

            startDragDrop: function () {

                var draggableMaxWidth = 0;
                var droppableMaxWidth = 0;

                _.each($('.droppable-element'), function (item) {

                    if ($(item).outerWidth() > droppableMaxWidth) {
                        droppableMaxWidth = $(item).outerWidth();
                    }
                });

                _.each($('.draggable-element'), function (item) {
                    if ($(item).outerWidth() > draggableMaxWidth) {
                        draggableMaxWidth = $(item).outerWidth();
                    }
                });

                this.myLines = [];

                // Overwrites this DragDropTable function.
                var drgProps = {
                    helper: 'clone',
                    revert: 'true'
                };

                this.$('.draggable-element').draggable(drgProps);
                this.$('.droppable-element').draggable(drgProps);

                var that = this;

                this.$('.draggable-element').droppable({
                    tolerance: 'pointer',
                    drop: function (event, ui) {
                        if (!$(ui.draggable).hasClass('dragged-archer') &&
                            !$(ui.draggable).hasClass('draggable-element')
                           ) {
                            // remove all previously dropped items
                            //$(this).children('div').remove();
                            $(this).attr('data-dropped', $(ui.draggable.context).data('id'));
                            $(ui.draggable).addClass('dragged-archer');
                            ui.helper.remove();

                            var answerElement = [ $(ui.draggable).attr('data-id'), $(this).attr('data-id')];
                            that.answersArray.push(answerElement);
                            that.savedLines.push(drawLine($(this), $(ui.draggable), $(this).closest('.drag-and-drop-lines')));
                            that.eventBus.trigger('clearButton');
                        }
                    }
                });
                this.$('.droppable-element').droppable({
                    tolerance: 'pointer',
                    drop: function (event, ui) {
                        if (!$(ui.draggable).hasClass('dragged-archer') &&
                            !$(ui.draggable).hasClass('droppable-element')) {
                            // remove all previously dropped items
                            //$(this).children('div').remove();
                            $(this).attr('data-dropped', $(ui.draggable.context).data('id'));
                            $(ui.draggable).addClass('dragged-archer');
                            ui.helper.remove();

                            var answerElement = [$(this).attr('data-id'), $(ui.draggable).attr('data-id')];
                            that.answersArray.push(answerElement);
                            that.savedLines.push(drawLine($(ui.draggable), $(this), $(this).closest('.drag-and-drop-lines')));
                            that.eventBus.trigger('clearButton');
                        }
                    }
                });

            },

            checkExercise: function (e) {
                e.preventDefault();
                var answeredList = this.$('.droppable-element'),
                    numOfCorrect = 0;
                var draggableList = this.$('.draggable-element');

                $('.droppable-element').removeClass('correct wrong');

                var that = this;

                _.each(answeredList, function (item) {
                    var itemId = $(item).data('id');

                    var answer = $.grep(that.answersArray, function (e) {
                        return e[0] == itemId;
                    });

                    answer = answer.toString();
                    var userAnswer = answer.split(','); //returns drpX (answer id) and drgX (answer)

                    var pairedElement;

                    if (userAnswer[0].match(/drp/)) {
                        pairedElement = that.$("[data-id=" + userAnswer[1] + "]");
                    }
                    else if (userAnswer[0].match(/drg/)) {
                        pairedElement = that.$("[data-id=" + userAnswer[0] + "]");
                    }

                    var correct = _.contains(this.droppable.get(itemId).get('correctDrg'), userAnswer[1]);

                    if (!correct) {
                        $(item).addClass('wrong');
                        $(pairedElement).addClass('wrong');
                    } else {
                        $(item).addClass('correct');
                        $(pairedElement).removeClass('wrong');
                        $(pairedElement).addClass('correct');
                        numOfCorrect += 1;
                    }

                    this.$('.draggable-element').not('.correct').addClass('wrong');

                    var result = numOfCorrect === this.draggable.size();

                    this.eventBus.trigger('getFeedback', result);
                }, this);

                this.checked = true;
                //clear the array after checking
                //clearArray(that.answersArray);
            },

            clearExample: function () {
                this.$el.empty();
                this.render();
                this.checked = false;
                clearArray(this.answersArray);
            }

        });

    }
);
