require(
    [
        'domReady',
        'modules/app/Main'
    ],
    function(domReady, main){
        domReady(function(){
            main.run();
        });
    }
);
