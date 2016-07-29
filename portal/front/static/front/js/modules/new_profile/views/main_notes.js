define([
    'jquery',
    'underscore',
    'backbone',
    'EpoAuth',
    './Generic',
    '../models/note',
    '../collections/notes',
    '../views/notes'
], function ($, _, Backbone, EpoAuth, GenericView, NoteModel, NotesCollection, NotesView) {

    function combineQuery(params){
        var ret = '';
        for(var p in params){
            if(params[p] != undefined) {
                ret += p + '=' + params[p] + '&';
            }
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
    }

    var FilterView = Backbone.View.extend({
        el: $('.aside-toolbar'),
        initialize: function(){
            var _this = this;

            this.$el.find('#note_order_select').change(function(){
                _this.trigger('sorting', {
                    option: $(this).find(':selected').val()
                });
            });
            this.subjectSelect = this.$el.find('#subject_select');
            this.colorSelect = this.$el.find('.note-color-picker');
            this.noteType = this.$el.find('#type_select');
            this.dateStart = this.$el.find('#profile-notes-date-start');
            this.dateEnd = this.$el.find('#profile-notes-date-end');
            this.orderSelect = this.$el.find('#note_order_select');
        },

        render: function(){
            var _this = this;
            $(".note-color-pick").on("click", function (ev) {
                $(".note-color-pick").removeClass("active");

                var radio = $(ev.target).find("input[type=radio]");

                if ($(radio)[0].checked) {
                    $(radio)[0].checked = false;
                }
                else {
                    _this.colorSelect.find('input[name=color]').attr('checked', null);
                    $(radio)[0].checked = true;
                    $(ev.target).addClass("active");
                }

            });


            function _triggerFiltering() {
                _this.trigger('filtering', {
                        subject: _this.subjectSelect.val(),
                        color: $(_this.colorSelect.find('input[name=color]:checked')).val(),
                        type: _this.noteType.val(),
                        dateStart: _this.dateStart.datepicker( "getDate") != null ? _this.dateStart.datepicker( "getDate").getTime() : -1,
                        dateEnd: _this.dateEnd.datepicker( "getDate" ) != null ? 24*60*60*1000 +_this.dateEnd.datepicker( "getDate" ).getTime() : -1

                    });
            }


            this.$el.find('#clear-filter').click(function(){
                $(".note-color-pick").removeClass("active");
                var checked = _this.colorSelect.find('input[name=color]:checked');
                if(checked.length > 0){
                    checked[0].checked = false;
                }
                _this.subjectSelect.val('all');
                _this.noteType.val('all');
                $("#profile-notes-date-start").val("");
                $("#profile-notes-date-end").val("");
                _this.orderSelect.val('latest');
                _this.trigger('sorting', {
                    option: 'latest'
                });

                _triggerFiltering();
            });

            this.subjectSelect.on('change', function(ev){ _triggerFiltering(); });
            this.colorSelect.on('click', function() {_triggerFiltering();});
            this.noteType.on('change', function(ev){ _triggerFiltering(); });
            this.dateStart.on('change', function(ev){
                _this.dateEnd.datepicker( "option", "minDate", _this.dateStart.datepicker( "getDate" ) );
                _triggerFiltering(); });
            this.dateEnd.on('change', function(ev){
                _this.dateStart.datepicker( "option", "maxDate", _this.dateEnd.datepicker( "getDate" ) );
                _triggerFiltering(); });


        }
    });

    var MainNotesView = GenericView.extend({
        el: $(".notes-content-wrap"),

        viewButton: '#profile-notes-tab',

        events: {
          'click .note-foldable': 'noteFoldingToggle', //for both notes and annotations on small screens
          'click .note-foldable-big': 'noteBigFoldingToggle', //for notes on big screens - different elements folding
        },

        getQueryParams: function(){
            var alwaysFilter = {
                mode: 'filter',
                use_related: 'yes'
            };

            _.extend(alwaysFilter, this.filterParams);

            return alwaysFilter;
        },

        postInitialize: function (options) {
            this._options = options;

            EpoAuth.connectEventObject(this);
            this.filterView = new FilterView();
            this.filterView.render();

            var _this = this;

            this.filterParams = {};

            this.listenTo(this.filterView, 'filtering', function(data){
                console.log("filtering data", data);
                _this.filterParams = data;
                _this.render();
            });
            this.sortingParams = {};
            this.listenTo(this.filterView, 'sorting', function(event, option){
                var option = option || event.option;
                _this.sortingParams = option;
                _this.render(true);
            });
            $(window).resize(_.debounce(function(){
                if(_this.notesView){
                    _this.notesView.render();
                }
            }, 500));
        },

        showContent: function(sortOnly) {
            var _this = this;
            if (sortOnly) {
                var notesCollection = _this.collection;
                _this.prepareCollection(notesCollection);
                return;
            }
        },

        getData: function(cb, params) {
            var params = combineQuery(this.getQueryParams());
            EpoAuth.apiRequest('get', this.controller.apiData.endpoints.notes.search + '?' + params, null, function (data) {
                var notesCollection = new NotesCollection(data);
                this.collection = notesCollection;
                this.prepareCollection(notesCollection);
                cb.call(this, params);
            }.bind(this));
        },

        noteFoldingToggle: function(ev) {
            $(ev.target).closest('.note-foldable').toggleClass('folded');
        },

        noteBigFoldingToggle: function(ev) {
            $(ev.target).closest('.note-foldable-big').toggleClass('folded');
        },

        prepareCollection: function (notesCollection) {
            var _this = this;
            notesCollection.sortNotes(_this.sortingParams);
            var notesView = new NotesView({collection: notesCollection});
            this.$el.find('article').remove();
            notesView.render();
        }

    });

    return MainNotesView;
});
