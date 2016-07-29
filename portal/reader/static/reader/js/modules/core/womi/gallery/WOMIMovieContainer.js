define(['modules/core/womi/WOMIMovieContainer', 'underscore'
], function (WOMIMovieContainer, _) {

    return WOMIMovieContainer.extend({
        render: function(){
            this._avElement = null;
            return WOMIMovieContainer.prototype.render.call(this);
        },

        hasFunctionality: function () {
            return true;
        },

        changeSize: function(size){
            this._resize()();
        },

        applyNewPrototype: function(){
            this.on('changeSize', this.changeSize);
        },

        postCreate: function(){
            this.video.on('ended', _.bind(function(event){
                this.trigger('ended');
            }, this));

            this.on('play', _.bind(function(){
                //what is with this jPlayer?? must 2x play to play
                this.video.play();
            }, this));

        }
    });
});