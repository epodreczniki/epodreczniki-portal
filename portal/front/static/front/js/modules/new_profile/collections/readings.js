define([
    'underscore',
    'backbone',
    '../models/reading'
], function(_, Backbone, ReadingModel){
    var ReadingCollection = Backbone.Collection.extend({
        model: ReadingModel,
        sort_param : 'oldest',

        initialize: function () {
            this.sort_param = 'oldest';
        },

        sortReadings: function(filterParams) {
            if (filterParams !== undefined) {
                this.sort_param = filterParams;
                this.sort();
            }
        },

        comparator: function (a, b) {
            switch(this.sort_param){
                case 'oldest':
                    var timeA = a.get('modify_time');
                    var timeB = b.get('modify_time');
                    if ( timeA > timeB ) return 1;
                    if ( timeB > timeA ) return -1;
                    return 0;
                    break;
                case 'asc':
                    var titleA = a.get('related_object__Collection').md_title.toLowerCase();
                    var titleB = b.get('related_object__Collection').md_title.toLowerCase();
                    if ( titleA > titleB ) return 1;
                    if ( titleB > titleA ) return -1;
                    return 0;
                    break;
                case 'desc':
                    var titleA = a.get('related_object__Collection').md_title.toLowerCase();
                    var titleB = b.get('related_object__Collection').md_title.toLowerCase();
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
        }
    });
    return ReadingCollection;
});