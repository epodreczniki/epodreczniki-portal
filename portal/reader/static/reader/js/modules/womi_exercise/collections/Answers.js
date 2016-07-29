define(['backbone', '../models/Answer'], function(Backbone, Answer) {
        
    var AnswersCollection = Backbone.Collection.extend({
        
        initialize: function(models, options) {
            this.options = options || {};
            
            this.presented = this.options.numberOfPresentedAnswers;
            this.correct = this.options.numberOfCorrectAnswerInSet;
            this.wrong =  this.presented - this.correct;
            
            this.random = this.options.randomize;
            this.setsEnabled = this.options.answerSets;
            
            this.generateMethod();
        },
        
        model: Answer,
        
        getCorrect: function() {
            return this.where({correct: true});
        },
        
        getWrong: function() {
            return this.where({correct: false});
        },
        
        generateMethod: function() {
            if (!this.setsEnabled) {
                this.method = this.randomCollection;
            } else {
                this.currentPosition = 0;
                this.method = this.answerSetsCollection;
            }
        },

        generateCollection: function() {
            return new Backbone.Collection( this.method() );
        },
        
        answerSetsCollection: function() {
            var numOfSets = this.size() / this.presented;
            
            if (this.random) {
                this.currentPosition = Math.floor(Math.random() * numOfSets) + 1;
            } else {
                if (this.currentPosition >= numOfSets) this.currentPosition = 0;
                this.currentPosition += 1;
            }
            
            var result = _.shuffle(this.where({set: this.currentPosition}));
            return result;
        },
        
        randomCollection: function() {
            var correctAnswers = _.sample(this.getCorrect(), this.correct),
                wrongAnswers = _.sample(this.getWrong(), this.wrong),
                answers = _.shuffle(correctAnswers.concat(wrongAnswers));
            
            return answers; 
        }
        
    });
    
    return AnswersCollection;
    
});