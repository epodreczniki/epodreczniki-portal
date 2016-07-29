define([
    'jquery',
    'underscore',
    'backbone',
    'modules/core/Registry',
    './notes-cassandra',
    './utils',
    //'text!./templates/dialog.html'
    'text!./templates/bubble_note.html'
], function ($,
             _,
             backbone,
             Registry,
             notesPlatform,
             utils,
             dialogTemplate) {

    return backbone.View.extend({

        initialize: function (config) {
            this.config = config;
            this.editable = config.editable || false;
            //this.config.saveNote(config.nTxt, config.nLoc).call(null, 'nuka-nuka');

        },


        events: {
            'click #save-note': 'saveNote',
            'click #discard': 'remove',
            'click #delete': 'deleteNote',
            'click #switch-editable': 'switchEditable',
            'click .note-color-btn': 'setType',
            'click .note-all-overlay': 'saveNote',
            'keydown': 'keydownHandler',
            'click .settings': 'showEditBubble',
            'paste #note-content': 'getThumbnail',
            'click #close-thumbnail': 'removeThumbnail'
        },


        template: _.template(dialogTemplate),

        render: function () {
            this.$el.html(this.template({
                value: this.config.note.value,
                type: this.config.note.type
            }));

            var pos = this.config.position;

            if (!pos) {
                pos = _.clone(window.getSelection().getRangeAt(0).getBoundingClientRect());
                // This is because of the position: abcolute & lack of scroll position
                pos.top += $(window).scrollTop();
                this.config.position = pos;
            }

            var width = 280, height = 180, margin = 10;
            this.$('.note-bubble-dialog').css({
                top: pos.top - height - margin,
                left: pos.left + (pos.width / 2) - (width / 2)
            });
            this.getThumbnail();

            return this;
        },

        render2: function (edit) {
            this.$el.html(this.template({
                title: this.config.note.subject,
                value: this.config.note.value,
                colors: utils.colorList(0, 2),
                editable: edit || this.editable,
                accepted: this.config.note.accepted
            }));
            // Refactor.
            if (!this.editable) {
                var n = this.config.note.type;
                var $color = utils.colorList(n, n, 'selected');
                this.$('.note-types').html($color);
            }
            // Roll it over
            $("[data-type='" + this.config.note.type + "']").addClass('selected');
            return this;
        },

        setType: function (ev) {
            $(ev.target).addClass('selected').siblings().removeClass('selected');
            ;
            this.config.note.type = $(ev.target).data('type');
        },

        switchEditable: function () {
            this.editable = !this.editable;
            this.render();
        },

        saveNote: function (ev) {
            var value = utils.extractContent(this, '#note-content');
            //var value = this.$('#note-content').clone().children().remove().end().text();
            var subject = this.$('#note-title').val();
            this.config.note.subject = subject;
            this.config.note.value = value;
            this.config.saveNote(this.config.note);
            this.remove();
        },

        getThumbnail: function (ev) {
            setTimeout(function (ev) {
                var content = utils.extractContent(this, '#note-content');
                var urls = [];
                utils.findUrl(content, urls);
                for (var i = 0; i < urls.length; i++) {
                    var tempUrl;
                    tempUrl = utils.searchImage(urls[i]);
                    if (tempUrl !== "") {
                        this.$('#url-thumbnail').html(tempUrl);
                    }
                    else {
                        tempUrl = utils.searchVideo(urls[i]);
                        if (tempUrl !== "") {
                            this.$('#url-thumbnail').html(tempUrl);
                        }
                        else {
                            tempUrl = utils.searchSiteLogo(urls[i]);
                        }
                    }
                    if (!$('a:contains("' + urls[i] + '")').length) {
                        var current = this.$('#note-content').html();
                        this.$('#note-content').html(current.replace(urls[i], '<a class="visible">' + urls[i] + '</a>'));
                    }
                    var aElem = $('a:contains("' + urls[i] + '")');
                    if (aElem.next()[0] == null || aElem.next()[0].tagName != 'DIV') {
                        var className = aElem.attr("class");
                        if (className == 'visible') {
                            aElem.after('<div class="thumbnail" contenteditable="false"><div id="thumbnail-image">' + tempUrl + ' </div><button type="button" id="close-thumbnail" aria-label="Close">×</button><div id="thumbnail-title"><a href="' + urls[i] + '" target="_blank">' + utils.shortenText(urls[i], 20) + ' </a></div></div><br />');
                            aElem.attr('href', urls[i]);
                            aElem.hide();
                        }
                    }
                    if (this.$('#note-content').children().last()[0].tagName != 'BR') {
                        this.$('#note-content').append('<br />');
                    }
                    ;
                }
            }, 0)
        },

        removeThumbnail: function (ev) {
            $(ev.target).parent().prev().addClass('unvisible').removeClass('visible');
            $(ev.target).parent().prev().show();
            $(ev.target).parent().remove();
        },

        deleteNote: function (ev) {
            notesPlatform.deleteNoteByUser(this.config.note);
            this.remove();
        },

        showEditBubble: function (ev) {
            //ev.stopPropagation();
            var layout = Registry.get('layout');
            layout.trigger('showEditBubble', this.config.position, {
                note: this.config.note,
                save: this.config.saveNote
            });
            this.saveNote();
        },

        keydownHandler: function (ev) {
            ev.stopPropagation();
        }

    });

});
