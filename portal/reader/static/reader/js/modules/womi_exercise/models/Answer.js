define(['underscore', 'backbone', '../models/Generic'], function(_, Backbone, GenericModel) {

    var AnswerModel = Backbone.Model.extend({

        defaults: {
            content: '',
            name: ''
        }

    });

    _.extend(AnswerModel.prototype, GenericModel);

    return AnswerModel;

});
