define(['backbone'], function(Backbone) {

    return {
        
        toJSON: function() {
          var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
          json.cid = this.cid;
          return json;
        }

    };
    
});