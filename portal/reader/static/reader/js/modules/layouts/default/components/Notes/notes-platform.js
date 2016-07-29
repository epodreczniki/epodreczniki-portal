define([
    'exports',
    './notes-core',
    './model/Note',
    './notes-context',
    './UUID',
    'modules/layouts/default/components/Notes/Dialog'
], function(exports,core,Note,notesCtx, UUID, Dialog) {
    "use strict";

    var handleNoteClick = function(noteId, ev) {
        var note = getNoteById(noteId);
        var saveNoteCallback = saveNote();
        //console.log('note.type', note.type);
        var dialog = new Dialog({saveNote: saveNoteCallback, note: note, ev: ev});
        $('body').append(dialog.render().$el);
    };

    var saveNote = function(toMerge) {
        return function(note) {
            if (note && note instanceof Note) {
                if (toMerge) {
                    toMerge.forEach(function(id) {
                        deleteNote(id);
                    }, this);
                };
                if (note.type > 2) delete note.subject && delete note.value;
                var callback = note.accepted ? core.noteEditCallback : core.noteCreateCallback;
                note.accepted = true;
                saveToLocalStorage(note);
                //core.noteCreateCallback(note, toMerge);
                callback(note, toMerge);
            }
        };
    };

    var showNoteCreate = function(noteText, noteLocation, toMerge, callback){
        var saveNoteCallback = saveNote.call(null, toMerge);

        var noteId = UUID.generate();
        var note = new Note(noteId,notesCtx.getUserId(),notesCtx.getHandbookId(),notesCtx.getModuleId(), notesCtx.getPageId());
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
                res += (note.value + '\n')
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
        for(var i=0;i<localStorage.length;i++){
            var k = localStorage.key(i);
            if(k===noteId){
                //return localStorage.getItem(k);
                return Note.fromJSONString(localStorage.getItem(k));    
            }
        }
    }; 

    var saveToLocalStorage = function(note) {
        if (note && note instanceof Note) {
            var noteJson = JSON.stringify(note);
            localStorage.setItem(note.localNoteId,noteJson);
        }
    };

    var deleteNote = function(noteId){
        localStorage.removeItem(noteId);
    };

    var deleteNoteByUser = function(note) {
        var id = note.localNoteId;
        deleteNote(id);
        core.noteDeleteCallback(id);
    };

    var getNotesUserBookModule = function(userId,handbookId,moduleId){
        var res = [];
        for (var key in localStorage){
            var jsonStr = localStorage.getItem(key);
            var n = Note.fromJSONString(jsonStr);
            if(n && n.localUserId==userId && n.handbookId == handbookId && n.moduleId==moduleId){
                res.push(n);
            }
        }
        return res;
    }; 

    var getNotesForCurrentView = function(){
        return getNotesUserBookModule(notesCtx.getUserId(),notesCtx.getHandbookId(),notesCtx.getModuleId());
    };
    
    exports.handleNoteClick=handleNoteClick;
    exports.showNoteCreate=showNoteCreate;
    exports.showMessage=showMessage;
    exports.getNotesForCurrentView=getNotesForCurrentView;

    exports.deleteNoteByUser=deleteNoteByUser;
});
