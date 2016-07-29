!function (name, definition) {
  if (typeof module != 'undefined' && module.exports) {
      module.exports['universal_logout'] = definition();
  }
  else if (typeof define == 'function') {
      define(definition);
  }
  else {
      this[name] = definition();
  }
}('universal_logout', function () {
    var LOCAL_STORAGE_VARIABLE = 'epo_universal_logout_info';

    var callbacks = [];

    function getFromLS(){
        var obj = null;
        try{
            obj = JSON.parse(localStorage[LOCAL_STORAGE_VARIABLE]);
        }catch(e) {
            obj = {status: 'none', hash: 'none'};
        }
        return obj;
    }

    function startPolling(){
        var lastStatus = getFromLS();

        var poll = function(){
            var status = getFromLS();
            if(status){
                if(status.status && status.status == 'loggedOut' && status.hash != lastStatus.hash){
                    lastStatus = status;
                    console.log('status changed', status);
                    for(var i = 0; i < callbacks.length; i++){
                        callbacks[i](status);
                    }
                }
            }
            setTimeout(poll, 2000);
        };
        setTimeout(poll, 2000);
    }

    return {
        listenToLogout: function(callback){
            callbacks.push(callback)
        },

        initListening: function(){
            startPolling();
        },

        logout: function(){
            localStorage[LOCAL_STORAGE_VARIABLE] = JSON.stringify({
                status: 'loggedOut',
                hash: '' + Math.random()
            });
        },
        initializeDefaultAction: function(){
            this.listenToLogout(function(){
                window.location.reload();
            });
        }
    }

});
