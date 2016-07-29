var define = function(name, imports, returnFunction){
    if(name == 'reader.api') {
        window.epoReaderApi = returnFunction(declare, jQuery)
    }else if(name == 'embed.api') {
        window.epoEmbedApi = returnFunction(jQuery);
    }
};
