define(['underscore',
        'backbone',
        '../views/Crossword'], 

        function(_, backbone, CrosswordView) {
            
            var create = function(config, body, bus, readerApi) {

                var Body = backbone.Collection.extend({});

                var bodyCollection = new Body(body);

                var exerciseView = new CrosswordView({body: bodyCollection, solutionPosition: config.solutionPosition, eventBus: bus, readerApi: readerApi});

                return {
                    view: exerciseView
                }

            };

            return {
                create: create
            }

        }
);
