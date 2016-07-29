define([
    'declare',
    'underscore',
    'modules/models/PropertiesModel',
    'modules/models/PropertiesSaveCollection',
    'modules/view/blocks/states/NoOp'], function (declare, _, PropertiesModel, PropertiesSaveCollection, NoOp) {
    return declare({
        'static': {
            collection: new PropertiesSaveCollection(),
            getProperties: function (attrs) {
                this.collection.fetch();
                var props;
                if (this.collection.length == 0) {
                    props = new PropertiesModel(_.extend({currentState: NoOp}, attrs));
                    this.collection.add(props);
                    props.save();
                    return props;
                } else {
                    props = this.collection.at(0);
                    props.set('currentState', NoOp);
                    props.save();
                    return props;
                }
            }
        }
    });
});
