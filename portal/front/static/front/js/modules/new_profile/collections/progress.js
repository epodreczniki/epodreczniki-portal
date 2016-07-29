define([
  'underscore',
  'backbone',
  '../models/progress'
], function(_, Backbone, ProgressModel){

    var RELATED_PREFIX = 'related_object__';

    function generateHeader(subject, coll){
        return subject + ' - ' + coll.md_title;
    }

    var ProgressCollection = Backbone.Collection.extend({
        model: ProgressModel,
        getGroups: function() {

            var groups = {};

            _.each(this.models, function(progress){
                var key = progress.get('handbook_id')+progress.get('module_id');
                if (groups[key]==undefined) {
                    var group = {};
                    var relatedCollection = progress.get(RELATED_PREFIX + 'Collection');
                    group['header'] = generateHeader(relatedCollection['md_subject']['md_name'], relatedCollection );
                    group['title'] = relatedCollection[RELATED_PREFIX + 'Module']['md_title'];
                    group['models'] = [];
                    group['models'].push(progress);
                    groups[key] = group;
                } else {
                    groups[key]['models'].push(progress);
                }
            });
            return groups;
    
        },
        getModelsForGroup: function(group) {
          return group['models'];
        },

        sort_param : 'latest',

        initialize: function () {
            this.sort_param = 'latest';
        },

        sortProgress: function(filterParams) {
            if (filterParams !== undefined) {
                this.sort_param = filterParams;
                this.sort();
            }
        },

        comparator: function (a, b) {
            try {
                switch(this.sort_param){
                    case 'oldest':
                        var timeA = a.get('modify_time');
                        var timeB = b.get('modify_time');
                        if ( timeA > timeB ) return 1;
                        if ( timeB > timeA ) return -1;
                        return 0;
                        break;
                    case 'asc':
                        var titleA = a.get('related_object__Collection')['related_object__Module'].md_title.toLowerCase();
                        var titleB = b.get('related_object__Collection')['related_object__Module'].md_title.toLowerCase();
                        if ( titleA > titleB ) return 1;
                        if ( titleB > titleA ) return -1;
                        return 0;
                        break;
                    case 'desc':
                        var titleA = a.get('related_object__Collection')['related_object__Module'].md_title.toLowerCase();
                        var titleB = b.get('related_object__Collection')['related_object__Module'].md_title.toLowerCase();
                        if ( titleA > titleB ) return -1;
                        if ( titleB > titleA ) return 1;
                        return 0;
                        break;
                    default:
                        var timeA = a.get('modify_time');
                        var timeB = b.get('modify_time');
                        if ( timeA > timeB ) return -1;
                        if ( timeB > timeA ) return 1;
                        return 0;
                }
            } catch (ex) {
                console.log("Sorting error: objects with wrong data.",ex);
                return 0;
            }
        }
      });
    return ProgressCollection;
});