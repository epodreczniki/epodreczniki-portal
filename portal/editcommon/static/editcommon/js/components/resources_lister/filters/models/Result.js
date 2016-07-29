define([
    'underscore', 
    'backbone', 
    'helpers/likedResults'
], function(
    _, 
    backbone, 
    likedResults
) {

    return Backbone.Model.extend({
        initialize: function() {
            var liked = likedResults.get().indexOf(this.attributes.identifier);
            this.liked = (liked > -1) ? true : false;

            this.listenTo(this, 'toggleLiked', this.toggleLiked);
        },

        toggleLiked: function() {
            var id = this.attributes.identifier;
            this.liked = !this.liked;
            (this.liked) ? likedResults.set(id) : likedResults.remove(id);
        }

    });

});


