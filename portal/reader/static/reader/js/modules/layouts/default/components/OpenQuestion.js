define(['../../Component', 'jquery', 'underscore', 'modules/api/Utils', 'EpoAuth'], function (Component, $, _, Utils, Auth) {

    var EPO_READER_AUTH_ENABLE = ('{{ EPO_READER_AUTH_ENABLE }}' == 'True');

    return Component.extend({
        name: 'OpenQuestions',

        postInitialize: function (options) {
            var _this = this;
            this.listenTo(this._layout, 'moduleLoaded', function (params) {
                this.listenToOnce(this._layout, 'moduleContentTarget', function (obj) {
                    _this._loadQuestions(obj.target);
                });
                this.trigger('getModuleContent');
            });

        },

        _loadQuestions: function (mainNode) {
            var _this = this;
            require(['reader.api'], function (ReaderApi) {
                var ra = new ReaderApi(require, true);
                $(mainNode).find('.open-question').each(function () {
                    var t = $(this);
                    var id = t.attr('id');
                    var workArea = t.find('.work-area');
                    var problem = t.find('.problem').text();
                    ra.getOpenQuestion(id, function(data){
                        if(data.status == 'success'){
                            workArea.val(data.value.value);
                        }
                        _this._makeQuestionSavable(id, ra, problem, workArea);
                    });



                });
            })
        },

        getPageId: function() {
            return (window.location.hash != '' ? window.location.hash : 'NO_PAGE_ID');
        },

        _makeQuestionSavable: function(id, readerApi, problem, textArea){
            var firstVal = $(textArea).val();
            $(textArea).focusout(function(){
                if($(this).val() != '' || firstVal != '') {
                    readerApi.setOpenQuestion(id, problem, $(this).val(), function(data){
                        //console.log(data);
                    });
                }
            })
        }

    });
});