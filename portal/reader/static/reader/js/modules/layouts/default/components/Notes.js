define(['../../Component', './Notes/NotePopup', './Notes/Dialog', './Notes/notes-cassandra', './Notes/notes-core', 'underscore', 'modules/api/Utils', 'EpoAuth'], function(Component, NotePopup, Dialog, notesPlatform, notesCore, _, Utils, Auth) {

    var EPO_READER_AUTH_ENABLE = ('{{ EPO_READER_AUTH_ENABLE }}' == 'True');

    return Component.extend({
        name: 'Notes',

        postInitialize: function(options) {

            this.notesStarted = false;

            this._initializeWithAuth();

            this.listenTo(this._layout, 'startNotes', function() {
                if (!this.notesStarted) {
                    this.bindEvents();
                    notesCore.showAllNotes();
                    this.notesStarted = true;
                    //$('.reader-content').append($('<div>', { class: 'note-markers' }));
                }
            });

            this.listenTo(this._layout, 'moduleLoaded', function (params) {
                if (this.notesStarted) notesCore.showAllNotes();
            });

        },

        _updateItemMethod: function(noteId, item) {

            var ra = (new Utils.ReaderInfoProvider()).thisPageIdentifiers();
            var handbook_id = Utils.handbookIDGenerator(ra.collectionId, ra.collectionVersion, ra.collectionVariant);
            var link = Utils.buildUrl(this.endpoints.note_update, {
                handbook_id: handbook_id,
                module_id: ra.moduleId,
                note_id: noteId
            });

            Auth.apiRequest('put', link, item, function () {
            });
        },

        _deleteItemMethod: function(noteId) {

            var ra = (new Utils.ReaderInfoProvider()).thisPageIdentifiers();
            var handbook_id = Utils.handbookIDGenerator(ra.collectionId, ra.collectionVersion, ra.collectionVariant);
            var link = Utils.buildUrl(this.endpoints.note_delete, {
                handbook_id: handbook_id,
                module_id: ra.moduleId,
                note_id: noteId
            });

            Auth.apiRequest('delete', link, null, function () {
            });
        },

        _updateDatabase: function(callback){
            var ra = (new Utils.ReaderInfoProvider()).thisPageIdentifiers();
            var handbook_id = Utils.handbookIDGenerator(ra.collectionId, ra.collectionVersion, ra.collectionVariant);
            var link = Utils.buildUrl(this.endpoints.note_collection, {
                handbook_id: handbook_id
            });

            Auth.apiRequest('get', link, null, function (data) {
                notesPlatform.updateDatabase(data);
                callback();
            });
        },

        _initializeWithAuth: function() {
            if (EPO_READER_AUTH_ENABLE) {
                var _this = this;

                notesPlatform.setUpdateItemMethod(_.bind(this._updateItemMethod, this));
                notesPlatform.setDeleteItemMethod(_.bind(this._deleteItemMethod, this));
                notesPlatform.setViewFilterProvider(Utils.ReaderInfoProvider);

                this.listenToOnce(Auth, Auth.POSITIVE_PING, function (data) {
                    _this.authenticated = true;
                    _this.endpoints = data.endpoints.notes;

                    _this._updateDatabase(function(){
                        _this._layout.trigger('startNotes');
                    });
                    //_this._layout.trigger('startNotes');
                });

                Auth.ping();
            }
        },

        bindEvents: function() {
            // Needs rethink and refactor
            this.popup = new NotePopup();

            this.listenTo(this._layout, 'showNoteBubble', function(position, noteObj) {
                //this.popup.newNotePrompt();
                var isNote = noteObj.note.value.trim().length;
                if (isNote) {
                    var dialog = new Dialog({
                        saveNote: noteObj.save,
                        note: noteObj.note,
                        editable: true,
                        position: position
                    });
                    // Should be inside Dialog...
                    $('body').append(dialog.render().$el);
                } else {
                    this.popup.editBubble(position, noteObj);
                }
            });

            this.listenTo(this._layout, 'showEditBubble', function(position, noteObj) {

                this.popup.editBubble(position, noteObj);
            });

            this.listenTo(this._layout, 'showNewNoteBubble', function() {
                this.popup.newBubble();
            });

            $('.reader-content').on('mouseup', function(ev) {
                var $elem = $(ev.target);
                setTimeout(function() {
                    var selectedText = notesCore.getSelectedText();
                    if (selectedText && selectedText.length) {
                        this._layout.trigger('showNewNoteBubble');
                    } else if (!$elem.hasClass('ep-note')) {
                        this.popup.hide();
                    }
                }.bind(this), 100);
            }.bind(this));
        }


    });

});
