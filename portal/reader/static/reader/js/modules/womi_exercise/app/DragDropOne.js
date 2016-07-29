define(['_jquery',
        'underscore',
        'backbone',
        '../utils/imgParser',
        '../views/DragDropTable',
        '../views/DragDropLines',
        '../views/DragDropLinesNewTwo'],
        function($, _, backbone, imgParser, DragDropTableView, DragDropLinesView, DragDropLinesNewView) {

            var create = function(config, droppable, draggable, bus, source, readerApi) {

                var draggable = draggable,
                    droppable = droppable;

                if (config.randomize) {
                    draggable = _.shuffle(draggable);
                    //droppable = _.shuffle(droppable);
                };

                var view = {
                    "DGT-1": DragDropTableView,
                    //"DGL-1": DragDropLinesView
                    "DGL-1": DragDropLinesNewView
                };

                var Drop = Backbone.Model.extend({});
                var Drag = Backbone.Model.extend({});

                // Needs refactoring and moving to new file
                var DropCollection = Backbone.Collection.extend({
                    model: Drop
                });

                var DragCollection = Backbone.Collection.extend({
                    model: Drag
                });

                var exerciseDroppable = new DropCollection();

                var exerciseDraggable = new DragCollection();

                var callback = function(imgList) {
                    console.log("ALL IMAGES LOADED");
                    bus.trigger('allImagesLoaded', imgList);
                };

                _.each(draggable, function(draggable) {
                    draggable.content = imgParser.addImages(draggable.content, draggable.images, source, callback);
                    exerciseDraggable.add(draggable);
                });

                _.each(droppable, function(droppable) {
                    droppable.content = imgParser.addImages(droppable.content, droppable.images, source, callback);
                    exerciseDroppable.add(droppable);
                });
                
                var exerciseView = new view[config.type]({droppable: exerciseDroppable, draggable: exerciseDraggable, eventBus: bus, config: config, readerApi: readerApi});

                return {
                    view: exerciseView
                }

            };

            return {
                create: create
            }

        }
);
