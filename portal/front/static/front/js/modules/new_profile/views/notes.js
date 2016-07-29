define([
    'jquery',
    'underscore',
    'backbone',
    '../collections/notes',
    'text!../templates/notes/list.html',
    'text!../templates/notes/note.html',
    'text!../templates/notes/note-small.html',
    'text!../templates/notes/annotation.html',
    'text!../templates/notes/annotation-small.html'
], function ($, _, Backbone, NotesCollection, notesListTemplate, NoteTemplate, NoteTemplateSmall, AnnotationTemplate, AnnotationTemplateSmall) {
    var NoteListView = Backbone.View.extend({
        el: $(".notes-list"),

        initialize: function() {
            $(window).resize(_.debounce(function(){
                this.render();
            }.bind(this), 500));
        },

        render: function () {
            var _this = this;

            this.$el.html('');

            _.each(this.collection.models, function (note) {
                var compiledTemplate;

                if (note.get('subject') != null) {
                    if ($(window).width() > 800) {
                        compiledTemplate = _.template(AnnotationTemplate, note.getViewAttrs());
                    }
                    else {
                        compiledTemplate = _.template(AnnotationTemplateSmall, note.getViewAttrs());
                    console.log("CALLLLLEEEEEDDDD", $(window).width());
                    }

                } else {
                    if ($(window).width() > 800) {
                        compiledTemplate = _.template(NoteTemplate, note.getViewAttrs());
                    }
                    else {
                        compiledTemplate = _.template(NoteTemplateSmall, note.getViewAttrs());
                    }

                }

                _this.$el.append(compiledTemplate);
            })


        }
    });
    return NoteListView;
});
