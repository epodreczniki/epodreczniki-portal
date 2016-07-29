define([
    'declare',
    'underscore',
    'modules/models/CacheModel',
    'modules/models/CacheSaveCollection'],
    function (declare, _, CacheModel, CacheSaveCollection) {
    return declare({
        'static': {
            collection: new CacheSaveCollection(),
//            getProperties: function () {
//                this.collection.fetch();
//                var props;
//                if (this.collection.length == 0) {
//                    props = new CacheModel();
//                    this.collection.add(props);
//                    props.save();
//                    return props;
//                } else {
//                    props = this.collection.at(0);
//                    return props;
//                }
//            }
            getProperties: function () {
                var props;
                if (this.collection.length == 0) {
                    props = new CacheModel();
                    this.collection.add(props);
                    return props;
                } else {
                    props = this.collection.at(0);
                    return props;
                }
            }
        }
    });
});
