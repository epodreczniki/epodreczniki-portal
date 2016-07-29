define(['backbone',
        '../utils/imgParser',        
        '../views/DragDropSort'],
        function(backbone, imgParser, DragDropSortView) {

            var create = function(config, sortable, correctOrder, bus, source, readerApi) {

                var sortable = sortable;

                if (config.randomize) {
                    sortable = _.shuffle(sortable);
                };

                var Sortable = Backbone.Collection.extend({});

                var exerciseSortable = new Sortable();

                _.each(sortable, function(element) {
                    element.content = imgParser.addImages(element.content, element.images, source);
                    exerciseSortable.add(element);
                });

                var exerciseView = new DragDropSortView({type: config.type, sortable: exerciseSortable, correctOrder: correctOrder, eventBus: bus, readerApi: readerApi});

                return {
                    view: exerciseView
                }

            };

            return {
                create: create
            }

        }
);

