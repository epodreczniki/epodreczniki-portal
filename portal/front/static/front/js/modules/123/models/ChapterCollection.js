define(['underscore','backbone','./Chapter'],function(_,Backbone,Chapter){
    return Backbone.Collection.extend({
        model:Chapter,
        printInfo:function(){
            console.log("the number of chapters is: "+this.length);
            this.each(function(item){
                item.showChapterInfo();
            });
        }
    });
});
