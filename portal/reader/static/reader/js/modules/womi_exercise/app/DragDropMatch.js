define(['underscore',
        'backbone',
        '../utils/imgParser',
        '../views/DragDropMatch'],
        function(_, backbone, imgParser, DragDropMatchView) {

            var create = function(config, body, answers, bus, source, readerApi) {

                var answers = answers;

                if (config.randomize) {
                    answers = _.shuffle(answers);
                }

                var background = function(callback){
                    imgParser.addImages('<img/>', config.background, source, callback);
                };

                var Point = Backbone.Model.extend({

                    calcCurrentPosition: function(size) {
                        var currentPosition = {};
                        currentPosition.top = this.attributes.position[1] * size['height'];
                        currentPosition.left = this.attributes.position[0] * size['width'];

                        this.set({
                            currentPosition: currentPosition
                        });
                    }

                });

                var Body = Backbone.Collection.extend({

                        model : Point,

                        recalculatePositions: function(map) {
                            _.each(this.models, function(model){
                                var x = (model.attributes.position[0] - map['top.left'][0]) / (map['bottom.right'][0] - map['top.left'][0]);
                                var y = (model.attributes.position[1] - map['top.left'][1]) / (map['bottom.right'][1] - map['top.left'][1]);
                                model.set('position', [x,y]);
                            });
                        }

                    }),
                    body = new Body(body),
                    Answers = Backbone.Collection.extend({}),
                    answers = new Answers(answers);

                body.recalculatePositions(config.coordinates);

                var exerciseView = new DragDropMatchView({background: background, body: body, answers: answers, config: config, eventBus: bus, readerApi: readerApi});

                return {
                    view: exerciseView
                }

            };

            return {
                create: create
            }

        }
);
