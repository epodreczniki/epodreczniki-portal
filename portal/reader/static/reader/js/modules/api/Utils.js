define([
], function () {

    var tools = {
        bookpartIDGenerator: function(collection_id, collection_version, variant, module_id){
            return (collection_id + ':' + collection_version + ':' + variant + ':' + module_id);
        },
        handbookIDGenerator: function(collection_id, collection_version, variant){
            return (collection_id + ':' + collection_version + ':' + variant);
        },
        buildUrl: function(url, args){
            for(var a in args){
                url = url.replace('{' + a + '}', args[a]);
            }
            return url;
        }
    };

    var ReaderInfoProvider = function(){};

    ReaderInfoProvider.prototype.thisPageIdentifiers = function() {
        var base = $('base');
        var o = {};
        o.moduleId = base.attr('data-module-id');
        o.collectionId = base.data('collection-id');
        o.collectionVariant = base.data('collection-variant');
        o.moduleVersion = base.data('module-version');
        o.collectionVersion = base.data('collection-version');
        return o;
    };

    ReaderInfoProvider.prototype.getTools = function() {
        return tools;
    };

    tools.ReaderInfoProvider = ReaderInfoProvider;

    return tools;
});