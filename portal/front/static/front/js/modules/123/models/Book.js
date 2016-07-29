define(['backbone','./ChapterCollection'],function(Backbone,ChapterCollection){
    return Backbone.Model.extend({
        defaults:{
            name:'Xiazka',
            chapters:new ChapterCollection()
        },
        initialize:function(){
        }
    });
});
