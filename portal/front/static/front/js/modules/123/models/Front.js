define(['backbone','./BookCollection','./Book'],function(Backbone,BookCollection,Book){
    return Backbone.Model.extend({
        defaults:{
            activeBookCid:undefined,
            books:new BookCollection([new Book({name:'testowa'}),new Book({name:'testowa1'}),new Book({name:'testowa2'})])
        }        
    });
});
