define([], function(){
    var reg = {};
    return {
        set: function(id, value){
            reg[id] = value;
        },
        get: function(id){
            return reg[id];
        }
    }
});
