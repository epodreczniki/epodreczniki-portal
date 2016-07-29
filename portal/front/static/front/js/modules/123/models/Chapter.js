define(['backbone'],function(Backbone){
    return Backbone.Model.extend({
        defaults:{
            name: 'rozdzial',
            image: 'http://www.glamrap.pl/images/stories/c9/cddc34e.jpg',
            url: 'javascript:alert(\'do rozdzialu\')'
        },
        initialize:function(){
            this.on('change',function(){
                console.log('chapter has changed');
            });
            this.on('change:name',function(event){
                console.log('chapter name has changed to '+event.attributes['name']);
            });
        }
    });
});
