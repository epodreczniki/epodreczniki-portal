define(['underscore',
        'backbone',
        '../utils/imgParser',        
        '../views/Memory'], 

        function(_, backbone, imgParser, MemoryView) {

            var MAX_NUMBER_OF_PAIRS = 6;
            
            var create = function(config, body, bus, source, readerApi) {

                if (config.randomize) {
                    body = _.shuffle(body);
                };

                var Body = backbone.Collection.extend({});

                var bodyArray = [];
                _.each(body, function (card) {
                    card.content = imgParser.addImages(card.content, card.images, source);
                    bodyArray.push(card);
                });

                var bodyCollection = new Body();
                var pairCollection = [];
                while (bodyArray.length > 0) {
                    var pair = [];
                    _.each(bodyArray, function (body) {
                        var match = body.match;
                        if (pair.length < 1) {
                            pair.push(body);
                        } else {
                            _.each(pair, function (el) {
                                if (el.match === match) {
                                    pair.push(body);
                                    if (pairCollection.length < 1) {
                                        pairCollection.push(pair);
                                        pair = [];
                                    } else {
                                        var hasPair = false;
                                        _.each(pairCollection, function (pColl) {
                                            if (pColl[0].match === pair[0].match) {
                                                hasPair = true;
                                                return;
                                            } else {
                                                hasPair = false;
                                            }
                                        });
                                        if (!hasPair) {
                                            pairCollection.push(pair);
                                            pair = [];
                                        }
                                    }
                                }
                            });
                        }
                    });

                    _.each(pairCollection, function (pair) {
                        var matchToRemove = pair[0].match;
                        _.each(bodyArray, function (body, index) {
                            if (body.match === matchToRemove) {
                                bodyArray.splice(index, 1);
                            }
                        });
                    });
                }

                var pairsArray = [];

                if (pairCollection.length > MAX_NUMBER_OF_PAIRS) {
                    for (var i = 0; i < MAX_NUMBER_OF_PAIRS; i++) {
                        pairsArray.push(pairCollection[i]);
                    }
                }else{
                    pairsArray = pairCollection;
                }

                var randomPairs = [];
                _.each(pairsArray, function(pair){
                    randomPairs.push(pair[0]);
                    randomPairs.push(pair[1]);
                })

                randomPairs = _.shuffle(randomPairs);

                _.each(randomPairs, function(body){
                    bodyCollection.add(body);
                });

                var exerciseView = new MemoryView({body: bodyCollection, eventBus: bus, readerApi: readerApi});

                return {
                    view: exerciseView
                }

            };

            return {
                create: create
            }

        }
);

