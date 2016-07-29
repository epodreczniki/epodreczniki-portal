require(['domReady', 'EpoAuth'], function(domReady, EpoAuth) {

    domReady(function() {
        EpoAuth.connectToPage($('#topbar').find('.epo-auth-hook'));
    });

});

