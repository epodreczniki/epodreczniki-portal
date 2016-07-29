define(['jquery',
        'underscore',
        'backbone',
        '../../core/Registry',
        '../../../libs/jquery.quizymemorygame',        
        'text!../templates/memory.html'],

        function($, _, backbone, Registry, quizymemorygame, memory_template) {
        
            'user strict';

            return backbone.View.extend({
            
                className: 'quiz-memorygame',

                templateBody: _.template( memory_template ),

                initialize: function(options) {
                    this.options = options || {};
                    this.eventBus = this.options.eventBus;

                    this.body = this.options.body;

                    this.eventBus.on('checkExercise', this.checkExercise, this);

                    this.readerApi = options.readerApi;
                },

                checkExercise: function(e) {
                    e.preventDefault();
                },

                initExercise: function() {
                    var _this = this;

                    var correctWcag = $("<div>",{
                        class: "quiz-answer-correct-wcag wcag-hidden",
                        text: "Dobrze"
                    });


                    this.readerApi.getUserVar("memory", function(response){
                        if(response.status == 'success') {
                            var memory = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                            if (memory !== null) {
                                _.each(memory, function(pair){
                                    _.each(_this.$('.card-container').find('.card'), function(card){
                                        var cardId = _this.$(card).attr("id");
                                        if(cardId === pair.card_one || cardId === pair.card_two){
                                            var item = _this.body.get(cardId);
                                            var content = item.get('content');
                                            _this.$(card).addClass('flipped correct');
                                            _this.$(card).prepend(correctWcag.clone());
                                            _this.$(card).children('.back').html(content);
                                            setTimeout(function(){
                                                _this.$(card).children('.backMS').html(content);
                                            }, 500);
                                        }
                                    });
                                });
                            }
                        }
                    });
                },

                render: function() {

                    this.$el.empty();
                    
                    this.list = $('<div class="card-list" />');

                    this.$el.append(this.list);

                    this.body.each(this.addRow, this);

                    function getInternetExplorerVersion() {
                        var rv = -1;
                        if (navigator.appName == 'Microsoft Internet Explorer')
                        {
                            var ua = navigator.userAgent;
                            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                            if (re.exec(ua) != null)
                                rv = parseFloat( RegExp.$1 );
                        }
                        else if (navigator.appName == 'Netscape')
                        {
                            var ua = navigator.userAgent;
                            var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                            if (re.exec(ua) != null)
                                rv = parseFloat( RegExp.$1 );
                        }
                        return rv;
                    }

                    this.createQuiz();

                    this.eventBus.trigger('hideCheckBtn');

                    if(getInternetExplorerVersion() != -1){
                        this.$('.card-container').find('.back').switchClass("back", "backMS");
                    }

                    this.initExercise();

                    return this;
                },

                addRow: function(model) {
                    var data = model.toJSON(),

                        newView = this.templateBody(data);

                    this.list.append(newView);
                },

                bindClick: function(elem) {
                    var that = this;
                    this.$(elem).bind('click', function() {
                        that.handleClick($(this));
                    })
                },

                unbindClick: function(el) {
                    $(el).unbind('click');
                },

                createQuiz: function() {
                    this.shown = [];
                    this.clickCounter = 0;
                    this.bindClick('.card');
                    this.correct = 0;
                    this.numOfPairs = this.$('.card-container').length / 2;
                },

                resetClick: function() {
                    var that = this;
                    this.clickCounter = 0;

                    var incorrect = this.$('.card-container').find('.card').not('.correct');

                    _.each(incorrect, function(incard){
                        if ( ($._data( incard, 'events' ) !== undefined ) && $._data( incard, 'events' ).click ){
                        } else {
                            $(incard).bind('click', function(ev) {
                                ev.stopPropagation();
                                that.handleClick(incard);

                            });
                        }
                    });
                },

                handleClick: function(card) {
                    var that = this;
                    var id = $(card).attr('id');
                    var item = this.body.get(id);
                    var content = item.get('content');

                    this.clickCounter = this.clickCounter + 1;

                    var memoryAnswers = [];

                    var correctWcag = $("<div>",{
                        class: "quiz-answer-correct-wcag wcag-hidden",
                        text: "Dobrze"
                    });

                    if (this.clickCounter < 3) {

                        $(card).addClass('flipped selected');
                        $(card).children('.back').html(content);

                        setTimeout(function(){
                            $(card).children('.backMS').html(content);
                        }, 500);

                        try{
                            if(Registry.get('layout')){
                                if ($(card).has("math, .MathJax").length) {
                                    Registry.get('layout').trigger('refreshContent', $(card), {typeset: true});
                                }
                            }
                        }catch(err){
                            console.log(err);
                        }

                        this.shown.push(card);

                        this.unbindClick(card);

                        if (this.shown.length === 2) {
                            var card1 = $(this.shown[0]);
                            var card2 = $(this.shown[1]);

                            var match1 = this.body.get(card1.attr('id')).get('match');
                            var match2 = this.body.get(card2.attr('id')).get('match');

                            if ((match1 === match2) && !(card1.attr('id') === card2.attr('id'))) {

                                card1.addClass('correct').removeClass('selected');
                                card2.addClass('correct').removeClass('selected');
                                card1.prepend(correctWcag.clone());
                                card2.prepend(correctWcag.clone());
                                that.correct += 1;
                                that.resetClick();

                                memoryAnswers.push({
                                    card_one: card1.attr('id'),
                                    card_two: card2.attr('id')
                                });

                                var answers = [];
                                this.readerApi.getUserVar("memory", function(response){
                                    if(response.status == 'success') {
                                        var memory = (typeof response.value === (typeof {}) ? response.value : JSON.parse(response.value));
                                        if (memory !== null) {
                                            answers = _.union(memoryAnswers, memory);
                                        }else{
                                            answers = memoryAnswers;
                                        }
                                        that.readerApi.setUserVar("memory", JSON.stringify(answers), function(status){
//                                            console.log(status);
                                        });
                                    } else if (response.status == 'failed' && response.reason == "not found") {
                                        that.readerApi.setUserVar("memory", JSON.stringify(memoryAnswers), function(status){
//                                            console.log(status);
                                        });
                                    }

                                });

                            } else {
                                this.$('.selected').addClass('wrong');
                                setTimeout(function() {
                                    that.$('.selected').children('.back').html('');
                                    that.$('.selected').children('.backMS').html('');
//                                    that.bindClick(this.$('.flipped'));
                                    that.$('.selected').removeClass('wrong selected flipped');

                                    that.resetClick();

                                }, 1000);
                            }

                            this.shown = [];

                            if (this.correct === this.numOfPairs) {
                                this.eventBus.trigger('getFeedback', true);
                            }
                        }

                    }else{
                        this.$('.card-container').find('.card').unbind('click');
                    }

                }

            });
        
        }
);
