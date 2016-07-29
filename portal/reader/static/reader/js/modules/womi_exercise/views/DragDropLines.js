define(['_jquery',
        'underscore',
        'backbone',
        '../../../libs/raphael',
        'text!../templates/drag_and_drop/lines_droppable.html',
        '../views/DragDropTable'],

        function($, _, backbone, raphael, lines_droppable, DragDropTableView) {

            return DragDropTableView.extend({
            
                className: 'drag-and-drop-lines',
                
                templateDroppable: _.template( lines_droppable ),

                startDragDrop: function() {
                    this.myLines = [];

                    // Overwrites this DragDropTable function.
                    var drgProps = {
                        helper: 'clone',
                        revert: 'true'
                    };
                    
                    // So, let's create SVG area for drawing lines.
                    this.$el.append('<div class="svg-draw-area" />');
                    this.svgDrawArea = this.$('.svg-draw-area');
                    this.svgDrawArea
                        .css('height', '500px')
                        .css('width', '990px');
                    

                    this.paper = raphael( this.svgDrawArea[0], this.svgDrawArea.width(), this.svgDrawArea.height() );

                    var that = this;

                    this.$('.draggable-element').draggable(drgProps);
                    
                    this.$('.droppable-element').droppable({
                        tolerance: 'pointer',
                        drop: function( event, ui ) {
                            if (!$(ui.draggable).hasClass('dragged-archer')) {
                                // remove all previously dropped items
                                $(this).children('div').remove();
                                // add cloned draggable, which is hidden
                                //$(this).append($(ui.draggable).clone().addClass('dragged-element'));
                                $(this).attr('data-dropped', $(ui.draggable.context).data('id'));
                                // add class dragged-archer, to dragged element in draggable-collection
                                $(ui.draggable).addClass('dragged-archer');
                                $(this).droppable('disable');
                                ui.helper.remove();
                                that.svgDrawLine($(this), $(ui.draggable)); 
                            }
                        }
                    });

                },
                
                svgClear: function() {
                    this.paper.clear();
                },

                svgDrawLine: function(target, source) {
                    // origin -> ending ... from left to right
                    // 10 + 10 (padding left + padding right) + 2 + 2 (border left + border right)
                    var originX = source.position().left + source.width() + 20 + 4;
                    var originY = source.position().top + ((source.height() + 20 + 4) / 2);

                    var endingX = target.position().left;
                    var endingY = target.position().top + ((target.height() + 20 + 4) / 2);

                    var space = 20;
                    var color = 'blue';

                    // draw lines
                    var a = "M" + originX + " " + originY + " L" + (originX + space) + " " + originY; // beginning
                    var b = "M" + (originX + space) + " " + originY + " L" + (endingX - space) + " " + endingY; // diagonal line
                    var c = "M" + (endingX - space) + " " + endingY + " L" + endingX + " " + endingY; // ending
                    var all = a + " " + b + " " + c;
                    
                    var obj = this.paper
                    .path(all)
                    .attr({
                        "stroke": color,
                        "stroke-width": 2,
                        "stroke-dasharray": "--.",
                        "title": "xx"
                    })
                    .node.id = 'line-' + source.data('id') + '-' + target.data('id');
                    this.myLines[this.myLines.length] = obj;
                },

                checkExercise: function(e) {
                    e.preventDefault();
                    var answeredList = this.$('.droppable-element'),
                        numOfCorrect = 0;

                    $('.droppable-element').removeClass('correct wrong');

                    _.each(answeredList, function(item) {
                        var userAnswer = $(item).data('dropped');
                        var itemId = $(item).data('id');
                        var correct = _.contains(this.droppable.get(itemId).get('correctDrg'), userAnswer);

                        if (!correct) {
                            $(item).addClass('wrong');
                        } else {
                            $(item).addClass('correct');
                            numOfCorrect += 1;
                        }

                        var result = numOfCorrect === this.draggable.size();

                        this.eventBus.trigger('getFeedback', result);
                        this.eventBus.trigger('clearButton');
                    }, this);
                },

                clearExample: function() {
                    this.svgClear();
                    this.$el.empty();
                    this.render();
                }

        });

    }
);
