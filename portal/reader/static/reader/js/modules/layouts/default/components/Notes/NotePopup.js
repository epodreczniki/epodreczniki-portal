define([
    'jquery',
    'underscore',
    'backbone',
    './notes-core',
    './notes-cassandra',
    './utils',
    './Dialog'
], function(
    $,
    _,
    backbone,
    notesCore,
    notesPlatform,
    utils,
    Dialog
) {

    return backbone.View.extend({

        className: 'ep-note-popup',

        initialize: function(opts) {
            // Missing controller here
            $('.reader-content').append(this.$el);
        },

        events: {
            'mouseup .add-note': 'addNote',
            'mouseup .add-bookmark': 'newBookmarkPrompt',
            'mouseup .note-color-btn.bookmark': 'addBookmark',
            'mouseup .delete-note': 'deleteNote'
        },

        bubble: function(element, position) {
            var $inner = $('<div>', { class: 'ep-note-popup-inner' });
            if (element) $inner.append(element);
        },

        newBubble: function(position, noteObj) {
            this.$el.removeAttr('style');
            this.noteObject = noteObj || null;
            this.pos = position || this.getSelectedTextPosition();
            var width = 120, height = 42;

            var $inner = $('<div>', { class: 'ep-note-popup-inner' });
            $inner.append('<button class="add-note"></button><button class="add-bookmark"></button><button class="delete-note"></button>');

            this.$el.css({
                top: this.pos.top - height - 5,
                left: this.pos.left + (this.pos.width / 2) - (width / 2)
            });

            this.$el.html($inner);
            this.$el.fadeIn();
        },

        editBubble: function(position, noteObj) {
            this.newBubble(position, noteObj);
            this.$('.ep-note-popup-inner').addClass('edit');
        },

        getSelectedTextPosition: function() {
            var pos = _.clone(window.getSelection().getRangeAt(0).getBoundingClientRect());
            pos.top += $(window).scrollTop();
            return pos;
        },

        newNotePrompt: function() {
            this.$el.fadeIn().html('');
            this.$el.append('<div class="ep-note-popup-inner"><button class="add-note"></button><button class="add-bookmark"></button></div>');
            var sel = window.getSelection().getRangeAt(0).getBoundingClientRect();
            var width = 100, height = 42;
            this.$el.css({
                top: sel.top + $(window).scrollTop() - height - 10,
                left: sel.left + (sel.width / 2) - (width / 2)
            });
            $('.reader-content').append(this.$el);
        },

        addNote: function(ev) {
            // TODO: GOD PLEASE REFACTOR!
            ev.stopPropagation();
            var dialog;
            if (this.noteObject) {
                dialog = new Dialog({
                    saveNote: this.noteObject.save, 
                    note: this.noteObject.note, 
                    editable: true,
                    position: this.pos
                });
                $('body').append(dialog.render().$el);
            } else {
                notesCore.startAddNote(false, function(saveCallback, noteText, value, note) {
                    note.type = 0;
                    note.text = noteText;
                    dialog = new Dialog({saveNote: saveCallback, note: note, editable: true});
                    $('body').append(dialog.render().$el);
                });
            }
            this.hide();
        },

        newBookmarkPrompt: function(ev) {
            ev.stopPropagation();
            var $div = $('<div>', { class: 'ep-note-popup-inner' });
            $div.append(utils.colorList(0, 4, 'bookmark'));
            this.$el.animate({
                width: "+=50",
                left: "-=25"
            }, 100, function() {
                this.$('.ep-note-popup-inner').addClass('more');
            }.bind(this));
            this.$el.html($div);
        },

        addBookmark: function(ev) {
            ev.stopPropagation();
            var type = $(ev.target).data('type');
            // This needs rethink too...
            if (this.noteObject) {
                var n = this.noteObject.note;
                n.type = type;
                this.noteObject.save(n);
            } else {
                notesCore.startAddNote(false, function(saveCallback, noteText, value, note) {
                    note.type = type;
                    note.text = noteText;
                    saveCallback.call(null, note);
                });
            }

            this.hide();
        },

        deleteNote: function(ev) {
            ev.stopPropagation();
            if (this.noteObject && this.noteObject.note) {
                notesPlatform.deleteNoteByUser(this.noteObject.note);
            };
            this.hide();
        },

        hide: function() {
            this.$el.removeAttr('style');
            this.$el.hide();
        }

    });

});
