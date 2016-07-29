define(['jquery','./spin', 'EpoAuth', 'underscore', 'backbone', 'text!modules/templates/note.html'], function ($, Spinner, EpoAuth, _, Backbone, note_tpl) {



    var els = $('.personal-notes');
//    els.sort(function(a, b){
//        var d1 = parseInt($(a).find('.date').data('stamp'));
//        var d2 = parseInt($(b).find('.date').data('stamp'));
//        console.log(d1, d2);
//        if(d1 > d2) return -1;
//        if(d2 > d1) return 1;
//        return 0;
//    });

    function make_notes(notes){
        console.log(notes);
        _.each(notes, function(note){
            var n = _.template(note_tpl, {value: note.value, title: note.related_object__Collection.md_title, date: note.modify_time});
            n = $(n);


            n.find('.moar').click(function(){
                $(this).next('.personal-note-more').toggle();
            });

            els.append(n);
        });
        els.find('.personal-note-more').hide();
    }

    var evt = {};
    _.extend(evt, Backbone.Events);

    EpoAuth.connectEventObject(evt);

    evt.on(EpoAuth.POSITIVE_LOGIN, function(data){
       console.log(data);
        EpoAuth.apiRequest('get', data.endpoints.notes.timeline + '?use_related=yes', null, function(data){
            make_notes(data);
        });
    });

    return function(){
        EpoAuth.ping();
    }
});