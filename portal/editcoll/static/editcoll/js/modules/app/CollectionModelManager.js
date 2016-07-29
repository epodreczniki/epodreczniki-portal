define([
        'declare',
        'underscore',
        'modules/models/CollectionModel',
        'modules/models/CollectionModelSaveCollection'],
    function (declare, _, CollectionModel, CollectionModelSaveCollection) {
        return declare({
            'static': {
                collection: new CollectionModelSaveCollection(),
                getProperties: function () {
                    this.collection.fetch();
                    var props;
                    if (this.collection.length == 0) {
                        props = new CollectionModel();
                        this.collection.add(props);
                        props.save();
                        return props;
                    } else {
                        this.collection.each(function(model, index) {
                                if(index == 0){
                                    props = model;
                                } else {
                                    model.destroy();
                                }
                            }
                        )
//                        props = this.collection.at(0);
                        return props;
                    }
                }
            }
        });
    });
