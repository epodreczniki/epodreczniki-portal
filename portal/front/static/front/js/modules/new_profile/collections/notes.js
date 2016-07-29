define([
  'underscore',
  'backbone',
  '../models/note'
], function(_, Backbone, NoteModel){
  var NoteCollection = Backbone.Collection.extend({
    model: NoteModel,
    sort_param : 'latest',
    
    initialize: function () {
        this.sort_param = 'latest';
    },

    sortNotes: function(filterParams) {
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
  return NoteCollection;
});