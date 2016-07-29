define([
    'jquery',
    'underscore',
    'backbone',
    '../collections/progress',
    'text!../templates/progress/progress.html',
    'text!../templates/progress/progressGroup.html'
], function ($, _, Backbone, ProgressCollection, ProgressTemplate, ProgressGroupTemplate) {
    var ProgressListView = Backbone.View.extend({
        el: $(".progress-list"),
        render: function () {
            var _this = this;
            _.each(_this.collection.getGroups(), function(group){
                var compiledTemplate;

                compiledTemplate = _.template(ProgressGroupTemplate, group);
                var progressList = $('<div class="progress-group-progress-list"></div>');
                _.each(_this.collection.getModelsForGroup(group), function(progress){
                    var compiledTemplate2;
                    compiledTemplate2 = _.template(ProgressTemplate, progress.getViewAttrs());
                    progressList.append(compiledTemplate2);
                });

            _this.$el.append($(compiledTemplate).append(progressList));
            
            })


        }
    });
    return ProgressListView;
});
