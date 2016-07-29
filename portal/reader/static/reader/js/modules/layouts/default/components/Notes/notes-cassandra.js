define([
    'exports',
    './notes-core',
    './model/Note',
    './notes-context',
    './UUID',
    'underscore',
    'modules/layouts/default/components/Notes/Dialog',
    'modules/core/Registry',
], function(exports,core,Note,notesCtx, UUID, _, Dialog, Registry) {
    "use strict";

    var database = {'notes': []};

    function updateDatabase(data){
        database.notes = [];
        _.each(data, function(item){
            database.notes.push(Note.fromWebService(item));
        });
    }

    var updateItem = function(noteId, item){};

    var handleNoteClick = function(noteId, position) {
        var note = getNoteById(noteId);
        var saveNoteCallback = saveNote();

        var layout = Registry.get('layout');
        layout.trigger('showNoteBubble', position, {note: note, save: saveNoteCallback});

        //console.log('note.type', note.type);
        //var dialog = new Dialog({saveNote: saveNoteCallback, note: note, position: position});
        //
        // TODO: This is too far from what can be considered as clean
        // Think about rewriting notes-core a little bit.
        //$('body').append(dialog.render().$el);
    };

    var saveNote = function(toMerge) {
        return function(note) {
            if (note && note instanceof Note) {
                if (toMerge) {
                    toMerge.forEach(function(id) {
                        deleteNote(id);
                    }, this);
                };
                //if (note.type > 2) delete note.subject && delete note.value;
                var callback = note.accepted ? core.noteEditCallback : core.noteCreateCallback;
                var created = !note.accepted;
                note.accepted = true;
                if (typeof note.text === 'string') {
                    note.text = note.text.substring(0, 480);
                }
                saveToCassandra(note, created)
                //core.noteCreateCallback(note, toMerge);
                callback(note, toMerge);
            }
        };
    };

    var showNoteCreate = function(noteText, noteLocation, toMerge, callback){
        var saveNoteCallback = saveNote.call(null, toMerge);
        var filterProvider = new currentViewFilterProvider();
        var filter = filterProvider.thisPageIdentifiers();
        var handbookid = filterProvider.getTools().handbookIDGenerator(filter.collectionId, filter.collectionVersion, filter.collectionVariant);
        var noteId = UUID.generate();
        var note = new Note(noteId,notesCtx.getUserId(),handbookid,filter.moduleId, notesCtx.getPageId());
        note.location = noteLocation;
        note.accepted = false;
        note.subject = noteSubjectExcerpt(noteText);
        note.value = mergeNoteValue(toMerge) || "";

        if (callback) callback.call(null, saveNoteCallback, noteText, note.value, note);
    };

    var mergeNoteValue = function(toMerge) {
        if (toMerge) {
            return toMerge.reduce(function(res, id) {
                var note = getNoteById(id);
                res += (note.value + '\n');
                return res;
            }, "");
        } 
    };

    var noteSubjectExcerpt = function(body) {
        return body.trim().slice(0, 47) + '...';
    };

    var showMessage = function(msg){
        console.log('FROM NOTES: ', msg);
    };

    var getNoteById = function(noteId){
        for(var i=0;i<database.notes.length;i++){
            var k = database.notes[i].noteId || database.notes[i].localNoteId;
            if(k===noteId){
                return database.notes[i];
            }
        }
    }; 

    var saveToCassandra = function(note, created) {
        if (note && note instanceof Note) {
console.log("AAAA", note);
            if(created){
                database.notes.push(note);
            }
            var noteJson = JSON.stringify(note);
            updateItem(note.noteId || note.localNoteId, noteJson);
        }
    };

    var deleteNote = function(noteId){

    };

    var deleteNoteByUser = function(note) {
        var id = note.localNoteId;
        deleteNote(id);
        core.noteDeleteCallback(id);
    };


    var currentViewFilterProvider = function(){
        return {}
    };

    var getNotesForCurrentView = function(){
        var filtered = [];
        var filterProvider = new currentViewFilterProvider();
        var filter = filterProvider.thisPageIdentifiers();
         _.each(database.notes, function(item){
             var n = item;
             if(n && n.moduleId==filter.moduleId) {
                 filtered.push(n);
             }
        });
        return filtered;
    };
    
    exports.handleNoteClick=handleNoteClick;
    exports.showNoteCreate=showNoteCreate;
    exports.showMessage=showMessage;
    exports.getNotesForCurrentView=getNotesForCurrentView;

    exports.getNoteById = getNoteById;

    exports.deleteNoteByUser=deleteNoteByUser;

    exports.updateDatabase=updateDatabase;

    exports.setUpdateItemMethod = function(method){
        updateItem = method;
    };

    exports.setDeleteItemMethod = function(method){
        deleteNote = method;
    };

    exports.setViewFilterProvider = function(clazz){
        currentViewFilterProvider = clazz;
    };
});
